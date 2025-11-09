const express = require('express');
const { query } = require('../lib/db');
const authMiddleware = require('../middleware/auth');

const router = express.Router();

// Получить курсы учителя с полной информацией
router.get('/my-courses', authMiddleware.auth, async (req, res) => {
  try {
    const userId = req.user.id;
    
    // Проверяем, что пользователь - учитель или админ
    if (req.user.role !== 'TEACHER' && req.user.role !== 'ADMIN') {
      return res.status(403).json({ message: 'Access denied. Teacher role required.' });
    }

    const { 
      status, 
      search, 
      category_id,
      page = 1, 
      limit = 20 
    } = req.query;

    // Check if category_id column exists
    const checkColumnQuery = `
      SELECT column_name 
      FROM information_schema.columns 
      WHERE table_name = 'courses' AND column_name = 'category_id'
    `;
    const columnCheck = await query(checkColumnQuery);
    const hasCategoryId = columnCheck.rows.length > 0;

    // Строим WHERE условия
    let whereConditions = ['c.author_id = $1'];
    let queryParams = [userId];
    let paramIndex = 2;

    if (status === 'published') {
      whereConditions.push(`c.is_published = true`);
    } else if (status === 'draft') {
      whereConditions.push(`c.is_published = false`);
    }

    if (search) {
      whereConditions.push(`(c.title ILIKE $${paramIndex} OR c.description ILIKE $${paramIndex})`);
      queryParams.push(`%${search}%`);
      paramIndex++;
    }

    if (category_id && hasCategoryId) {
      whereConditions.push(`c.category_id = $${paramIndex}`);
      queryParams.push(category_id);
      paramIndex++;
    }

    const whereClause = whereConditions.join(' AND ');

    // Подсчет общего количества
    const countQuery = `
      SELECT COUNT(*) as total
      FROM courses c
      WHERE ${whereClause}
    `;

    const countResult = await query(countQuery, queryParams);
    const total = parseInt(countResult.rows[0].total);

    // Основной запрос с пагинацией
    const offset = (page - 1) * limit;
    
    // Build SELECT and GROUP BY clauses dynamically based on existing columns
    let selectFields = [
      'c.id', 'c.title', 'c.description', 'c.price', 'c.image_src', 'c.bg',
      'c.is_published', 'c.is_sales_leader', 'c.is_recorded',
      'c.created_at', 'c.updated_at'
    ];
    let groupByFields = [
      'c.id', 'c.title', 'c.description', 'c.price', 'c.image_src', 'c.bg',
      'c.is_published', 'c.is_sales_leader', 'c.is_recorded',
      'c.created_at', 'c.updated_at'
    ];
    
    // Check for optional columns
    const checkOptionalColumnsQuery = `
      SELECT column_name 
      FROM information_schema.columns 
      WHERE table_name = 'courses' 
      AND column_name IN ('category_id', 'access_duration', 'video_url')
    `;
    const optionalColumnsCheck = await query(checkOptionalColumnsQuery);
    const existingOptionalColumns = optionalColumnsCheck.rows.map(row => row.column_name);
    
    if (existingOptionalColumns.includes('category_id')) {
      selectFields.push('c.category_id');
      groupByFields.push('c.category_id');
    }
    if (existingOptionalColumns.includes('access_duration')) {
      selectFields.push('c.access_duration');
      groupByFields.push('c.access_duration');
    }
    if (existingOptionalColumns.includes('video_url')) {
      selectFields.push('c.video_url');
      groupByFields.push('c.video_url');
    }
    
    const coursesQuery = `
      SELECT 
        ${selectFields.join(', ')},
        COUNT(DISTINCT e.id) as enrollment_count,
        COUNT(DISTINCT CASE WHEN e.completed_at IS NOT NULL THEN e.id END) as completed_enrollments,
        COUNT(DISTINCT r.id) as review_count,
        AVG(r.rating) as average_rating,
        SUM(c.price) as total_revenue,
        COUNT(DISTINCT m.id) as module_count,
        COUNT(DISTINCT l.id) as lesson_count,
        COALESCE(SUM(l.duration), 0) as total_duration
      FROM courses c
      LEFT JOIN enrollments e ON c.id = e.course_id
      LEFT JOIN reviews r ON c.id = r.course_id
      LEFT JOIN modules m ON c.id = m.course_id
      LEFT JOIN lessons l ON m.id = l.module_id
      WHERE ${whereClause}
      GROUP BY ${groupByFields.join(', ')}
      ORDER BY c.created_at DESC
      LIMIT $${paramIndex} OFFSET $${paramIndex + 1}
    `;

    queryParams.push(limit, offset);
    const coursesResult = await query(coursesQuery, queryParams);

    // Форматируем результат
    const courses = coursesResult.rows.map(course => {
      const courseData = {
        id: course.id,
        title: course.title,
        description: course.description,
        price: parseFloat(course.price),
        image_src: course.image_src,
        bg: course.bg,
        is_published: course.is_published,
        is_sales_leader: course.is_sales_leader,
        is_recorded: course.is_recorded,
        created_at: course.created_at,
        updated_at: course.updated_at,
        enrollment_count: parseInt(course.enrollment_count),
        completed_enrollments: parseInt(course.completed_enrollments),
        review_count: parseInt(course.review_count),
        average_rating: parseFloat(course.average_rating || 0),
        total_revenue: parseFloat(course.total_revenue || 0),
        module_count: parseInt(course.module_count),
        lesson_count: parseInt(course.lesson_count),
        total_duration: parseInt(course.total_duration),
        completion_rate: course.enrollment_count > 0 
          ? Math.round((course.completed_enrollments / course.enrollment_count) * 100) 
          : 0
      };
      
      // Add optional fields if they exist
      if (existingOptionalColumns.includes('category_id')) {
        courseData.category_id = course.category_id;
      }
      if (existingOptionalColumns.includes('access_duration')) {
        courseData.access_duration = course.access_duration;
      }
      if (existingOptionalColumns.includes('video_url')) {
        courseData.video_url = course.video_url;
      }
      
      return courseData;
    });

    res.json({
      success: true,
      courses,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      },
      filters: {
        status,
        search,
        category_id
      }
    });

  } catch (error) {
    console.error('Error fetching teacher courses:', error);
    res.status(500).json({ message: 'Server error.' });
  }
});

module.exports = router;
