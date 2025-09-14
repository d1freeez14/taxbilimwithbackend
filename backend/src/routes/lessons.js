const express = require('express');
const { body, validationResult } = require('express-validator');
const { query } = require('../lib/db');
const { requireRole, auth } = require('../middleware/auth');
const { formatLesson, isValidLessonType } = require('../lib/lessonTypes');

const router = express.Router();

// Get lessons for a module
router.get('/module/:moduleId', async (req, res) => {
  try {
    const { moduleId } = req.params;
    const userId = req.user?.id; // Optional user ID for locked status
    
    const lessonsQuery = `
      SELECT 
        l.*,
        CASE 
          WHEN $2 IS NULL THEN false
          WHEN l.locked = false THEN false
          WHEN l."order" = 1 THEN false
          ELSE EXISTS (
            SELECT 1 FROM lesson_progress lp 
            WHERE lp.user_id = $2 
            AND lp.lesson_id = (
              SELECT id FROM lessons 
              WHERE module_id = l.module_id 
              AND "order" = l."order" - 1
            )
            AND lp.completed = true
          )
        END as is_unlocked
      FROM lessons l
      WHERE l.module_id = $1
      ORDER BY l."order"
    `;
    
    const result = await query(lessonsQuery, [moduleId, userId]);
    
    // Format lessons with type information
    const formattedLessons = result.rows.map(lesson => 
      formatLesson(lesson, lesson.is_unlocked)
    );
    
    res.json({ lessons: formattedLessons });
  } catch (error) {
    console.error('Error fetching lessons:', error);
    res.status(500).json({ message: 'Server error.' });
  }
});

// Get lesson by ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user?.id;
    
    const lessonQuery = `
      SELECT 
        l.*,
        CASE 
          WHEN $2 IS NULL THEN false
          WHEN l.locked = false THEN false
          WHEN l."order" = 1 THEN false
          ELSE EXISTS (
            SELECT 1 FROM lesson_progress lp 
            WHERE lp.user_id = $2 
            AND lp.lesson_id = (
              SELECT id FROM lessons 
              WHERE module_id = l.module_id 
              AND "order" = l."order" - 1
            )
            AND lp.completed = true
          )
        END as is_unlocked
      FROM lessons l
      WHERE l.id = $1
    `;
    
    const result = await query(lessonQuery, [id, userId]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Lesson not found.' });
    }
    
    const lesson = result.rows[0];
    const formattedLesson = formatLesson(lesson, lesson.is_unlocked);
    
    res.json({ lesson: formattedLesson });
  } catch (error) {
    console.error('Error fetching lesson:', error);
    res.status(500).json({ message: 'Server error.' });
  }
});

// Create lesson (TEACHER/ADMIN only)
router.post('/', [
  body('title').trim().isLength({ min: 3 }),
  body('moduleId').notEmpty(),
  body('order').isInt({ min: 1 }),
  body('lessonType').optional().custom(value => {
    if (!isValidLessonType(value)) {
      throw new Error('Invalid lesson type');
    }
    return true;
  })
], requireRole(['TEACHER', 'ADMIN']), async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { 
      title, 
      moduleId, 
      order, 
      content, 
      videoUrl, 
      duration, 
      image, 
      locked = false, 
      lessonType = 'VIDEO', 
      testId, 
      url 
    } = req.body;

    const createQuery = `
      INSERT INTO lessons (
        title, module_id, "order", content, video_url, duration, 
        image, locked, lesson_type, test_id, url
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
      RETURNING *
    `;

    const result = await query(createQuery, [
      title, moduleId, order, content, videoUrl, duration,
      image, locked, lessonType, testId, url
    ]);
    
    res.status(201).json({ lesson: result.rows[0] });
  } catch (error) {
    console.error('Error creating lesson:', error);
    res.status(500).json({ message: 'Server error.' });
  }
});

