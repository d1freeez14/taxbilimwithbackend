const { query } = require('../lib/db');
const express = require('express');

const router = express.Router();

// Verify certificate by verification code (public endpoint)
router.get('/verify/:code', async (req, res) => {
  try {
    const { code } = req.params;

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
      WHERE c.verification_code = $1 AND c.status = 'ACTIVE'
    `;

    const result = await query(certificateQuery, [code]);

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Certificate not found or invalid verification code.' });
    }

    const certificate = result.rows[0];

    res.json({ 
      certificate,
      isValid: true,
      message: 'Certificate verified successfully'
    });
  } catch (error) {
    console.error('Error verifying certificate:', error);
    res.status(500).json({ message: 'Server error.' });
  }
});

module.exports = router;
