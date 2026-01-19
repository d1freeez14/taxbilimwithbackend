const { query } = require('../lib/db');
const crypto = require('crypto');
const express = require('express');
const { requireRole } = require('../middleware/auth');

const router = express.Router();

// Get all enrollments (ADMIN only)
router.get('/', requireRole(['ADMIN']), async (req, res) => {
  try {
    const enrollmentsQuery = `
      SELECT 
        e.*,
        c.title as course_title,
        c.image_src as course_image,
        c.price as course_price,
        a.name as author_name,
        u.name as user_name,
        u.email as user_email
      FROM enrollments e
      JOIN courses c ON e.course_id = c.id
      JOIN authors a ON c.author_id = a.id
      JOIN users u ON e.user_id = u.id
      ORDER BY e.enrolled_at DESC
    `;

    const result = await query(enrollmentsQuery);
    res.json({ enrollments: result.rows });
  } catch (error) {
    console.error('Error fetching enrollments:', error);
    res.status(500).json({ message: 'Server error.' });
  }
});

// Get user enrollments
router.get('/my-enrollments', requireRole(['STUDENT', 'TEACHER', 'ADMIN']), async (req, res) => {
  try {
    const userId = req.user.id;

    const enrollmentsQuery = `
      SELECT 
        e.*,
        c.title as course_title,
        c.image_src as course_image,
        c.price as course_price,
        a.name as author_name,
        progress.total_lessons,
        progress.completed_lessons,
        CASE
          WHEN progress.total_lessons = 0 THEN 0
          ELSE ROUND((progress.completed_lessons::numeric / progress.total_lessons) * 100)
        END as progress
      FROM enrollments e
      JOIN courses c ON e.course_id = c.id
      JOIN authors a ON c.author_id = a.id
      LEFT JOIN LATERAL (
        SELECT
          COUNT(l.id) AS total_lessons,
          COALESCE(SUM(CASE WHEN lp.completed = true THEN 1 ELSE 0 END), 0) AS completed_lessons
        FROM modules m
        JOIN lessons l ON l.module_id = m.id
        LEFT JOIN lesson_progress lp
          ON lp.lesson_id = l.id AND lp.user_id = e.user_id
        WHERE m.course_id = e.course_id
      ) progress ON true
      WHERE e.user_id = $1
      ORDER BY e.enrolled_at DESC
    `;

    const result = await query(enrollmentsQuery, [userId]);
    res.json({ enrollments: result.rows });
  } catch (error) {
    console.error('Error fetching enrollments:', error);
    res.status(500).json({ message: 'Server error.' });
  }
});

// Enroll in a course
router.post('/:courseId', requireRole(['STUDENT', 'TEACHER', 'ADMIN']), async (req, res) => {
  try {
    const { courseId } = req.params;
    const userId = req.user.id;

    const enrollQuery = `
      INSERT INTO enrollments (user_id, course_id)
      VALUES ($1, $2)
      ON CONFLICT (user_id, course_id) DO NOTHING
      RETURNING *
    `;

    const result = await query(enrollQuery, [userId, courseId]);

    if (result.rows.length === 0) {
      return res.status(400).json({ message: 'Already enrolled in this course.' });
    }

    res.status(201).json({ enrollment: result.rows[0] });
  } catch (error) {
    console.error('Error enrolling in course:', error);
    res.status(500).json({ message: 'Server error.' });
  }
});

// Unenroll from a course
router.delete('/:courseId', requireRole(['STUDENT', 'TEACHER', 'ADMIN']), async (req, res) => {
  try {
    const { courseId } = req.params;
    const userId = req.user.id;

    const unenrollQuery = `
      DELETE FROM enrollments 
      WHERE user_id = $1 AND course_id = $2
    `;

    const result = await query(unenrollQuery, [userId, courseId]);

    if (result.rowCount === 0) {
      return res.status(404).json({ message: 'Enrollment not found.' });
    }

    res.json({ message: 'Successfully unenrolled from course.' });
  } catch (error) {
    console.error('Error unenrolling from course:', error);
    res.status(500).json({ message: 'Server error.' });
  }
});

