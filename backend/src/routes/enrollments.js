const { query } = require('../lib/db');
const express = require('express');
const { requireRole } = require('../middleware/auth');

const router = express.Router();

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
        a.name as author_name
      FROM enrollments e
      JOIN courses c ON e.course_id = c.id
      JOIN authors a ON c.author_id = a.id
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