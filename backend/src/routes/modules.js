const express = require('express');
const { body, validationResult } = require('express-validator');
const { query } = require('../lib/db');
const { requireRole } = require('../middleware/auth');
const { formatModuleStatistics, getModuleSummaryText } = require('../lib/formatDuration');

const router = express.Router();

// Get modules for a course with statistics
router.get('/course/:courseId', async (req, res) => {
  try {
    const { courseId } = req.params;
    
    const modulesQuery = `
      SELECT 
        m.*,
        COALESCE(m.lesson_count, 0) as lesson_count,
        COALESCE(m.assignment_count, 0) as assignment_count,
        COALESCE(m.total_duration, 0) as total_duration,
        COALESCE(m.duration_weeks, 1) as duration_weeks,
        COALESCE(test_stats.test_count, 0) as test_count,
        COALESCE(test_stats.test_titles, '') as test_titles
      FROM modules m
      LEFT JOIN (
        SELECT 
          l.module_id,
          COUNT(t.id) as test_count,
          STRING_AGG(t.title, ', ') as test_titles
        FROM lessons l
        LEFT JOIN tests t ON l.id = t.lesson_id
        GROUP BY l.module_id
      ) test_stats ON m.id = test_stats.module_id
      WHERE m.course_id = $1 
      ORDER BY m."order"
    `;
    
    const result = await query(modulesQuery, [courseId]);
    
    // Format module statistics
    const formattedModules = result.rows.map(module => ({
      ...module,
      statistics: formatModuleStatistics(module),
      summaryText: getModuleSummaryText(module),
      hasTests: parseInt(module.test_count) > 0,
      testCount: parseInt(module.test_count),
      testTitles: module.test_titles ? module.test_titles.split(', ') : []
    }));
    
    res.json({ modules: formattedModules });
  } catch (error) {
    console.error('Error fetching modules:', error);
    res.status(500).json({ message: 'Server error.' });
  }
});