// Mark course as completed for the current user
router.post('/:courseId/complete', requireRole(['STUDENT', 'TEACHER', 'ADMIN']), async (req, res) => {
  try {
    const { courseId } = req.params;
    const userId = req.user.id;

    const updateQuery = `
      UPDATE enrollments
      SET completed_at = CURRENT_TIMESTAMP
      WHERE user_id = $1 AND course_id = $2
      RETURNING *
    `;

    const result = await query(updateQuery, [userId, courseId]);

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Enrollment not found.' });
    }

    const enrollment = result.rows[0];

    const existingCertQuery = `
      SELECT id FROM certificates
      WHERE user_id = $1 AND course_id = $2
    `;
    const existingCertResult = await query(existingCertQuery, [userId, courseId]);

    if (existingCertResult.rows.length === 0) {
      const courseQuery = `
        SELECT co.title as course_title, a.name as author_name
        FROM courses co
        JOIN authors a ON co.author_id = a.id
        WHERE co.id = $1
      `;
      const courseResult = await query(courseQuery, [courseId]);

      if (courseResult.rows.length > 0) {
        const course = courseResult.rows[0];
        const timestamp = Date.now();
        const certificateUrl = `/certificates/${userId}_${courseId}_${timestamp}.pdf`;
        const columnQuery = `
          SELECT column_name
          FROM information_schema.columns
          WHERE table_schema = 'public' AND table_name = 'certificates'
        `;
        const columnResult = await query(columnQuery);
        const columnNames = new Set(columnResult.rows.map(row => row.column_name));
        const hasExtendedColumns = columnNames.has('title') && columnNames.has('certificate_type');

        if (hasExtendedColumns) {
          const certificateNumber = `CERT-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
          const verificationCode = crypto.randomBytes(8).toString('hex').toUpperCase();
          const shareUrl = `${process.env.FRONTEND_URL || 'http://localhost:3000'}/certificates/verify/${verificationCode}`;
          const completionDate = (enrollment.completed_at || new Date()).toISOString().split('T')[0];
          const pdfUrl = `/api/certificates/${userId}_${courseId}_${timestamp}.pdf`;
          const certificateTitle = `Сертификат о прохождении курса "${course.course_title}"`;
          const certificateDescription = `Данный сертификат подтверждает успешное прохождение курса "${course.course_title}"`;

          const generateCertQuery = `
            INSERT INTO certificates (
              user_id, course_id, title, description, certificate_type,
              instructor_name, completion_date, certificate_number, verification_code,
              certificate_url, pdf_url, share_url, status, issued_at
            )
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)
          `;

          await query(generateCertQuery, [
            userId, courseId, certificateTitle, certificateDescription, 'COMPLETION',
            course.author_name, completionDate, certificateNumber, verificationCode,
            certificateUrl, pdfUrl, shareUrl, 'ACTIVE', new Date()
          ]);
        } else {
          const generateCertQuery = `
            INSERT INTO certificates (user_id, course_id, issued_at, certificate_url)
            VALUES ($1, $2, $3, $4)
          `;
          await query(generateCertQuery, [userId, courseId, new Date(), certificateUrl]);
        }
      }
    }

    res.json({
      message: 'Course marked as completed.',
      enrollment
    });
  } catch (error) {
    console.error('Error completing course:', error);
    res.status(500).json({ message: 'Server error.' });
  }
});

// Get course enrollments (ADMIN/TEACHER only)
router.get('/course/:courseId', requireRole(['TEACHER', 'ADMIN']), async (req, res) => {
  try {
    const { courseId } = req.params;

    const enrollmentsQuery = `
      SELECT 
        e.*,
        u.name as user_name,
        u.email as user_email
      FROM enrollments e
      JOIN users u ON e.user_id = u.id
      WHERE e.course_id = $1
      ORDER BY e.enrolled_at DESC
    `;

    const result = await query(enrollmentsQuery, [courseId]);
    res.json({ enrollments: result.rows });
  } catch (error) {
    console.error('Error fetching course enrollments:', error);
    res.status(500).json({ message: 'Server error.' });
  }
});

module.exports = router; 
