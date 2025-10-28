const express = require('express');
const { query } = require('../lib/db');
const authMiddleware = require('../middleware/auth');
const { body, validationResult } = require('express-validator');

const router = express.Router();

// Получить общую статистику учителя
router.get('/dashboard-stats', authMiddleware.auth, async (req, res) => {
  try {
    const userId = req.user.id;
    
    // Проверяем, что пользователь - учитель или админ
    if (req.user.role !== 'TEACHER' && req.user.role !== 'ADMIN') {
      return res.status(403).json({ message: 'Access denied. Teacher role required.' });
    }

    // Общая статистика по курсам
    const statsQuery = `
      SELECT 
        COUNT(DISTINCT c.id) as total_courses,
        COUNT(DISTINCT CASE WHEN c.is_published = true THEN c.id END) as published_courses,
        COUNT(DISTINCT CASE WHEN c.is_published = false THEN c.id END) as draft_courses,
        COUNT(DISTINCT e.id) as total_enrollments,
        COUNT(DISTINCT CASE WHEN e.completed_at IS NOT NULL THEN e.id END) as completed_enrollments,
        COUNT(DISTINCT CASE WHEN e.completed_at IS NULL THEN e.id END) as active_enrollments,
        COALESCE(SUM(c.price), 0) as total_revenue,
        COALESCE(AVG(r.rating), 0) as average_rating,
        COUNT(DISTINCT r.id) as total_reviews
      FROM courses c
      LEFT JOIN enrollments e ON c.id = e.course_id
      LEFT JOIN reviews r ON c.id = r.course_id
      WHERE c.author_id = $1
    `;

    const statsResult = await query(statsQuery, [userId]);
    const stats = statsResult.rows[0];

    // Статистика по месяцам (продажи)
    const monthlyStatsQuery = `
      SELECT 
        DATE_TRUNC('month', e.enrolled_at) as month,
        COUNT(e.id) as enrollments,
        SUM(c.price) as revenue
      FROM enrollments e
      JOIN courses c ON e.course_id = c.id
      WHERE c.author_id = $1
        AND e.enrolled_at >= NOW() - INTERVAL '12 months'
      GROUP BY DATE_TRUNC('month', e.enrolled_at)
      ORDER BY month DESC
    `;

    const monthlyResult = await query(monthlyStatsQuery, [userId]);

    // Топ курсы по продажам
    const topCoursesQuery = `
      SELECT 
        c.id,
        c.title,
        c.price,
        COUNT(e.id) as enrollments,
        SUM(c.price) as revenue,
        AVG(r.rating) as rating,
        COUNT(r.id) as reviews_count
      FROM courses c
      LEFT JOIN enrollments e ON c.id = e.course_id
      LEFT JOIN reviews r ON c.id = r.course_id
      WHERE c.author_id = $1
      GROUP BY c.id, c.title, c.price
      ORDER BY enrollments DESC
      LIMIT 5
    `;

    const topCoursesResult = await query(topCoursesQuery, [userId]);

    res.json({
      success: true,
      stats: {
        total_courses: parseInt(stats.total_courses),
        published_courses: parseInt(stats.published_courses),
        draft_courses: parseInt(stats.draft_courses),
        total_enrollments: parseInt(stats.total_enrollments),
        completed_enrollments: parseInt(stats.completed_enrollments),
        active_enrollments: parseInt(stats.active_enrollments),
        total_revenue: parseFloat(stats.total_revenue),
        average_rating: parseFloat(stats.average_rating),
        total_reviews: parseInt(stats.total_reviews)
      },
      monthly_stats: monthlyResult.rows.map(row => ({
        month: row.month,
        enrollments: parseInt(row.enrollments),
        revenue: parseFloat(row.revenue || 0)
      })),
      top_courses: topCoursesResult.rows.map(row => ({
        id: row.id,
        title: row.title,
        price: parseFloat(row.price),
        enrollments: parseInt(row.enrollments),
        revenue: parseFloat(row.revenue || 0),
        rating: parseFloat(row.rating || 0),
        reviews_count: parseInt(row.reviews_count)
      }))
    });

  } catch (error) {
    console.error('Error fetching teacher dashboard stats:', error);
    res.status(500).json({ message: 'Server error.' });
  }
});

module.exports = router;
