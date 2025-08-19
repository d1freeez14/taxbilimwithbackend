const express = require('express');
const { body, validationResult } = require('express-validator');
const { query } = require('../lib/db');
const { requireRole, auth } = require('../middleware/auth');

const router = express.Router();

/**
 * @swagger
 * /api/courses:
 *   get:
 *     summary: Get all published courses
 *     description: Retrieve a paginated list of all published courses with optional search and filtering
 *     tags: [Courses]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Page number for pagination
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Number of courses per page
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Search term for course title or description
 *       - in: query
 *         name: category
 *         schema:
 *           type: string
 *         description: Filter by category ID
 *     responses:
 *       200:
 *         description: List of courses retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 courses:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Course'
 *                 pagination:
 *                   type: object
 *                   properties:
 *                     page:
 *                       type: integer
 *                       example: 1
 *                     limit:
 *                       type: integer
 *                       example: 10
 *                     total:
 *                       type: integer
 *                       example: 25
 *                     pages:
 *                       type: integer
 *                       example: 3
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get('/', async (req, res) => {
  try {
    const { page = 1, limit = 10, search, category } = req.query;
    const offset = (page - 1) * limit;

    let whereClause = 'WHERE c.is_published = true';
    let params = [];
    let paramIndex = 1;

    if (search) {
      whereClause += ` AND (c.title ILIKE $${paramIndex} OR c.description ILIKE $${paramIndex})`;
      params.push(`%${search}%`);
      paramIndex++;
    }

    if (category) {
      whereClause += ` AND c.category_id = $${paramIndex}`;
      params.push(category);
      paramIndex++;
    }

    const coursesQuery = `
      SELECT 
        c.*,
        a.id as author_id,
        a.name as author_name,
        a.avatar as author_avatar,
        COUNT(DISTINCT e.id) as enrollment_count,
        COUNT(DISTINCT r.id) as review_count,
        AVG(r.rating) as average_rating,
        false as is_favorite
      FROM courses c
      LEFT JOIN authors a ON c.author_id = a.id
      LEFT JOIN enrollments e ON c.id = e.course_id
      LEFT JOIN reviews r ON c.id = r.course_id
      ${whereClause}
      GROUP BY c.id, a.id
      ORDER BY c.created_at DESC
      LIMIT $${paramIndex} OFFSET $${paramIndex + 1}
    `;

    const countQuery = `
      SELECT COUNT(*) as total
      FROM courses c
      ${whereClause}
    `;

    const coursesResult = await query(coursesQuery, [...params, parseInt(limit), offset]);
    const countResult = await query(countQuery, params);

    const total = parseInt(countResult.rows[0].total);

    res.json({
      courses: coursesResult.rows,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Error fetching courses:', error);
    res.status(500).json({ message: 'Server error.' });
  }
});

/**
 * @swagger
 * /api/courses/{id}:
 *   get:
 *     summary: Get course by ID
 *     description: Retrieve detailed information about a specific course including modules and lessons
 *     tags: [Courses]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Course ID
 *     responses:
 *       200:
 *         description: Course details retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 course:
 *                   allOf:
 *                     - $ref: '#/components/schemas/Course'
 *                     - type: object
 *                       properties:
 *                         modules:
 *                           type: array
 *                           items:
 *                             allOf:
 *                               - $ref: '#/components/schemas/Module'
 *                               - type: object
 *                                 properties:
 *                                   lessons:
 *                                     type: array
 *                                     items:
 *                                       $ref: '#/components/schemas/Lesson'
 *       404:
 *         description: Course not found
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
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    // Get course with author
    const courseQuery = `
      SELECT 
        c.*,
        a.id as author_id,
        a.name as author_name,
        a.avatar as author_avatar,
        a.bio as author_bio,
        COUNT(DISTINCT e.id) as enrollment_count,
        COUNT(DISTINCT r.id) as review_count
      FROM courses c
      LEFT JOIN authors a ON c.author_id = a.id
      LEFT JOIN enrollments e ON c.id = e.course_id
      LEFT JOIN reviews r ON c.id = r.course_id
      WHERE c.id = $1
      GROUP BY c.id, a.id
    `;

    const courseResult = await query(courseQuery, [id]);
    
    if (courseResult.rows.length === 0) {
      return res.status(404).json({ message: 'Course not found.' });
    }

    const course = courseResult.rows[0];

    // Get modules with lessons
    const modulesQuery = `
      SELECT 
        m.*,
        json_agg(
          json_build_object(
            'id', l.id,
            'title', l.title,
            'duration', l.duration,
            'order', l."order"
          ) ORDER BY l."order"
        ) as lessons
      FROM modules m
      LEFT JOIN lessons l ON m.id = l.module_id
      WHERE m.course_id = $1
      GROUP BY m.id
      ORDER BY m."order"
    `;

    const modulesResult = await query(modulesQuery, [id]);
    course.modules = modulesResult.rows;

    // Get reviews statistics
    const reviewsStatsQuery = `
      SELECT 
        COUNT(*) as total_reviews,
        AVG(rating) as average_rating,
        COUNT(CASE WHEN rating = 5 THEN 1 END) as five_star,
        COUNT(CASE WHEN rating = 4 THEN 1 END) as four_star,
        COUNT(CASE WHEN rating = 3 THEN 1 END) as three_star,
        COUNT(CASE WHEN rating = 2 THEN 1 END) as two_star,
        COUNT(CASE WHEN rating = 1 THEN 1 END) as one_star
      FROM reviews 
      WHERE course_id = $1
    `;

    const reviewsStatsResult = await query(reviewsStatsQuery, [id]);
    const reviewsStats = reviewsStatsResult.rows[0];

    // Get recent reviews (limit to 5 for preview)
    const reviewsQuery = `
      SELECT 
        r.*,
        u.name as user_name,
        u.avatar as user_avatar
      FROM reviews r
      JOIN users u ON r.user_id = u.id
      WHERE r.course_id = $1
      ORDER BY r.created_at DESC
      LIMIT 5
    `;

    const reviewsResult = await query(reviewsQuery, [id]);

    // Add reviews data to course
    course.reviews = {
      statistics: {
        total: parseInt(reviewsStats.total_reviews) || 0,
        average: parseFloat(reviewsStats.average_rating) || 0,
        distribution: {
          five_star: parseInt(reviewsStats.five_star) || 0,
          four_star: parseInt(reviewsStats.four_star) || 0,
          three_star: parseInt(reviewsStats.three_star) || 0,
          two_star: parseInt(reviewsStats.two_star) || 0,
          one_star: parseInt(reviewsStats.one_star) || 0
        }
      },
      recent_reviews: reviewsResult.rows
    };

    res.json({ course });
  } catch (error) {
    console.error('Error fetching course:', error);
    res.status(500).json({ message: 'Server error.' });
  }
});

// Create course (TEACHER/ADMIN only)
router.post('/', [
  body('title').trim().isLength({ min: 3 }),
  body('description').trim().isLength({ min: 10 }),
  body('price').isFloat({ min: 0 }),
  body('authorId').notEmpty(),
  body('features').isArray(),
  body('whatYouLearn').isArray()
], requireRole(['TEACHER', 'ADMIN']), async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { title, description, price, authorId, features, whatYouLearn, imageSrc, bg } = req.body;

    const createQuery = `
      INSERT INTO courses (title, description, price, author_id, features, what_you_learn, image_src, bg)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      RETURNING *
    `;

    const courseResult = await query(createQuery, [
      title,
      description,
      parseFloat(price),
      authorId,
      JSON.stringify(features),
      JSON.stringify(whatYouLearn),
      imageSrc || '/coursePlaceholder.png',
      bg || 'white'
    ]);

    const course = courseResult.rows[0];

    // Get author info
    const authorQuery = `
      SELECT id, name, avatar
      FROM authors
      WHERE id = $1
    `;

    const authorResult = await query(authorQuery, [course.author_id]);
    course.author = authorResult.rows[0];

    res.status(201).json({ course });
  } catch (error) {
    console.error('Error creating course:', error);
    res.status(500).json({ message: 'Server error.' });
  }
});

// Update course (TEACHER/ADMIN only)
router.put('/:id', [
  body('title').optional().trim().isLength({ min: 3 }),
  body('description').optional().trim().isLength({ min: 10 }),
  body('price').optional().isFloat({ min: 0 })
], requireRole(['TEACHER', 'ADMIN']), async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { id } = req.params;
    const updateData = req.body;

    // Build dynamic update query
    const setClauses = [];
    const values = [];
    let paramIndex = 1;

    if (updateData.title) {
      setClauses.push(`title = $${paramIndex}`);
      values.push(updateData.title);
      paramIndex++;
    }

    if (updateData.description) {
      setClauses.push(`description = $${paramIndex}`);
      values.push(updateData.description);
      paramIndex++;
    }

    if (updateData.price !== undefined) {
      setClauses.push(`price = $${paramIndex}`);
      values.push(parseFloat(updateData.price));
      paramIndex++;
    }

    if (setClauses.length === 0) {
      return res.status(400).json({ message: 'No valid fields to update.' });
    }

    const updateQuery = `
      UPDATE courses 
      SET ${setClauses.join(', ')}, updated_at = CURRENT_TIMESTAMP
      WHERE id = $${paramIndex}
      RETURNING *
    `;

    values.push(id);
    const courseResult = await query(updateQuery, values);

    if (courseResult.rows.length === 0) {
      return res.status(404).json({ message: 'Course not found.' });
    }

    const course = courseResult.rows[0];

    // Get author info
    const authorQuery = `
      SELECT id, name, avatar
      FROM authors
      WHERE id = $1
    `;

    const authorResult = await query(authorQuery, [course.author_id]);
    course.author = authorResult.rows[0];

    res.json({ course });
  } catch (error) {
    console.error('Error updating course:', error);
    res.status(500).json({ message: 'Server error.' });
  }
});

// Delete course (ADMIN only)
router.delete('/:id', requireRole(['ADMIN']), async (req, res) => {
  try {
    const { id } = req.params;

    const deleteQuery = `
      DELETE FROM courses
      WHERE id = $1
    `;

    const result = await query(deleteQuery, [id]);

    if (result.rowCount === 0) {
      return res.status(404).json({ message: 'Course not found.' });
    }

    res.json({ message: 'Course deleted successfully.' });
  } catch (error) {
    console.error('Error deleting course:', error);
    res.status(500).json({ message: 'Server error.' });
  }
});

// Publish/Unpublish course (TEACHER/ADMIN only)
router.patch('/:id/publish', requireRole(['TEACHER', 'ADMIN']), async (req, res) => {
  try {
    const { id } = req.params;
    const { isPublished } = req.body;

    const updateQuery = `
      UPDATE courses 
      SET is_published = $1, updated_at = CURRENT_TIMESTAMP
      WHERE id = $2
      RETURNING *
    `;

    const courseResult = await query(updateQuery, [isPublished, id]);

    if (courseResult.rows.length === 0) {
      return res.status(404).json({ message: 'Course not found.' });
    }

    const course = courseResult.rows[0];

    // Get author info
    const authorQuery = `
      SELECT id, name, avatar
      FROM authors
      WHERE id = $1
    `;

    const authorResult = await query(authorQuery, [course.author_id]);
    course.author = authorResult.rows[0];

    res.json({ course });
  } catch (error) {
    console.error('Error updating course publish status:', error);
    res.status(500).json({ message: 'Server error.' });
  }
});

module.exports = router; 