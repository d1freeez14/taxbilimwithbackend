const express = require('express');
const { body, validationResult } = require('express-validator');
const { query } = require('../lib/db');
const { requireRole } = require('../middleware/auth');

const router = express.Router();

// Get reviews for a course
router.get('/course/:courseId', async (req, res) => {
  try {
    const { courseId } = req.params;
    const { page = 1, limit = 10 } = req.query;
    const offset = (page - 1) * limit;

    const reviewsQuery = `
      SELECT 
        r.*,
        u.name as user_name,
        u.avatar as user_avatar
      FROM reviews r
      JOIN users u ON r.user_id = u.id
      WHERE r.course_id = $1
      ORDER BY r.created_at DESC
      LIMIT $2 OFFSET $3
    `;

    const countQuery = `
      SELECT COUNT(*) as total FROM reviews WHERE course_id = $1
    `;

    const reviewsResult = await query(reviewsQuery, [courseId, parseInt(limit), offset]);
    const countResult = await query(countQuery, [courseId]);

    const total = parseInt(countResult.rows[0].total);

    res.json({
      reviews: reviewsResult.rows,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Error fetching reviews:', error);
    res.status(500).json({ message: 'Server error.' });
  }
});

// Check if user can leave review for a course
router.get('/can-review/:courseId', async (req, res) => {
  try {
    const { courseId } = req.params;
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ 
        canReview: false, 
        message: 'Authentication required' 
      });
    }

    // Check if user is enrolled and has completed the course
    const enrollmentQuery = `
      SELECT e.*, 
             (SELECT COUNT(*) FROM lesson_progress lp 
              JOIN lessons l ON lp.lesson_id = l.id 
              JOIN modules m ON l.module_id = m.id 
              WHERE lp.user_id = e.user_id AND m.course_id = e.course_id AND lp.completed = true) as completed_lessons,
             (SELECT COUNT(*) FROM lessons l 
              JOIN modules m ON l.module_id = m.id 
              WHERE m.course_id = e.course_id) as total_lessons
      FROM enrollments e
      WHERE e.user_id = $1 AND e.course_id = $2
    `;

    const enrollmentResult = await query(enrollmentQuery, [userId, courseId]);

    if (enrollmentResult.rows.length === 0) {
      return res.json({ 
        canReview: false, 
        message: 'You must be enrolled in this course to leave a review' 
      });
    }

    const enrollment = enrollmentResult.rows[0];
    const progressPercentage = enrollment.total_lessons > 0 
      ? Math.round((enrollment.completed_lessons / enrollment.total_lessons) * 100)
      : 0;

    // Check if user has already left a review
    const existingReviewQuery = `
      SELECT id FROM reviews WHERE user_id = $1 AND course_id = $2
    `;
    const existingReviewResult = await query(existingReviewQuery, [userId, courseId]);
    const hasExistingReview = existingReviewResult.rows.length > 0;

    // User can review if they've completed at least 80% of the course
    const canReview = progressPercentage >= 80;

    res.json({
      canReview,
      hasExistingReview,
      progressPercentage,
      completedLessons: enrollment.completed_lessons,
      totalLessons: enrollment.total_lessons,
      message: canReview 
        ? (hasExistingReview ? 'You can update your existing review' : 'You can leave a review')
        : `Complete at least 80% of the course to leave a review (${progressPercentage}% completed)`
    });
  } catch (error) {
    console.error('Error checking review eligibility:', error);
    res.status(500).json({ message: 'Server error.' });
  }
});

