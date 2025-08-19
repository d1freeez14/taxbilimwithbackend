const { query } = require('../lib/db');
const express = require('express');
const { requireRole } = require('../middleware/auth');

const router = express.Router();

// Get user certificates
router.get('/my-certificates', requireRole(['STUDENT', 'TEACHER', 'ADMIN']), async (req, res) => {
  try {
    const userId = req.user.id;

    const certificatesQuery = `
      SELECT 
        c.*,
        co.title as course_title,
        co.image_src as course_image,
        a.name as author_name
      FROM certificates c
      JOIN courses co ON c.course_id = co.id
      JOIN authors a ON co.author_id = a.id
      WHERE c.user_id = $1
      ORDER BY c.issued_at DESC
    `;

    const result = await query(certificatesQuery, [userId]);
    res.json({ certificates: result.rows });
  } catch (error) {
    console.error('Error fetching certificates:', error);
    res.status(500).json({ message: 'Server error.' });
  }
});

// Generate certificate for course completion
router.post('/generate/:courseId', requireRole(['STUDENT', 'TEACHER', 'ADMIN']), async (req, res) => {
  try {
    const { courseId } = req.params;
    const userId = req.user.id;

    // Check if user is enrolled and has completed the course
    const enrollmentQuery = `
      SELECT * FROM enrollments 
      WHERE user_id = $1 AND course_id = $2
    `;

    const enrollmentResult = await query(enrollmentQuery, [userId, courseId]);

    if (enrollmentResult.rows.length === 0) {
      return res.status(400).json({ message: 'You must be enrolled in the course to generate a certificate.' });
    }

    // Check if certificate already exists
    const existingCertQuery = `
      SELECT * FROM certificates 
      WHERE user_id = $1 AND course_id = $2
    `;

    const existingCertResult = await query(existingCertQuery, [userId, courseId]);

    if (existingCertResult.rows.length > 0) {
      return res.status(400).json({ message: 'Certificate already exists for this course.' });
    }

    // Generate certificate
    const generateCertQuery = `
      INSERT INTO certificates (user_id, course_id, certificate_url)
      VALUES ($1, $2, $3)
      RETURNING *
    `;

    const certificateUrl = `/certificates/${userId}_${courseId}_${Date.now()}.pdf`;
    const result = await query(generateCertQuery, [userId, courseId, certificateUrl]);

    res.status(201).json({ certificate: result.rows[0] });
  } catch (error) {
    console.error('Error generating certificate:', error);
    res.status(500).json({ message: 'Server error.' });
  }
});

// Get certificate by ID
router.get('/:id', requireRole(['STUDENT', 'TEACHER', 'ADMIN']), async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const certificateQuery = `
      SELECT 
        c.*,
        co.title as course_title,
        co.image_src as course_image,
        a.name as author_name,
        u.name as user_name,
        u.email as user_email
      FROM certificates c
      JOIN courses co ON c.course_id = co.id
      JOIN authors a ON co.author_id = a.id
      JOIN users u ON c.user_id = u.id
      WHERE c.id = $1 AND c.user_id = $2
    `;

    const result = await query(certificateQuery, [id, userId]);

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Certificate not found.' });
    }

    res.json({ certificate: result.rows[0] });
  } catch (error) {
    console.error('Error fetching certificate:', error);
    res.status(500).json({ message: 'Server error.' });
  }
});

// Download certificate
router.get('/:id/download', requireRole(['STUDENT', 'TEACHER', 'ADMIN']), async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const certificateQuery = `
      SELECT * FROM certificates 
      WHERE id = $1 AND user_id = $2
    `;

    const result = await query(certificateQuery, [id, userId]);

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Certificate not found.' });
    }

    const certificate = result.rows[0];

    // In a real application, you would generate and serve the actual PDF
    // For now, we'll just return the certificate data
    res.json({ 
      message: 'Certificate download initiated',
      certificate,
      downloadUrl: certificate.certificate_url
    });
  } catch (error) {
    console.error('Error downloading certificate:', error);
    res.status(500).json({ message: 'Server error.' });
  }
});

module.exports = router; 