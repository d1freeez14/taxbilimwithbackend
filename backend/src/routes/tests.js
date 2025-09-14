const express = require('express');
const { body, validationResult } = require('express-validator');
const { query } = require('../lib/db');
const { requireRole, auth } = require('../middleware/auth');

const router = express.Router();

// Get all tests
router.get('/', async (req, res) => {
  try {
    const testsQuery = `
      SELECT 
        t.*,
        l.title as lesson_title,
        l.module_id,
        m.title as module_title,
        m.course_id,
        co.title as course_title
      FROM tests t
      LEFT JOIN lessons l ON t.lesson_id = l.id
      LEFT JOIN modules m ON l.module_id = m.id
      LEFT JOIN courses co ON m.course_id = co.id
      ORDER BY t.created_at DESC
    `;
    
    const result = await query(testsQuery);
    res.json({ tests: result.rows });
  } catch (error) {
    console.error('Error fetching tests:', error);
    res.status(500).json({ message: 'Server error.' });
  }
});

// Get test by ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    const testQuery = `
      SELECT 
        t.*,
        json_agg(
          json_build_object(
            'id', tq.id,
            'question_text', tq.question_text,
            'question_type', tq.question_type,
            'options', tq.options,
            'correct_answer', tq.correct_answer,
            'points', tq.points,
            'question_order', tq.question_order
          ) ORDER BY tq.question_order
        ) as questions
      FROM tests t
      LEFT JOIN test_questions tq ON t.id = tq.test_id
      WHERE t.id = $1
      GROUP BY t.id
    `;
    
    const result = await query(testQuery, [id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Test not found.' });
    }
    
    res.json({ test: result.rows[0] });
  } catch (error) {
    console.error('Error fetching test:', error);
    res.status(500).json({ message: 'Server error.' });
  }
});

// Create test (TEACHER/ADMIN only)
router.post('/', [
  body('title').trim().isLength({ min: 3 }),
  body('lessonId').optional(),
  body('timeLimit').optional().isInt({ min: 1 }),
  body('passingScore').optional().isInt({ min: 0, max: 100 })
], requireRole(['TEACHER', 'ADMIN']), async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { title, description, lessonId, timeLimit, passingScore = 70 } = req.body;

    const createQuery = `
      INSERT INTO tests (title, description, lesson_id, time_limit, passing_score)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING *
    `;

    const result = await query(createQuery, [title, description, lessonId, timeLimit, passingScore]);
    
    res.status(201).json({ test: result.rows[0] });
  } catch (error) {
    console.error('Error creating test:', error);
    res.status(500).json({ message: 'Server error.' });
  }
});

// Update test (TEACHER/ADMIN only)
router.put('/:id', [
  body('title').optional().trim().isLength({ min: 3 }),
  body('timeLimit').optional().isInt({ min: 1 }),
  body('passingScore').optional().isInt({ min: 0, max: 100 })
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

    if (updateData.description !== undefined) {
      setClauses.push(`description = $${paramIndex}`);
      values.push(updateData.description);
      paramIndex++;
    }

    if (updateData.timeLimit !== undefined) {
      setClauses.push(`time_limit = $${paramIndex}`);
      values.push(updateData.timeLimit);
      paramIndex++;
    }

    if (updateData.passingScore !== undefined) {
      setClauses.push(`passing_score = $${paramIndex}`);
      values.push(updateData.passingScore);
      paramIndex++;
    }

    if (setClauses.length === 0) {
      return res.status(400).json({ message: 'No valid fields to update.' });
    }

    const updateQuery = `
      UPDATE tests 
      SET ${setClauses.join(', ')}, updated_at = CURRENT_TIMESTAMP
      WHERE id = $${paramIndex}
      RETURNING *
    `;

    values.push(id);
    const result = await query(updateQuery, values);

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Test not found.' });
    }

    res.json({ test: result.rows[0] });
  } catch (error) {
    console.error('Error updating test:', error);
    res.status(500).json({ message: 'Server error.' });
  }
});

// Delete test (ADMIN only)
router.delete('/:id', requireRole(['ADMIN']), async (req, res) => {
  try {
    const { id } = req.params;

    const deleteQuery = `DELETE FROM tests WHERE id = $1`;
    const result = await query(deleteQuery, [id]);

    if (result.rowCount === 0) {
      return res.status(404).json({ message: 'Test not found.' });
    }

    res.json({ message: 'Test deleted successfully.' });
  } catch (error) {
    console.error('Error deleting test:', error);
    res.status(500).json({ message: 'Server error.' });
  }
});

// Submit test attempt
router.post('/:id/attempt', [
  body('answers').isArray(),
  body('answers.*.questionId').notEmpty(),
  body('answers.*.answer').notEmpty()
], auth, async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { id } = req.params;
    const { answers } = req.body;
    const userId = req.user.id;

    // Get test with questions
    const testQuery = `
      SELECT t.*, 
        json_agg(
          json_build_object(
            'id', tq.id,
            'correct_answer', tq.correct_answer,
            'points', tq.points
          )
        ) as questions
      FROM tests t
      LEFT JOIN test_questions tq ON t.id = tq.test_id
      WHERE t.id = $1
      GROUP BY t.id
    `;

    const testResult = await query(testQuery, [id]);
    
    if (testResult.rows.length === 0) {
      return res.status(404).json({ message: 'Test not found.' });
    }

    const test = testResult.rows[0];
    const questions = test.questions || [];

    // Calculate score
    let totalScore = 0;
    let maxScore = 0;
    const answerResults = [];

    for (const question of questions) {
      maxScore += question.points || 1;
      const userAnswer = answers.find(a => a.questionId === question.id);
      
      if (userAnswer && userAnswer.answer === question.correct_answer) {
        totalScore += question.points || 1;
        answerResults.push({
          questionId: question.id,
          userAnswer: userAnswer.answer,
          correctAnswer: question.correct_answer,
          isCorrect: true,
          points: question.points || 1
        });
      } else {
        answerResults.push({
          questionId: question.id,
          userAnswer: userAnswer?.answer || '',
          correctAnswer: question.correct_answer,
          isCorrect: false,
          points: 0
        });
      }
    }

    const percentage = maxScore > 0 ? Math.round((totalScore / maxScore) * 100) : 0;
    const passed = percentage >= test.passing_score;

    // Save attempt
    const attemptQuery = `
      INSERT INTO test_attempts (user_id, test_id, score, percentage, passed, answers)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING *
    `;

    const attemptResult = await query(attemptQuery, [
      userId, id, totalScore, percentage, passed, JSON.stringify(answerResults)
    ]);

    res.json({
      attempt: attemptResult.rows[0],
      score: totalScore,
      maxScore,
      percentage,
      passed,
      answerResults
    });
  } catch (error) {
    console.error('Error submitting test attempt:', error);
    res.status(500).json({ message: 'Server error.' });
  }
});

// Get user's test attempts
router.get('/:id/attempts', auth, async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const attemptsQuery = `
      SELECT * FROM test_attempts 
      WHERE test_id = $1 AND user_id = $2
      ORDER BY created_at DESC
    `;

    const result = await query(attemptsQuery, [id, userId]);
    res.json({ attempts: result.rows });
  } catch (error) {
    console.error('Error fetching test attempts:', error);
    res.status(500).json({ message: 'Server error.' });
  }
});

// Add question to test
router.post('/:id/questions', [
  body('questionText').trim().isLength({ min: 5 }),
  body('questionType').isIn(['multiple_choice', 'true_false', 'text']),
  body('options').isArray(),
  body('correctAnswer').notEmpty(),
  body('points').optional().isInt({ min: 1 }),
  body('questionOrder').isInt({ min: 1 })
], requireRole(['TEACHER', 'ADMIN']), async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { id } = req.params;
    const { questionText, questionType, options, correctAnswer, points = 1, questionOrder } = req.body;

    const createQuery = `
      INSERT INTO test_questions (test_id, question_text, question_type, options, correct_answer, points, question_order)
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING *
    `;

    const result = await query(createQuery, [
      id, questionText, questionType, JSON.stringify(options), correctAnswer, points, questionOrder
    ]);
    
    res.status(201).json({ question: result.rows[0] });
  } catch (error) {
    console.error('Error adding question:', error);
    res.status(500).json({ message: 'Server error.' });
  }
});

module.exports = router;