// Get module by ID with statistics
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    const moduleQuery = `
      SELECT 
        m.*,
        COALESCE(m.lesson_count, 0) as lesson_count,
        COALESCE(m.assignment_count, 0) as assignment_count,
        COALESCE(m.total_duration, 0) as total_duration,
        COALESCE(m.duration_weeks, 1) as duration_weeks,
        COALESCE(test_stats.test_count, 0) as test_count,
        COALESCE(test_stats.test_titles, '') as test_titles
      FROM modules m
      LEFT JOIN (
        SELECT 
          l.module_id,
          COUNT(t.id) as test_count,
          STRING_AGG(t.title, ', ') as test_titles
        FROM lessons l
        LEFT JOIN tests t ON l.id = t.lesson_id
        WHERE l.module_id = $1
        GROUP BY l.module_id
      ) test_stats ON m.id = test_stats.module_id
      WHERE m.id = $1
    `;
    
    const result = await query(moduleQuery, [id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Module not found.' });
    }
    
    const module = result.rows[0];
    const formattedModule = {
      ...module,
      statistics: formatModuleStatistics(module),
      summaryText: getModuleSummaryText(module),
      hasTests: parseInt(module.test_count) > 0,
      testCount: parseInt(module.test_count),
      testTitles: module.test_titles ? module.test_titles.split(', ') : []
    };
    
    res.json({ module: formattedModule });
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

/**
 * Calculate and update module statistics
 * @param {string} moduleId - Module ID
 * @returns {Object} Updated statistics
 */
async function calculateModuleStatistics(moduleId) {
  try {
    // Calculate module statistics
    const moduleStatsQuery = `
      SELECT 
        COUNT(l.id) as lesson_count,
        COALESCE(SUM(l.duration), 0) as total_duration
      FROM lessons l
      WHERE l.module_id = $1
    `;

    const moduleStatsResult = await query(moduleStatsQuery, [moduleId]);
    const { lesson_count, total_duration } = moduleStatsResult.rows[0];

    // Update module statistics
    const updateModuleQuery = `
      UPDATE modules 
      SET 
        lesson_count = $1,
        total_duration = $2,
        updated_at = CURRENT_TIMESTAMP
      WHERE id = $3
      RETURNING *
    `;

    const moduleResult = await query(updateModuleQuery, [
      parseInt(lesson_count) || 0,
      parseInt(total_duration) || 0,
      moduleId
    ]);

    return {
      lessonCount: parseInt(lesson_count) || 0,
      totalDuration: parseInt(total_duration) || 0,
      module: moduleResult.rows[0]
    };
  } catch (error) {
    console.error('Error calculating module statistics:', error);
    throw error;
  }
}

/**
 * @swagger
 * /api/modules/{id}/statistics/calculate:
 *   post:
 *     summary: Calculate module statistics
 *     description: Calculate and update module statistics (lessons, duration)
 *     tags: [Modules]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Module ID
 *     responses:
 *       200:
 *         description: Module statistics calculated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 statistics:
 *                   type: object
 *                   properties:
 *                     lessonCount:
 *                       type: integer
 *                     totalDuration:
 *                       type: integer
 *                 module:
 *                   $ref: '#/components/schemas/Module'
 *       404:
 *         description: Module not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.post('/:id/statistics/calculate', requireRole(['TEACHER', 'ADMIN']), async (req, res) => {
  try {
    const { id } = req.params;

    // Check if module exists
    const moduleCheckQuery = `SELECT id FROM modules WHERE id = $1`;
    const moduleCheckResult = await query(moduleCheckQuery, [id]);
    
    if (moduleCheckResult.rows.length === 0) {
      return res.status(404).json({ message: 'Module not found.' });
    }

    const statistics = await calculateModuleStatistics(id);

    res.json({ 
      statistics: {
        lessonCount: statistics.lessonCount,
        totalDuration: statistics.totalDuration
      },
      module: statistics.module
    });
  } catch (error) {
    console.error('Error calculating module statistics:', error);
    res.status(500).json({ message: 'Server error.' });
  }
});

// Check if module has tests
router.get('/:id/tests', async (req, res) => {
  try {
    const { id } = req.params;
    
    const testsQuery = `
      SELECT 
        t.id,
        t.title,
        t.description,
        t.time_limit,
        t.passing_score,
        l.title as lesson_title,
        l.order as lesson_order
      FROM tests t
      JOIN lessons l ON t.lesson_id = l.id
      WHERE l.module_id = $1
      ORDER BY l.order, t.id
    `;
    
    const result = await query(testsQuery, [id]);
    
    res.json({ 
      hasTests: result.rows.length > 0,
      testCount: result.rows.length,
      tests: result.rows
    });
  } catch (error) {
    console.error('Error checking module tests:', error);
    res.status(500).json({ message: 'Server error.' });
  }
});

// Get module test summary
router.get('/:id/tests/summary', async (req, res) => {
  try {
    const { id } = req.params;
    
    const summaryQuery = `
      SELECT 
        COUNT(t.id) as total_tests,
        COUNT(CASE WHEN t.passing_score IS NOT NULL THEN 1 END) as tests_with_passing_score,
        AVG(t.time_limit) as avg_time_limit,
        AVG(t.passing_score) as avg_passing_score,
        STRING_AGG(t.title, ', ') as test_titles
      FROM tests t
      JOIN lessons l ON t.lesson_id = l.id
      WHERE l.module_id = $1
    `;
    
    const result = await query(summaryQuery, [id]);
    const summary = result.rows[0];
    
    res.json({
      hasTests: parseInt(summary.total_tests) > 0,
      totalTests: parseInt(summary.total_tests),
      testsWithPassingScore: parseInt(summary.tests_with_passing_score),
      avgTimeLimit: summary.avg_time_limit ? Math.round(summary.avg_time_limit) : null,
      avgPassingScore: summary.avg_passing_score ? Math.round(summary.avg_passing_score) : null,
      testTitles: summary.test_titles ? summary.test_titles.split(', ') : []
    });
  } catch (error) {
    console.error('Error getting module test summary:', error);
    res.status(500).json({ message: 'Server error.' });
  }
});

module.exports = router; 