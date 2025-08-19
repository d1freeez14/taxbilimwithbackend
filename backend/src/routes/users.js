const express = require('express');
const { body, validationResult } = require('express-validator');
const { query } = require('../lib/db');
const { requireRole } = require('../middleware/auth');

const router = express.Router();

// Get all users (ADMIN only)
router.get('/', requireRole(['ADMIN']), async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const offset = (page - 1) * limit;

    const usersQuery = `
      SELECT id, email, name, avatar, role, created_at, updated_at
      FROM users
      ORDER BY created_at DESC
      LIMIT $1 OFFSET $2
    `;

    const countQuery = `
      SELECT COUNT(*) as total FROM users
    `;

    const usersResult = await query(usersQuery, [parseInt(limit), offset]);
    const countResult = await query(countQuery);

    const total = parseInt(countResult.rows[0].total);

    res.json({
      users: usersResult.rows,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ message: 'Server error.' });
  }
});

// Get user by ID
router.get('/:id', requireRole(['ADMIN']), async (req, res) => {
  try {
    const { id } = req.params;

    const userQuery = `
      SELECT id, email, name, avatar, role, created_at, updated_at
      FROM users WHERE id = $1
    `;

    const result = await query(userQuery, [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'User not found.' });
    }

    res.json({ user: result.rows[0] });
  } catch (error) {
    console.error('Error fetching user:', error);
    res.status(500).json({ message: 'Server error.' });
  }
});

// Update user (ADMIN only)
router.put('/:id', [
  body('name').optional().trim().isLength({ min: 2 }),
  body('role').optional().isIn(['STUDENT', 'TEACHER', 'ADMIN'])
], requireRole(['ADMIN']), async (req, res) => {
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

    if (updateData.name) {
      setClauses.push(`name = $${paramIndex}`);
      values.push(updateData.name);
      paramIndex++;
    }

    if (updateData.role) {
      setClauses.push(`role = $${paramIndex}`);
      values.push(updateData.role);
      paramIndex++;
    }

    if (updateData.avatar) {
      setClauses.push(`avatar = $${paramIndex}`);
      values.push(updateData.avatar);
      paramIndex++;
    }

    if (setClauses.length === 0) {
      return res.status(400).json({ message: 'No valid fields to update.' });
    }

    const updateQuery = `
      UPDATE users 
      SET ${setClauses.join(', ')}, updated_at = CURRENT_TIMESTAMP
      WHERE id = $${paramIndex}
      RETURNING id, email, name, avatar, role, created_at, updated_at
    `;

    values.push(id);
    const result = await query(updateQuery, values);

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'User not found.' });
    }

    res.json({ user: result.rows[0] });
  } catch (error) {
    console.error('Error updating user:', error);
    res.status(500).json({ message: 'Server error.' });
  }
});

// Delete user (ADMIN only)
router.delete('/:id', requireRole(['ADMIN']), async (req, res) => {
  try {
    const { id } = req.params;

    const deleteQuery = `
      DELETE FROM users WHERE id = $1
    `;

    const result = await query(deleteQuery, [id]);

    if (result.rowCount === 0) {
      return res.status(404).json({ message: 'User not found.' });
    }

    res.json({ message: 'User deleted successfully.' });
  } catch (error) {
    console.error('Error deleting user:', error);
    res.status(500).json({ message: 'Server error.' });
  }
});

module.exports = router; 