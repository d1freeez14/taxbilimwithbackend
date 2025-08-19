const express = require('express');
const { body, validationResult } = require('express-validator');
const { query } = require('../lib/db');
const { requireRole } = require('../middleware/auth');

const router = express.Router();

// Get test questions for a lesson
router.get('/lesson/:lessonId', async (req, res) => {
  try {
    const { lessonId } = req.params;
    const userId = req.user?.id;
    
    // Check if lesson exists and get test questions
    const testQuery = `
      SELECT 
        t.id as test_id,
        t.title as test_title,
        t.description,
        t.time_limit,
        t.passing_score,
        q.id as question_id,
        q.question_text,
        q.question_type,
        q.options,
        q.correct_answer,
        q.points
      FROM tests t
      JOIN test_questions q ON t.id = q.test_id
      WHERE t.lesson_id = $1
      ORDER BY q.question_order
    `;
    
    const result = await query(testQuery, [lessonId]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'No test found for this lesson.' });
    }
    
    // Group questions by test
    const testData = {
      test_id: result.rows[0].test_id,
      test_title: result.rows[0].test_title,
      description: result.rows[0].description,
      time_limit: result.rows[0].time_limit,
      passing_score: result.rows[0].passing_score,
      questions: result.rows.map(row => ({
        question_id: row.question_id,
        question_text: row.question_text,
        question_type: row.question_type,
        options: row.options,
        points: row.points
        // Don't include correct_answer for security
      }))
    };
    
    // If user is authenticated, get their previous attempt
    if (userId) {
      const attemptQuery = `
        SELECT 
          ta.id as attempt_id,
          ta.score,
          ta.passed,
          ta.completed_at,
          ta.answers
        FROM test_attempts ta
        WHERE ta.user_id = $1 AND ta.test_id = $2
        ORDER BY ta.completed_at DESC
        LIMIT 1
      `;
      
      const attemptResult = await query(attemptQuery, [userId, testData.test_id]);
      
      if (attemptResult.rows.length > 0) {
        testData.previous_attempt = attemptResult.rows[0];
      }
    }
    
    res.json({ test: testData });
  } catch (error) {
    console.error('Error fetching test:', error);
    res.status(500).json({ message: 'Server error.' });
  }
});

// Submit test answers
router.post('/lesson/:lessonId/submit', [
  body('answers').isArray(),
  body('answers.*.question_id').isInt(),
  body('answers.*.selected_answer').notEmpty()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { lessonId } = req.params;
    const { answers } = req.body;
    const userId = req.user.id;
    
    // Get test information
    const testQuery = `
      SELECT t.id as test_id, t.passing_score, t.time_limit
      FROM tests t
      WHERE t.lesson_id = $1
    `;
    
    const testResult = await query(testQuery, [lessonId]);
    
    if (testResult.rows.length === 0) {
      return res.status(404).json({ message: 'Test not found.' });
    }
    
    const test = testResult.rows[0];
    
    // Check if user is enrolled in the course
    const enrollmentQuery = `
      SELECT e.* FROM enrollments e
      JOIN modules m ON e.course_id = m.course_id
      JOIN lessons l ON m.id = l.module_id
      WHERE e.user_id = $1 AND l.id = $2
    `;
    
    const enrollmentResult = await query(enrollmentQuery, [userId, lessonId]);
    
    if (enrollmentResult.rows.length === 0) {
      return res.status(403).json({ message: 'You must be enrolled in this course to take tests.' });
    }
    
    // Get correct answers and calculate score
    const questionsQuery = `
      SELECT id, correct_answer, points
      FROM test_questions
      WHERE test_id = $1
    `;
    
    const questionsResult = await query(questionsQuery, [test.test_id]);
    const questions = questionsResult.rows;
    
    let totalScore = 0;
    let earnedScore = 0;
    const gradedAnswers = [];
    
    // Grade each answer
    for (const answer of answers) {
      const question = questions.find(q => q.id === answer.question_id);
      if (question) {
        const isCorrect = answer.selected_answer === question.correct_answer;
        const points = isCorrect ? question.points : 0;
        
        totalScore += question.points;
        earnedScore += points;
        
        gradedAnswers.push({
          question_id: answer.question_id,
          selected_answer: answer.selected_answer,
          correct_answer: question.correct_answer,
          is_correct: isCorrect,
          points: points
        });
      }
    }
    
    const percentage = totalScore > 0 ? (earnedScore / totalScore) * 100 : 0;
    const passed = percentage >= test.passing_score;
    
    // Save test attempt
    const attemptQuery = `
      INSERT INTO test_attempts (
        user_id, test_id, score, percentage, passed, 
        answers, completed_at
      )
      VALUES ($1, $2, $3, $4, $5, $6, CURRENT_TIMESTAMP)
      RETURNING *
    `;
    
    const attemptResult = await query(attemptQuery, [
      userId, 
      test.test_id, 
      earnedScore, 
      percentage, 
      passed, 
      JSON.stringify(gradedAnswers)
    ]);
    
    // If test is passed, mark lesson as completed
    if (passed) {
      const completeQuery = `
        INSERT INTO lesson_progress (user_id, lesson_id, completed, completed_at)
        VALUES ($1, $2, true, CURRENT_TIMESTAMP)
        ON CONFLICT (user_id, lesson_id) 
        DO UPDATE SET completed = true, completed_at = CURRENT_TIMESTAMP
      `;
      
      await query(completeQuery, [userId, lessonId]);
    }
    
    res.json({
      message: passed ? 'Test passed!' : 'Test failed. Try again.',
      attempt_id: attemptResult.rows[0].id,
      score: earnedScore,
      total_possible: totalScore,
      percentage: percentage,
      passed: passed,
      answers: gradedAnswers
    });
    
  } catch (error) {
    console.error('Error submitting test:', error);
    res.status(500).json({ message: 'Server error.' });
  }
});