// Update lesson (TEACHER/ADMIN only)
router.put('/:id', [
  body('title').optional().trim().isLength({ min: 3 }),
  body('lessonType').optional().isIn(['VIDEO', 'TEST', 'READING', 'ASSIGNMENT', 'LIVE_SESSION', 'QUIZ'])
], requireRole(['TEACHER', 'ADMIN']), async (req, res) => {
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

    if (updateData.content !== undefined) {
      setClauses.push(`content = $${paramIndex}`);
      values.push(updateData.content);
      paramIndex++;
    }

    if (updateData.videoUrl !== undefined) {
      setClauses.push(`video_url = $${paramIndex}`);
      values.push(updateData.videoUrl);
      paramIndex++;
    }

    if (updateData.duration !== undefined) {
      setClauses.push(`duration = $${paramIndex}`);
      values.push(updateData.duration);
      paramIndex++;
    }

    if (updateData.image !== undefined) {
      setClauses.push(`image = $${paramIndex}`);
      values.push(updateData.image);
      paramIndex++;
    }

    if (updateData.locked !== undefined) {
      setClauses.push(`locked = $${paramIndex}`);
      values.push(updateData.locked);
      paramIndex++;
    }

    if (updateData.lessonType) {
      setClauses.push(`lesson_type = $${paramIndex}`);
      values.push(updateData.lessonType);
      paramIndex++;
    }

    if (updateData.testId !== undefined) {
      setClauses.push(`test_id = $${paramIndex}`);
      values.push(updateData.testId);
      paramIndex++;
    }

    if (updateData.url !== undefined) {
      setClauses.push(`url = $${paramIndex}`);
      values.push(updateData.url);
      paramIndex++;
    }

    if (updateData.order !== undefined) {
      setClauses.push(`"order" = $${paramIndex}`);
      values.push(updateData.order);
      paramIndex++;
    }

    if (setClauses.length === 0) {
      return res.status(400).json({ message: 'No valid fields to update.' });
    }

    const updateQuery = `
      UPDATE lessons 
      SET ${setClauses.join(', ')}, updated_at = CURRENT_TIMESTAMP
      WHERE id = $${paramIndex}
      RETURNING *
    `;

    values.push(id);
    const result = await query(updateQuery, values);

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Lesson not found.' });
    }

    res.json({ lesson: result.rows[0] });
  } catch (error) {
    console.error('Error updating lesson:', error);
    res.status(500).json({ message: 'Server error.' });
  }
});

// Delete lesson (ADMIN only)
router.delete('/:id', requireRole(['ADMIN']), async (req, res) => {
  try {
    const { id } = req.params;

    const deleteQuery = `DELETE FROM lessons WHERE id = $1`;
    const result = await query(deleteQuery, [id]);

    if (result.rowCount === 0) {
      return res.status(404).json({ message: 'Lesson not found.' });
    }

    res.json({ message: 'Lesson deleted successfully.' });
  } catch (error) {
    console.error('Error deleting lesson:', error);
    res.status(500).json({ message: 'Server error.' });
  }
});

// Get lesson navigation URL based on type
router.get('/:id/navigate', auth, async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const lessonQuery = `
      SELECT l.*, lp.completed
      FROM lessons l
      LEFT JOIN lesson_progress lp ON l.id = lp.lesson_id AND lp.user_id = $2
      WHERE l.id = $1
    `;

    const result = await query(lessonQuery, [id, userId]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Lesson not found.' });
    }

    const lesson = result.rows[0];
    const formattedLesson = formatLesson(lesson, true);
    
    res.json({ 
      lesson: formattedLesson,
      navigationUrl: formattedLesson.navigationUrl,
      isCompleted: lesson.completed || false
    });
  } catch (error) {
    console.error('Error getting lesson navigation:', error);
    res.status(500).json({ message: 'Server error.' });
  }
});

// Get all lesson types
router.get('/types', (req, res) => {
  try {
    const { getAllLessonTypes } = require('../lib/lessonTypes');
    const lessonTypes = getAllLessonTypes();
    
    res.json({ lessonTypes });
  } catch (error) {
    console.error('Error fetching lesson types:', error);
    res.status(500).json({ message: 'Server error.' });
  }
});

module.exports = router;