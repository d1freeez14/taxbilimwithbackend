const express = require('express');
const { query } = require('../lib/db');

const router = express.Router();

// Get all categories
router.get('/', async (req, res) => {
  try {
    // Check if category_id column exists in courses table
    const checkColumnQuery = `
      SELECT column_name 
      FROM information_schema.columns 
      WHERE table_name = 'courses' AND column_name = 'category_id'
    `;
    const columnCheck = await query(checkColumnQuery);
    const hasCategoryId = columnCheck.rows.length > 0;

    let categoriesQuery;
    if (hasCategoryId) {
      categoriesQuery = `
        SELECT 
          c.*,
          COUNT(co.id) as course_count
        FROM categories c
        LEFT JOIN courses co ON c.id = co.category_id AND co.is_published = true
        GROUP BY c.id
        ORDER BY c.name
      `;
    } else {
      // If category_id doesn't exist, just return categories with course_count = 0
      categoriesQuery = `
        SELECT 
          c.*,
          0 as course_count
        FROM categories c
        ORDER BY c.name
      `;
    }

    const result = await query(categoriesQuery);
    res.json({ categories: result.rows });
  } catch (error) {
    console.error('Error fetching categories:', error);
    res.status(500).json({ message: 'Server error.' });
  }
});

module.exports = router; 