// Get test results for a user
router.get('/results/:testId', async (req, res) => {
  try {
    const { testId } = req.params;
    const userId = req.user.id;
    
    const resultsQuery = `
      SELECT 
        ta.id as attempt_id,
        ta.score,
        ta.percentage,
        ta.passed,
        ta.completed_at,
        ta.answers,
        t.title as test_title,
        t.passing_score
      FROM test_attempts ta
      JOIN tests t ON ta.test_id = t.id
      WHERE ta.user_id = $1 AND ta.test_id = $2
      ORDER BY ta.completed_at DESC
    `;
    
    const result = await query(resultsQuery, [userId, testId]);
    
    res.json({ 
      attempts: result.rows,
      total_attempts: result.rows.length
    });
  } catch (error) {
    console.error('Error fetching test results:', error);
    res.status(500).json({ message: 'Server error.' });
  }
});

// Create test (TEACHER/ADMIN only)
router.post('/', [
  body('lessonId').isInt(),
  body('title').trim().isLength({ min: 3 }),
  body('passingScore').isInt({ min: 0, max: 100 }),
  body('questions').isArray({ min: 1 })
], requireRole(['TEACHER', 'ADMIN']), async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { lessonId, title, description, timeLimit, passingScore, questions } = req.body;

    // Create test
    const testQuery = `
      INSERT INTO tests (lesson_id, title, description, time_limit, passing_score)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING id
    `;

    const testResult = await query(testQuery, [lessonId, title, description, timeLimit, passingScore]);
    const testId = testResult.rows[0].id;

    // Create questions
    for (let i = 0; i < questions.length; i++) {
      const question = questions[i];
      const questionQuery = `
        INSERT INTO test_questions (
          test_id, question_text, question_type, options, 
          correct_answer, points, question_order
        )
        VALUES ($1, $2, $3, $4, $5, $6, $7)
      `;

      await query(questionQuery, [
        testId,
        question.question_text,
        question.question_type,
        JSON.stringify(question.options),
        question.correct_answer,
        question.points || 1,
        i + 1
      ]);
    }

    res.status(201).json({ 
      message: 'Test created successfully.',
      test_id: testId
    });
  } catch (error) {
    console.error('Error creating test:', error);
    res.status(500).json({ message: 'Server error.' });
  }
});

module.exports = router; 