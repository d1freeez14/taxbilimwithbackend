const express = require('express');
const { body, validationResult } = require('express-validator');
const { query } = require('../lib/db');
const { requireRole } = require('../middleware/auth');

const router = express.Router();

// Get lessons for a module
router.get('/module/:moduleId', async (req, res) => {
  try {
    const { moduleId } = req.params;
    
    const lessonsQuery = `
      SELECT * FROM lessons 
      WHERE module_id = $1 
      ORDER BY "order"
    `;
    
    const result = await query(lessonsQuery, [moduleId]);
    res.json({ lessons: result.rows });
  } catch (error) {
    console.error('Error fetching lessons:', error);
    res.status(500).json({ message: 'Server error.' });
  }
});

// Get lesson by ID with completion status
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user?.id;
    
    let lessonQuery = `
      SELECT l.*, m.title as module_title, c.title as course_title, c.id as course_id
      FROM lessons l
      JOIN modules m ON l.module_id = m.id
      JOIN courses c ON m.course_id = c.id
      WHERE l.id = $1
    `;
    
    const result = await query(lessonQuery, [id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Lesson not found.' });
    }
    
    const lesson = result.rows[0];
    
    // If user is authenticated, get completion status
    if (userId) {
      const progressQuery = `
        SELECT completed, completed_at FROM lesson_progress 
        WHERE user_id = $1 AND lesson_id = $2
      `;
      const progressResult = await query(progressQuery, [userId, id]);
      
      if (progressResult.rows.length > 0) {
        lesson.completed = progressResult.rows[0].completed;
        lesson.completed_at = progressResult.rows[0].completed_at;
      } else {
        lesson.completed = false;
        lesson.completed_at = null;
      }
    }
    
    res.json({ lesson });
  } catch (error) {
    console.error('Error fetching lesson:', error);
    res.status(500).json({ message: 'Server error.' });
  }
});

// Mark lesson as completed
router.post('/:id/complete', async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    
    // Check if lesson exists
    const lessonQuery = `
      SELECT l.*, m.course_id FROM lessons l
      JOIN modules m ON l.module_id = m.id
      WHERE l.id = $1
    `;
    const lessonResult = await query(lessonQuery, [id]);
    
    if (lessonResult.rows.length === 0) {
      return res.status(404).json({ message: 'Lesson not found.' });
    }
    
    const lesson = lessonResult.rows[0];
    
    // Check if user is enrolled in the course
    const enrollmentQuery = `
      SELECT * FROM enrollments 
      WHERE user_id = $1 AND course_id = $2
    `;
    const enrollmentResult = await query(enrollmentQuery, [userId, lesson.course_id]);
    
    if (enrollmentResult.rows.length === 0) {
      return res.status(403).json({ message: 'You must be enrolled in this course to complete lessons.' });
    }
    
    // Mark lesson as completed
    const completeQuery = `
      INSERT INTO lesson_progress (user_id, lesson_id, completed, completed_at)
      VALUES ($1, $2, true, CURRENT_TIMESTAMP)
      ON CONFLICT (user_id, lesson_id) 
      DO UPDATE SET completed = true, completed_at = CURRENT_TIMESTAMP
      RETURNING *
    `;
    
    await query(completeQuery, [userId, id]);
    
    res.json({ 
      message: 'Lesson completed successfully.',
      lesson_id: id,
      completed: true,
      completed_at: new Date()
    });
  } catch (error) {
    console.error('Error completing lesson:', error);
    res.status(500).json({ message: 'Server error.' });
  }
});

// Mark module as completed (check if all lessons are done)
router.post('/module/:moduleId/complete', async (req, res) => {
  try {
    const { moduleId } = req.params;
    const userId = req.user.id;
    
    // Get all lessons in the module
    const lessonsQuery = `
      SELECT l.id, l.title FROM lessons l
      WHERE l.module_id = $1
      ORDER BY l."order"
    `;
    const lessonsResult = await query(lessonsQuery, [moduleId]);
    
    if (lessonsResult.rows.length === 0) {
      return res.status(404).json({ message: 'Module not found or has no lessons.' });
    }
    
    const lessons = lessonsResult.rows;
    
    // Check completion status for each lesson
    const completionChecks = await Promise.all(
      lessons.map(async (lesson) => {
        const progressQuery = `
          SELECT completed FROM lesson_progress 
          WHERE user_id = $1 AND lesson_id = $2
        `;
        const progressResult = await query(progressQuery, [userId, lesson.id]);
        return {
          lesson_id: lesson.id,
          lesson_title: lesson.title,
          completed: progressResult.rows.length > 0 && progressResult.rows[0].completed
        };
      })
    );
    
    const incompleteLessons = completionChecks.filter(check => !check.completed);
    
    if (incompleteLessons.length > 0) {
      return res.status(400).json({ 
        message: 'Cannot complete module. Some lessons are not finished.',
        incomplete_lessons: incompleteLessons
      });
    }
    
    // All lessons are completed, mark module as completed
    // Note: We'll store module completion in a separate table or as metadata
    res.json({ 
      message: 'Module completed successfully!',
      module_id: moduleId,
      completed_lessons: completionChecks.length,
      completed_at: new Date()
    });
  } catch (error) {
    console.error('Error completing module:', error);
    res.status(500).json({ message: 'Server error.' });
  }
});

// Create lesson (TEACHER/ADMIN only)
router.post('/', [
  body('title').trim().isLength({ min: 3 }),
  body('moduleId').notEmpty(),
  body('order').isInt({ min: 1 })
], requireRole(['TEACHER', 'ADMIN']), async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { title, content, videoUrl, moduleId, order, duration } = req.body;

    const createQuery = `
      INSERT INTO lessons (title, content, video_url, module_id, "order", duration)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING *
    `;

    const result = await query(createQuery, [title, content, videoUrl, moduleId, order, duration]);
    
    res.status(201).json({ lesson: result.rows[0] });
  } catch (error) {
    console.error('Error creating lesson:', error);
    res.status(500).json({ message: 'Server error.' });
  }
});

// Update lesson (TEACHER/ADMIN only)
router.put('/:id', [
  body('title').optional().trim().isLength({ min: 3 })
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

    if (updateData.order !== undefined) {
      setClauses.push(`"order" = $${paramIndex}`);
      values.push(updateData.order);
      paramIndex++;
    }

    if (updateData.duration !== undefined) {
      setClauses.push(`duration = $${paramIndex}`);
      values.push(updateData.duration);
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

    const deleteQuery = `
      DELETE FROM lessons WHERE id = $1
    `;

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

module.exports = router; 