// Create review
router.post('/', [
  body('courseId').notEmpty(),
  body('rating').isInt({ min: 1, max: 5 }),
  body('comment').optional().trim().isLength({ min: 10 })
], requireRole(['STUDENT', 'TEACHER', 'ADMIN']), async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { courseId, rating, comment } = req.body;
    const userId = req.user.id;

    // Check if user is enrolled and has sufficient progress
    const enrollmentQuery = `
      SELECT e.*, 
             (SELECT COUNT(*) FROM lesson_progress lp 
              JOIN lessons l ON lp.lesson_id = l.id 
              JOIN modules m ON l.module_id = m.id 
              WHERE lp.user_id = e.user_id AND m.course_id = e.course_id AND lp.completed = true) as completed_lessons,
             (SELECT COUNT(*) FROM lessons l 
              JOIN modules m ON l.module_id = m.id 
              WHERE m.course_id = e.course_id) as total_lessons
      FROM enrollments e
      WHERE e.user_id = $1 AND e.course_id = $2
    `;

    const enrollmentResult = await query(enrollmentQuery, [userId, courseId]);

    if (enrollmentResult.rows.length === 0) {
      return res.status(403).json({ 
        message: 'You must be enrolled in this course to leave a review' 
      });
    }

    const enrollment = enrollmentResult.rows[0];
    const progressPercentage = enrollment.total_lessons > 0 
      ? Math.round((enrollment.completed_lessons / enrollment.total_lessons) * 100)
      : 0;

    if (progressPercentage < 80) {
      return res.status(403).json({ 
        message: `You must complete at least 80% of the course to leave a review. Current progress: ${progressPercentage}%` 
      });
    }

    const createQuery = `
      INSERT INTO reviews (user_id, course_id, rating, comment)
      VALUES ($1, $2, $3, $4)
      ON CONFLICT (user_id, course_id)
      DO UPDATE SET 
        rating = $3,
        comment = $4,
        updated_at = CURRENT_TIMESTAMP
      RETURNING *
    `;

    const result = await query(createQuery, [userId, courseId, rating, comment || null]);

    res.status(201).json({ 
      review: result.rows[0],
      message: 'Review submitted successfully!'
    });
  } catch (error) {
    console.error('Error creating review:', error);
    res.status(500).json({ message: 'Server error.' });
  }
});

// Get user's review for a course
router.get('/my-review/:courseId', async (req, res) => {
  try {
    const { courseId } = req.params;
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ message: 'Authentication required' });
    }

    const reviewQuery = `
      SELECT r.*, u.name as user_name, u.avatar as user_avatar
      FROM reviews r
      JOIN users u ON r.user_id = u.id
      WHERE r.user_id = $1 AND r.course_id = $2
    `;

    const result = await query(reviewQuery, [userId, courseId]);

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Review not found' });
    }

    res.json({ review: result.rows[0] });
  } catch (error) {
    console.error('Error fetching user review:', error);
    res.status(500).json({ message: 'Server error.' });
  }
});

// Update review
router.put('/:id', [
  body('rating').isInt({ min: 1, max: 5 }),
  body('comment').optional().trim().isLength({ min: 10 })
], requireRole(['STUDENT', 'TEACHER', 'ADMIN']), async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { id } = req.params;
    const { rating, comment } = req.body;
    const userId = req.user.id;

    const updateQuery = `
      UPDATE reviews 
      SET rating = $1, comment = $2, updated_at = CURRENT_TIMESTAMP
      WHERE id = $3 AND user_id = $4
      RETURNING *
    `;

    const result = await query(updateQuery, [rating, comment || null, id, userId]);

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Review not found or unauthorized.' });
    }

    res.json({ 
      review: result.rows[0],
      message: 'Review updated successfully!'
    });
  } catch (error) {
    console.error('Error updating review:', error);
    res.status(500).json({ message: 'Server error.' });
  }
});

// Delete review
router.delete('/:id', requireRole(['STUDENT', 'TEACHER', 'ADMIN']), async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const deleteQuery = `
      DELETE FROM reviews 
      WHERE id = $1 AND user_id = $2
    `;

    const result = await query(deleteQuery, [id, userId]);

    if (result.rowCount === 0) {
      return res.status(404).json({ message: 'Review not found or unauthorized.' });
    }

    res.json({ message: 'Review deleted successfully.' });
  } catch (error) {
    console.error('Error deleting review:', error);
    res.status(500).json({ message: 'Server error.' });
  }
});

module.exports = router; 