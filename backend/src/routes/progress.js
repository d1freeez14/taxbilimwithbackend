const { query } = require('../lib/db');
const express = require('express');
const { requireRole } = require('../middleware/auth');

const router = express.Router();

// Get user progress for a lesson
router.get('/lesson/:lessonId', requireRole(['STUDENT', 'TEACHER', 'ADMIN']), async (req, res) => {
  try {
    const { lessonId } = req.params;
    const userId = req.user.id;

    const progressQuery = `
      SELECT * FROM lesson_progress 
      WHERE user_id = $1 AND lesson_id = $2
    `;

    const result = await query(progressQuery, [userId, lessonId]);
    
    if (result.rows.length === 0) {
      return res.json({ progress: null });
    }

    res.json({ progress: result.rows[0] });
  } catch (error) {
    console.error('Error fetching progress:', error);
    res.status(500).json({ message: 'Server error.' });
  }
});

// Update lesson progress
router.post('/lesson/:lessonId', requireRole(['STUDENT', 'TEACHER', 'ADMIN']), async (req, res) => {
  try {
    const { lessonId } = req.params;
    const { completed } = req.body;
    const userId = req.user.id;

    const upsertQuery = `
      INSERT INTO lesson_progress (user_id, lesson_id, completed, completed_at)
      VALUES ($1, $2, $3, $4)
      ON CONFLICT (user_id, lesson_id)
      DO UPDATE SET 
        completed = $3,
        completed_at = $4,
        updated_at = CURRENT_TIMESTAMP
      RETURNING *
    `;

    const completedAt = completed ? new Date() : null;
    const result = await query(upsertQuery, [userId, lessonId, completed, completedAt]);

    res.json({ progress: result.rows[0] });
  } catch (error) {
    console.error('Error updating progress:', error);
    res.status(500).json({ message: 'Server error.' });
  }
});

// Get course progress
router.get('/course/:courseId', requireRole(['STUDENT', 'TEACHER', 'ADMIN']), async (req, res) => {
  try {
    const { courseId } = req.params;
    const userId = req.user.id;

    const progressQuery = `
      SELECT 
        l.id as lesson_id,
        l.title as lesson_title,
        lp.completed,
        lp.completed_at
      FROM lessons l
      JOIN modules m ON l.module_id = m.id
      LEFT JOIN lesson_progress lp ON l.id = lp.lesson_id AND lp.user_id = $1
      WHERE m.course_id = $2
      ORDER BY m."order", l."order"
    `;

    const result = await query(progressQuery, [userId, courseId]);
    
    const totalLessons = result.rows.length;
    const completedLessons = result.rows.filter(row => row.completed).length;
    const progressPercentage = totalLessons > 0 ? (completedLessons / totalLessons) * 100 : 0;

    res.json({
      lessons: result.rows,
      progress: {
        totalLessons,
        completedLessons,
        progressPercentage: Math.round(progressPercentage)
      }
    });
  } catch (error) {
    console.error('Error fetching course progress:', error);
    res.status(500).json({ message: 'Server error.' });
  }
});

module.exports = router; 