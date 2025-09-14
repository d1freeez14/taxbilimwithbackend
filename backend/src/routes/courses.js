const express = require('express');
const { body, validationResult } = require('express-validator');
const { query } = require('../lib/db');
const { requireRole, auth } = require('../middleware/auth');
const { formatCourseStatistics, getCourseSummaryText } = require('../lib/formatDuration');

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
        false as is_favorite,
        COALESCE(c.module_count, 0) as module_count,
        COALESCE(c.lesson_count, 0) as lesson_count,
        COALESCE(c.total_duration, 0) as total_duration
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

    // Format course statistics
    const formattedCourses = coursesResult.rows.map(course => ({
      ...course,
      statistics: formatCourseStatistics(course),
      summaryText: getCourseSummaryText(course)
    }));

    res.json({
      courses: formattedCourses,
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
        COUNT(DISTINCT r.id) as review_count,
        COALESCE(c.module_count, 0) as module_count,
        COALESCE(c.lesson_count, 0) as lesson_count,
        COALESCE(c.total_duration, 0) as total_duration
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

    // Get modules with lessons and statistics
    const modulesQuery = `
      SELECT 
        m.*,
        COALESCE(m.lesson_count, 0) as lesson_count,
        COALESCE(m.assignment_count, 0) as assignment_count,
        COALESCE(m.total_duration, 0) as total_duration,
        COALESCE(m.duration_weeks, 1) as duration_weeks,
        COALESCE(test_stats.test_count, 0) as test_count,
        COALESCE(test_stats.test_titles, '') as test_titles,
        json_agg(
          json_build_object(
            'id', l.id,
            'title', l.title,
            'duration', l.duration,
            'order', l."order",
            'image', l.image,
            'locked', l.locked,
            'lesson_type', l.lesson_type,
            'test_id', l.test_id,
            'url', l.url
          ) ORDER BY l."order"
        ) as lessons
      FROM modules m
      LEFT JOIN lessons l ON m.id = l.module_id
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
      GROUP BY m.id, test_stats.test_count, test_stats.test_titles
      ORDER BY m."order"
    `;

    const modulesResult = await query(modulesQuery, [id]);
    
    // Format course statistics
    course.statistics = formatCourseStatistics(course);
    course.summaryText = getCourseSummaryText(course);
    
    // Format module statistics
    const { formatModuleStatistics, getModuleSummaryText } = require('../lib/formatDuration');
    course.modules = modulesResult.rows.map(module => ({
      ...module,
      statistics: formatModuleStatistics(module),
      summaryText: getModuleSummaryText(module),
      hasTests: parseInt(module.test_count) > 0,
      testCount: parseInt(module.test_count),
      testTitles: module.test_titles ? module.test_titles.split(', ') : []
    }));

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
  body('whatYouLearn').isArray(),
  body('progress').optional().isInt({ min: 0, max: 100 })
], requireRole(['TEACHER', 'ADMIN']), async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { title, description, price, authorId, features, whatYouLearn, imageSrc, bg, progress = 0 } = req.body;

    const createQuery = `
      INSERT INTO courses (title, description, price, author_id, features, what_you_learn, image_src, bg, progress)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
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
      bg || 'white',
      parseInt(progress)
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
  body('price').optional().isFloat({ min: 0 }),
  body('progress').optional().isInt({ min: 0, max: 100 })
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

    if (updateData.progress !== undefined) {
      setClauses.push(`progress = $${paramIndex}`);
      values.push(parseInt(updateData.progress));
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

/**
 * @swagger
 * /api/courses/{id}/progress:
 *   get:
 *     summary: Get course progress
 *     description: Retrieve the progress percentage for a specific course
 *     tags: [Courses]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Course ID
 *     responses:
 *       200:
 *         description: Course progress retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 progress:
 *                   type: integer
 *                   minimum: 0
 *                   maximum: 100
 *                   description: Progress percentage
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
router.get('/:id/progress', async (req, res) => {
  try {
    const { id } = req.params;

    const progressQuery = `
      SELECT progress
      FROM courses
      WHERE id = $1
    `;

    const result = await query(progressQuery, [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Course not found.' });
    }

    res.json({ progress: result.rows[0].progress });
  } catch (error) {
    console.error('Error fetching course progress:', error);
    res.status(500).json({ message: 'Server error.' });
  }
});

/**
 * @swagger
 * /api/courses/{id}/progress:
 *   patch:
 *     summary: Update course progress
 *     description: Update the progress percentage for a specific course
 *     tags: [Courses]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Course ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               progress:
 *                 type: integer
 *                 minimum: 0
 *                 maximum: 100
 *                 description: Progress percentage
 *             required:
 *               - progress
 *     responses:
 *       200:
 *         description: Course progress updated successfully
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
 *                         progress:
 *                           type: integer
 *       400:
 *         description: Invalid progress value
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
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
router.patch('/:id/progress', [
  body('progress').isInt({ min: 0, max: 100 }).withMessage('Progress must be between 0 and 100')
], requireRole(['TEACHER', 'ADMIN']), async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { id } = req.params;
    const { progress } = req.body;

    const updateQuery = `
      UPDATE courses 
      SET progress = $1, updated_at = CURRENT_TIMESTAMP
      WHERE id = $2
      RETURNING *
    `;

    const courseResult = await query(updateQuery, [progress, id]);

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
    console.error('Error updating course progress:', error);
    res.status(500).json({ message: 'Server error.' });
  }
});

/**
 * @swagger
 * /api/courses/{id}/progress/calculate:
 *   post:
 *     summary: Calculate course progress automatically
 *     description: Calculate and update course progress based on completed lessons
 *     tags: [Courses]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Course ID
 *     responses:
 *       200:
 *         description: Course progress calculated and updated successfully
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
 *                         progress:
 *                           type: integer
 *                 calculatedProgress:
 *                   type: object
 *                   properties:
 *                     totalLessons:
 *                       type: integer
 *                     completedLessons:
 *                       type: integer
 *                     progressPercentage:
 *                       type: integer
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
router.post('/:id/progress/calculate', requireRole(['TEACHER', 'ADMIN']), async (req, res) => {
  try {
    const { id } = req.params;

    // First, check if course exists
    const courseCheckQuery = `
      SELECT id FROM courses WHERE id = $1
    `;
    const courseCheckResult = await query(courseCheckQuery, [id]);
    
    if (courseCheckResult.rows.length === 0) {
      return res.status(404).json({ message: 'Course not found.' });
    }

    // Calculate progress based on completed lessons
    const progressQuery = `
      SELECT 
        COUNT(l.id) as total_lessons,
        COUNT(CASE WHEN lp.completed = true THEN 1 END) as completed_lessons
      FROM lessons l
      JOIN modules m ON l.module_id = m.id
      LEFT JOIN lesson_progress lp ON l.id = lp.lesson_id
      WHERE m.course_id = $1
    `;

    const progressResult = await query(progressQuery, [id]);
    const { total_lessons, completed_lessons } = progressResult.rows[0];
    
    const totalLessons = parseInt(total_lessons) || 0;
    const completedLessons = parseInt(completed_lessons) || 0;
    const progressPercentage = totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0;

    // Update course progress
    const updateQuery = `
      UPDATE courses 
      SET progress = $1, updated_at = CURRENT_TIMESTAMP
      WHERE id = $2
      RETURNING *
    `;

    const courseResult = await query(updateQuery, [progressPercentage, id]);
    const course = courseResult.rows[0];

    // Get author info
    const authorQuery = `
      SELECT id, name, avatar
      FROM authors
      WHERE id = $1
    `;

    const authorResult = await query(authorQuery, [course.author_id]);
    course.author = authorResult.rows[0];

    res.json({ 
      course,
      calculatedProgress: {
        totalLessons,
        completedLessons,
        progressPercentage
      }
    });
  } catch (error) {
    console.error('Error calculating course progress:', error);
    res.status(500).json({ message: 'Server error.' });
  }
});

/**
 * Calculate and update course statistics
 * @param {string} courseId - Course ID
 * @returns {Object} Updated statistics
 */
async function calculateCourseStatistics(courseId) {
  try {
    // Calculate course statistics
    const courseStatsQuery = `
      SELECT 
        COUNT(DISTINCT m.id) as module_count,
        COUNT(DISTINCT l.id) as lesson_count,
        COALESCE(SUM(l.duration), 0) as total_duration
      FROM modules m
      LEFT JOIN lessons l ON m.id = l.module_id
      WHERE m.course_id = $1
    `;

    const courseStatsResult = await query(courseStatsQuery, [courseId]);
    const { module_count, lesson_count, total_duration } = courseStatsResult.rows[0];

    // Update course statistics
    const updateCourseQuery = `
      UPDATE courses 
      SET 
        module_count = $1,
        lesson_count = $2,
        total_duration = $3,
        updated_at = CURRENT_TIMESTAMP
      WHERE id = $4
      RETURNING *
    `;

    const courseResult = await query(updateCourseQuery, [
      parseInt(module_count) || 0,
      parseInt(lesson_count) || 0,
      parseInt(total_duration) || 0,
      courseId
    ]);

    return {
      moduleCount: parseInt(module_count) || 0,
      lessonCount: parseInt(lesson_count) || 0,
      totalDuration: parseInt(total_duration) || 0,
      course: courseResult.rows[0]
    };
  } catch (error) {
    console.error('Error calculating course statistics:', error);
    throw error;
  }
}

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
 * /api/courses/{id}/statistics/calculate:
 *   post:
 *     summary: Calculate course statistics
 *     description: Calculate and update course statistics (modules, lessons, duration)
 *     tags: [Courses]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Course ID
 *     responses:
 *       200:
 *         description: Course statistics calculated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 statistics:
 *                   type: object
 *                   properties:
 *                     moduleCount:
 *                       type: integer
 *                     lessonCount:
 *                       type: integer
 *                     totalDuration:
 *                       type: integer
 *                 course:
 *                   $ref: '#/components/schemas/Course'
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
router.post('/:id/statistics/calculate', requireRole(['TEACHER', 'ADMIN']), async (req, res) => {
  try {
    const { id } = req.params;

    // Check if course exists
    const courseCheckQuery = `SELECT id FROM courses WHERE id = $1`;
    const courseCheckResult = await query(courseCheckQuery, [id]);
    
    if (courseCheckResult.rows.length === 0) {
      return res.status(404).json({ message: 'Course not found.' });
    }

    const statistics = await calculateCourseStatistics(id);

    res.json({ 
      statistics: {
        moduleCount: statistics.moduleCount,
        lessonCount: statistics.lessonCount,
        totalDuration: statistics.totalDuration
      },
      course: statistics.course
    });
  } catch (error) {
    console.error('Error calculating course statistics:', error);
    res.status(500).json({ message: 'Server error.' });
  }
});

module.exports = router; 