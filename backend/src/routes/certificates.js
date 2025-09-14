const { query } = require('../lib/db');
const express = require('express');
const { requireRole, auth } = require('../middleware/auth');
const { body, validationResult } = require('express-validator');
const crypto = require('crypto');

const router = express.Router();

// Get all certificates (ADMIN only)
router.get('/', requireRole(['ADMIN']), async (req, res) => {
  try {
    const { search, status, type, page = 1, limit = 10 } = req.query;
    const offset = (page - 1) * limit;

    let whereClause = 'WHERE 1=1';
    const params = [];
    let paramCount = 0;

    if (search) {
      paramCount++;
      whereClause += ` AND (c.title ILIKE $${paramCount} OR co.title ILIKE $${paramCount} OR u.name ILIKE $${paramCount})`;
      params.push(`%${search}%`);
    }

    if (status) {
      paramCount++;
      whereClause += ` AND c.status = $${paramCount}`;
      params.push(status);
    }

    if (type) {
      paramCount++;
      whereClause += ` AND c.certificate_type = $${paramCount}`;
      params.push(type);
    }

    const certificatesQuery = `
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
      ${whereClause}
      ORDER BY c.issued_at DESC
      LIMIT $${paramCount + 1} OFFSET $${paramCount + 2}
    `;

    params.push(limit, offset);
    const result = await query(certificatesQuery, params);

    // Get total count for pagination
    const countQuery = `
      SELECT COUNT(*) as total
      FROM certificates c
      JOIN courses co ON c.course_id = co.id
      JOIN users u ON c.user_id = u.id
      ${whereClause}
    `;
    const countResult = await query(countQuery, params.slice(0, -2));
    const total = parseInt(countResult.rows[0].total);

    res.json({ 
      certificates: result.rows,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Error fetching certificates:', error);
    res.status(500).json({ message: 'Server error.' });
  }
});

// Get user certificates
router.get('/my-certificates', auth, async (req, res) => {
  try {
    const userId = req.user.id;
    const { search, status, type, sortBy = 'issued_at', sortOrder = 'DESC' } = req.query;

    let whereClause = 'WHERE c.user_id = $1';
    const params = [userId];
    let paramCount = 1;

    if (search) {
      paramCount++;
      whereClause += ` AND (c.title ILIKE $${paramCount} OR co.title ILIKE $${paramCount})`;
      params.push(`%${search}%`);
    }

    if (status) {
      paramCount++;
      whereClause += ` AND c.status = $${paramCount}`;
      params.push(status);
    }

    if (type) {
      paramCount++;
      whereClause += ` AND c.certificate_type = $${paramCount}`;
      params.push(type);
    }

    const validSortFields = ['issued_at', 'title', 'completion_date', 'created_at'];
    const sortField = validSortFields.includes(sortBy) ? sortBy : 'issued_at';
    const order = sortOrder.toUpperCase() === 'ASC' ? 'ASC' : 'DESC';

    const certificatesQuery = `
      SELECT 
        c.*,
        co.title as course_title,
        co.image_src as course_image,
        co.description as course_description,
        a.name as author_name,
        a.avatar as author_avatar
      FROM certificates c
      JOIN courses co ON c.course_id = co.id
      JOIN authors a ON co.author_id = a.id
      ${whereClause}
      ORDER BY c.${sortField} ${order}
    `;

    const result = await query(certificatesQuery, params);
    res.json({ certificates: result.rows });
  } catch (error) {
    console.error('Error fetching certificates:', error);
    res.status(500).json({ message: 'Server error.' });
  }
});

// Generate certificate for course completion
router.post('/generate/:courseId', auth, async (req, res) => {
  try {
    const { courseId } = req.params;
    const userId = req.user.id;
    const { 
      title, 
      description, 
      certificateType = 'COMPLETION',
      instructorName,
      completionDate 
    } = req.body;

    // Check if user is enrolled and has completed the course
    const enrollmentQuery = `
      SELECT e.*, co.title as course_title, a.name as author_name
      FROM enrollments e
      JOIN courses co ON e.course_id = co.id
      JOIN authors a ON co.author_id = a.id
      WHERE e.user_id = $1 AND e.course_id = $2
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

    // Generate unique certificate number and verification code
    const certificateNumber = `CERT-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
    const verificationCode = crypto.randomBytes(8).toString('hex').toUpperCase();
    const shareUrl = `${process.env.FRONTEND_URL || 'http://localhost:3000'}/certificates/verify/${verificationCode}`;

    // Generate certificate
    const generateCertQuery = `
      INSERT INTO certificates (
        user_id, course_id, title, description, certificate_type,
        instructor_name, completion_date, certificate_number, verification_code,
        certificate_url, pdf_url, share_url, status, issued_at
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)
      RETURNING *
    `;

    const course = enrollmentResult.rows[0];
    const certificateTitle = title || `Сертификат о прохождении курса "${course.course_title}"`;
    const certificateDescription = description || `Данный сертификат подтверждает успешное прохождение курса "${course.course_title}"`;
    const instructor = instructorName || course.author_name;
    const completion = completionDate || new Date().toISOString().split('T')[0];
    const certificateUrl = `/certificates/${userId}_${courseId}_${Date.now()}.pdf`;
    const pdfUrl = `/api/certificates/${userId}_${courseId}_${Date.now()}.pdf`;

    const result = await query(generateCertQuery, [
      userId, courseId, certificateTitle, certificateDescription, certificateType,
      instructor, completion, certificateNumber, verificationCode,
      certificateUrl, pdfUrl, shareUrl, 'ACTIVE', new Date()
    ]);

    res.status(201).json({ 
      certificate: result.rows[0],
      message: 'Certificate generated successfully'
    });
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

// Download certificate PDF
router.get('/:id/download', auth, async (req, res) => {
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

    const certificate = result.rows[0];

    // In a real application, you would generate and serve the actual PDF
    // For now, we'll return the certificate data with download URL
    res.json({ 
      message: 'Certificate download initiated',
      certificate,
      downloadUrl: certificate.pdf_url || certificate.certificate_url
    });
  } catch (error) {
    console.error('Error downloading certificate:', error);
    res.status(500).json({ message: 'Server error.' });
  }
});

// Get certificate share link
router.get('/:id/share', auth, async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const certificateQuery = `
      SELECT share_url, verification_code, certificate_number
      FROM certificates 
      WHERE id = $1 AND user_id = $2
    `;

    const result = await query(certificateQuery, [id, userId]);

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Certificate not found.' });
    }

    const certificate = result.rows[0];

    res.json({ 
      shareUrl: certificate.share_url,
      verificationCode: certificate.verification_code,
      certificateNumber: certificate.certificate_number
    });
  } catch (error) {
    console.error('Error getting share link:', error);
    res.status(500).json({ message: 'Server error.' });
  }
});


// Update certificate (ADMIN/TEACHER only)
router.put('/:id', requireRole(['ADMIN', 'TEACHER']), [
  body('title').optional().isLength({ min: 3 }),
  body('description').optional().isLength({ min: 10 }),
  body('certificateType').optional().isIn(['COMPLETION', 'ACHIEVEMENT', 'PARTICIPATION', 'CUSTOM']),
  body('status').optional().isIn(['ACTIVE', 'INACTIVE', 'REVOKED']),
  body('instructorName').optional().isLength({ min: 2 }),
  body('completionDate').optional().isISO8601()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { id } = req.params;
    const updateData = req.body;

    const setClauses = [];
    const values = [];
    let paramIndex = 1;

    if (updateData.title) {
      setClauses.push(`title = $${paramIndex}`);
      values.push(updateData.title);
      paramIndex++;
    }

    if (updateData.description) {
      setClauses.push(`description = $${paramIndex}`);
      values.push(updateData.description);
      paramIndex++;
    }

    if (updateData.certificateType) {
      setClauses.push(`certificate_type = $${paramIndex}`);
      values.push(updateData.certificateType);
      paramIndex++;
    }

    if (updateData.status) {
      setClauses.push(`status = $${paramIndex}`);
      values.push(updateData.status);
      paramIndex++;
    }

    if (updateData.instructorName) {
      setClauses.push(`instructor_name = $${paramIndex}`);
      values.push(updateData.instructorName);
      paramIndex++;
    }

    if (updateData.completionDate) {
      setClauses.push(`completion_date = $${paramIndex}`);
      values.push(updateData.completionDate);
      paramIndex++;
    }

    if (setClauses.length === 0) {
      return res.status(400).json({ message: 'No valid fields to update.' });
    }

    const updateQuery = `
      UPDATE certificates 
      SET ${setClauses.join(', ')}, updated_at = CURRENT_TIMESTAMP
      WHERE id = $${paramIndex}
      RETURNING *
    `;

    values.push(id);
    const result = await query(updateQuery, values);

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Certificate not found.' });
    }

    res.json({ certificate: result.rows[0] });
  } catch (error) {
    console.error('Error updating certificate:', error);
    res.status(500).json({ message: 'Server error.' });
  }
});

