const { query } = require('../lib/db');
const express = require('express');
const { requireRole } = require('../middleware/auth');

const router = express.Router();

// Get user favorites
router.get('/my-favorites', requireRole(['STUDENT', 'TEACHER', 'ADMIN']), async (req, res) => {
  try {
    const userId = req.user.id;

    const favoritesQuery = `
      SELECT 
        f.*,
        c.title as course_title,
        c.image_src as course_image,
        c.price as course_price,
        a.name as author_name
      FROM course_favorites f
      JOIN courses c ON f.course_id = c.id
      JOIN authors a ON c.author_id = a.id
      WHERE f.user_id = $1
      ORDER BY f.created_at DESC
    `;

    const result = await query(favoritesQuery, [userId]);
    res.json({ favorites: result.rows });
  } catch (error) {
    console.error('Error fetching favorites:', error);
    res.status(500).json({ message: 'Server error.' });
  }
});

// Add course to favorites
router.post('/:courseId', requireRole(['STUDENT', 'TEACHER', 'ADMIN']), async (req, res) => {
  try {
    const { courseId } = req.params;
    const userId = req.user.id;

    const addFavoriteQuery = `
      INSERT INTO course_favorites (user_id, course_id)
      VALUES ($1, $2)
      ON CONFLICT (user_id, course_id) DO NOTHING
      RETURNING *
    `;

    const result = await query(addFavoriteQuery, [userId, courseId]);

    if (result.rows.length === 0) {
      return res.status(400).json({ message: 'Course already in favorites.' });
    }

    res.status(201).json({ favorite: result.rows[0] });
  } catch (error) {
    console.error('Error adding to favorites:', error);
    res.status(500).json({ message: 'Server error.' });
  }
});

// Remove course from favorites
router.delete('/:courseId', requireRole(['STUDENT', 'TEACHER', 'ADMIN']), async (req, res) => {
  try {
    const { courseId } = req.params;
    const userId = req.user.id;

    const removeFavoriteQuery = `
      DELETE FROM course_favorites 
      WHERE user_id = $1 AND course_id = $2
    `;

    const result = await query(removeFavoriteQuery, [userId, courseId]);

    if (result.rowCount === 0) {
      return res.status(404).json({ message: 'Favorite not found.' });
    }

    res.json({ message: 'Removed from favorites successfully.' });
  } catch (error) {
    console.error('Error removing from favorites:', error);
    res.status(500).json({ message: 'Server error.' });
  }
});

module.exports = router; 