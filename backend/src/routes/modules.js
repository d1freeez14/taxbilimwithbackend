const express = require('express');
const { body, validationResult } = require('express-validator');
const { query } = require('../lib/db');
const { requireRole } = require('../middleware/auth');

const router = express.Router();

// Get modules for a course
router.get('/course/:courseId', async (req, res) => {
  try {
    const { courseId } = req.params;
    
    const modulesQuery = `
      SELECT * FROM modules 
      WHERE course_id = $1 
      ORDER BY "order"
    `;
    
    const result = await query(modulesQuery, [courseId]);
    res.json({ modules: result.rows });
  } catch (error) {
    console.error('Error fetching modules:', error);
    res.status(500).json({ message: 'Server error.' });
  }
});

// Get module by ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    const moduleQuery = `
      SELECT * FROM modules WHERE id = $1
    `;
    
    const result = await query(moduleQuery, [id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Module not found.' });
    }
    
    res.json({ module: result.rows[0] });
  } catch (error) {
    console.error('Error fetching module:', error);
    res.status(500).json({ message: 'Server error.' });
  }
});

// Create module (TEACHER/ADMIN only)
router.post('/', [
  body('title').trim().isLength({ min: 3 }),
  body('courseId').notEmpty(),
  body('order').isInt({ min: 1 })
], requireRole(['TEACHER', 'ADMIN']), async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { title, courseId, order } = req.body;

    const createQuery = `
      INSERT INTO modules (title, course_id, "order")
      VALUES ($1, $2, $3)
      RETURNING *
    `;

    const result = await query(createQuery, [title, courseId, order]);
    
    res.status(201).json({ module: result.rows[0] });
  } catch (error) {
    console.error('Error creating module:', error);
    res.status(500).json({ message: 'Server error.' });
  }
});

// Update module (TEACHER/ADMIN only)
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

    if (updateData.order !== undefined) {
      setClauses.push(`"order" = $${paramIndex}`);
      values.push(updateData.order);
      paramIndex++;
    }

    if (setClauses.length === 0) {
      return res.status(400).json({ message: 'No valid fields to update.' });
    }

    const updateQuery = `
      UPDATE modules 
      SET ${setClauses.join(', ')}, updated_at = CURRENT_TIMESTAMP
      WHERE id = $${paramIndex}
      RETURNING *
    `;

    values.push(id);
    const result = await query(updateQuery, values);

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Module not found.' });
    }

    res.json({ module: result.rows[0] });
  } catch (error) {
    console.error('Error updating module:', error);
    res.status(500).json({ message: 'Server error.' });
  }
});

// Delete module (ADMIN only)
router.delete('/:id', requireRole(['ADMIN']), async (req, res) => {
  try {
    const { id } = req.params;

    const deleteQuery = `
      DELETE FROM modules WHERE id = $1
    `;

    const result = await query(deleteQuery, [id]);

    if (result.rowCount === 0) {
      return res.status(404).json({ message: 'Module not found.' });
    }

    res.json({ message: 'Module deleted successfully.' });
  } catch (error) {
    console.error('Error deleting module:', error);
    res.status(500).json({ message: 'Server error.' });
  }
});

module.exports = router; 