// Delete certificate (ADMIN only)
router.delete('/:id', requireRole(['ADMIN']), async (req, res) => {
  try {
    const { id } = req.params;

    const deleteQuery = `DELETE FROM certificates WHERE id = $1 RETURNING *`;
    const result = await query(deleteQuery, [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Certificate not found.' });
    }

    res.json({ 
      message: 'Certificate deleted successfully.',
      certificate: result.rows[0]
    });
  } catch (error) {
    console.error('Error deleting certificate:', error);
    res.status(500).json({ message: 'Server error.' });
  }
});

// Get certificate statistics (ADMIN only)
router.get('/stats/overview', requireRole(['ADMIN']), async (req, res) => {
  try {
    const statsQuery = `
      SELECT 
        COUNT(*) as total_certificates,
        COUNT(CASE WHEN status = 'ACTIVE' THEN 1 END) as active_certificates,
        COUNT(CASE WHEN status = 'INACTIVE' THEN 1 END) as inactive_certificates,
        COUNT(CASE WHEN status = 'REVOKED' THEN 1 END) as revoked_certificates,
        COUNT(CASE WHEN certificate_type = 'COMPLETION' THEN 1 END) as completion_certificates,
        COUNT(CASE WHEN certificate_type = 'ACHIEVEMENT' THEN 1 END) as achievement_certificates,
        COUNT(CASE WHEN issued_at >= CURRENT_DATE - INTERVAL '30 days' THEN 1 END) as certificates_last_30_days,
        COUNT(CASE WHEN issued_at >= CURRENT_DATE - INTERVAL '7 days' THEN 1 END) as certificates_last_7_days
      FROM certificates
    `;

    const result = await query(statsQuery);
    res.json({ statistics: result.rows[0] });
  } catch (error) {
    console.error('Error fetching certificate statistics:', error);
    res.status(500).json({ message: 'Server error.' });
  }
});

module.exports = router; 