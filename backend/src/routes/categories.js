const express = require('express');
const { query } = require('../lib/db');

const router = express.Router();

// Get all categories
router.get('/', async (req, res) => {
  try {
    const categoriesQuery = `
      SELECT 
        c.*,
        COUNT(co.id) as course_count
      FROM categories c
      LEFT JOIN courses co ON c.id = co.category_id AND co.is_published = true
      GROUP BY c.id
      ORDER BY c.name
    `;

    const result = await query(categoriesQuery);
    res.json({ categories: result.rows });
  } catch (error) {
    console.error('Error fetching categories:', error);
    res.status(500).json({ message: 'Server error.' });
  }
});

module.exports = router; 