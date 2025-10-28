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

    if (category_id) {
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
    const coursesQuery = `
      SELECT 
        c.id,
        c.title,
        c.description,
        c.price,
        c.image_src,
        c.bg,
        c.is_published,
        c.is_sales_leader,
        c.is_recorded,
        c.category_id,
        c.access_duration,
        c.video_url,
        c.created_at,
        c.updated_at,
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
      GROUP BY c.id, c.title, c.description, c.price, c.image_src, c.bg, 
               c.is_published, c.is_sales_leader, c.is_recorded, c.category_id,
               c.access_duration, c.video_url, c.created_at, c.updated_at
      ORDER BY c.created_at DESC
      LIMIT $${paramIndex} OFFSET $${paramIndex + 1}
    `;

    queryParams.push(limit, offset);
    const coursesResult = await query(coursesQuery, queryParams);

    // Форматируем результат
    const courses = coursesResult.rows.map(course => ({
      id: course.id,
      title: course.title,
      description: course.description,
      price: parseFloat(course.price),
      image_src: course.image_src,
      bg: course.bg,
      is_published: course.is_published,
      is_sales_leader: course.is_sales_leader,
      is_recorded: course.is_recorded,
      category_id: course.category_id,
      access_duration: course.access_duration,
      video_url: course.video_url,
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
    }));

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

// Получить детальную статистику по курсу учителя
router.get('/my-courses/:courseId/stats', authMiddleware.auth, async (req, res) => {
  try {
    const userId = req.user.id;
    const { courseId } = req.params;

    if (req.user.role !== 'TEACHER' && req.user.role !== 'ADMIN') {
      return res.status(403).json({ message: 'Access denied. Teacher role required.' });
    }

    // Проверяем, что курс принадлежит учителю
    const courseCheckQuery = `
      SELECT id, title FROM courses 
      WHERE id = $1 AND author_id = $2
    `;
    const courseCheckResult = await query(courseCheckQuery, [courseId, userId]);
    
    if (courseCheckResult.rows.length === 0) {
      return res.status(404).json({ message: 'Course not found or access denied.' });
    }

    // Статистика по месяцам
    const monthlyStatsQuery = `
      SELECT 
        DATE_TRUNC('month', e.enrolled_at) as month,
        COUNT(e.id) as enrollments,
        SUM(c.price) as revenue
      FROM enrollments e
      JOIN courses c ON e.course_id = c.id
      WHERE c.id = $1 AND c.author_id = $2
        AND e.enrolled_at >= NOW() - INTERVAL '12 months'
      GROUP BY DATE_TRUNC('month', e.enrolled_at)
      ORDER BY month DESC
    `;

    const monthlyResult = await query(monthlyStatsQuery, [courseId, userId]);

    // Статистика по студентам
    const studentsStatsQuery = `
      SELECT 
        u.id,
        u.name,
        u.email,
        u.avatar,
        e.enrolled_at,
        e.completed_at,
        CASE WHEN e.completed_at IS NOT NULL THEN 'completed' ELSE 'active' END as status,
        r.rating,
        r.comment
      FROM enrollments e
      JOIN users u ON e.user_id = u.id
      LEFT JOIN reviews r ON e.user_id = r.user_id AND e.course_id = r.course_id
      WHERE e.course_id = $1
      ORDER BY e.enrolled_at DESC
    `;

    const studentsResult = await query(studentsStatsQuery, [courseId]);

    // Общая статистика
    const overallStatsQuery = `
      SELECT 
        COUNT(DISTINCT e.id) as total_enrollments,
        COUNT(DISTINCT CASE WHEN e.completed_at IS NOT NULL THEN e.id END) as completed_enrollments,
        AVG(r.rating) as average_rating,
        COUNT(DISTINCT r.id) as total_reviews,
        SUM(c.price) as total_revenue
      FROM enrollments e
      JOIN courses c ON e.course_id = c.id
      LEFT JOIN reviews r ON e.course_id = r.course_id
      WHERE c.id = $1 AND c.author_id = $2
    `;

    const overallResult = await query(overallStatsQuery, [courseId, userId]);
    const stats = overallResult.rows[0];

    res.json({
      success: true,
      course: courseCheckResult.rows[0],
      stats: {
        total_enrollments: parseInt(stats.total_enrollments),
        completed_enrollments: parseInt(stats.completed_enrollments),
        completion_rate: stats.total_enrollments > 0 
          ? Math.round((stats.completed_enrollments / stats.total_enrollments) * 100) 
          : 0,
        average_rating: parseFloat(stats.average_rating || 0),
        total_reviews: parseInt(stats.total_reviews),
        total_revenue: parseFloat(stats.total_revenue || 0)
      },
      monthly_stats: monthlyResult.rows.map(row => ({
        month: row.month,
        enrollments: parseInt(row.enrollments),
        revenue: parseFloat(row.revenue || 0)
      })),
      students: studentsResult.rows.map(student => ({
        ...student,
        rating: student.rating ? parseFloat(student.rating) : null
      }))
    });

  } catch (error) {
    console.error('Error fetching course stats:', error);
    res.status(500).json({ message: 'Server error.' });
  }
});

module.exports = router;
