const express = require('express');
const { query } = require('../lib/db');
const authMiddleware = require('../middleware/auth');
const { body, validationResult } = require('express-validator');

const router = express.Router();

// Получить статистику продаж для учителя
router.get('/sales', authMiddleware.auth, async (req, res) => {
  try {
    const userId = req.user.id;
    
    if (req.user.role !== 'TEACHER' && req.user.role !== 'ADMIN') {
      return res.status(403).json({ message: 'Access denied. Teacher role required.' });
    }

    const { 
      start_date, 
      end_date, 
      course_id,
      period = 'month' // day, week, month, year
    } = req.query;

    // Строим WHERE условия
    let whereConditions = ['c.author_id = $1'];
    let queryParams = [userId];
    let paramIndex = 2;

    if (start_date) {
      whereConditions.push(`e.enrolled_at >= $${paramIndex}`);
      queryParams.push(start_date);
      paramIndex++;
    }

    if (end_date) {
      whereConditions.push(`e.enrolled_at <= $${paramIndex}`);
      queryParams.push(end_date);
      paramIndex++;
    }

    if (course_id) {
      whereConditions.push(`c.id = $${paramIndex}`);
      queryParams.push(course_id);
      paramIndex++;
    }

    const whereClause = whereConditions.join(' AND ');

    // Определяем группировку по периоду
    let dateTrunc;
    switch (period) {
      case 'day':
        dateTrunc = "DATE_TRUNC('day', e.enrolled_at)";
        break;
      case 'week':
        dateTrunc = "DATE_TRUNC('week', e.enrolled_at)";
        break;
      case 'year':
        dateTrunc = "DATE_TRUNC('year', e.enrolled_at)";
        break;
      default:
        dateTrunc = "DATE_TRUNC('month', e.enrolled_at)";
    }

    // Статистика продаж по периодам
    const salesQuery = `
      SELECT 
        ${dateTrunc} as period,
        COUNT(e.id) as sales_count,
        SUM(c.price) as revenue,
        AVG(c.price) as average_price
      FROM enrollments e
      JOIN courses c ON e.course_id = c.id
      WHERE ${whereClause}
      GROUP BY ${dateTrunc}
      ORDER BY period DESC
      LIMIT 50
    `;

    const salesResult = await query(salesQuery, queryParams);

    // Общая статистика
    const overallStatsQuery = `
      SELECT 
        COUNT(e.id) as total_sales,
        SUM(c.price) as total_revenue,
        AVG(c.price) as average_price,
        MIN(c.price) as min_price,
        MAX(c.price) as max_price,
        COUNT(DISTINCT c.id) as courses_sold
      FROM enrollments e
      JOIN courses c ON e.course_id = c.id
      WHERE ${whereClause}
    `;

    const overallResult = await query(overallStatsQuery, queryParams);
    const overallStats = overallResult.rows[0];

    // Топ курсы по продажам
    const topCoursesQuery = `
      SELECT 
        c.id,
        c.title,
        c.price,
        COUNT(e.id) as sales_count,
        SUM(c.price) as revenue
      FROM enrollments e
      JOIN courses c ON e.course_id = c.id
      WHERE ${whereClause}
      GROUP BY c.id, c.title, c.price
      ORDER BY sales_count DESC
      LIMIT 10
    `;

    const topCoursesResult = await query(topCoursesQuery, queryParams);

    res.json({
      success: true,
      period,
      filters: {
        start_date,
        end_date,
        course_id
      },
      overall_stats: {
        total_sales: parseInt(overallStats.total_sales),
        total_revenue: parseFloat(overallStats.total_revenue || 0),
        average_price: parseFloat(overallStats.average_price || 0),
        min_price: parseFloat(overallStats.min_price || 0),
        max_price: parseFloat(overallStats.max_price || 0),
        courses_sold: parseInt(overallStats.courses_sold)
      },
      sales_by_period: salesResult.rows.map(row => ({
        period: row.period,
        sales_count: parseInt(row.sales_count),
        revenue: parseFloat(row.revenue || 0),
        average_price: parseFloat(row.average_price || 0)
      })),
      top_courses: topCoursesResult.rows.map(course => ({
        id: course.id,
        title: course.title,
        price: parseFloat(course.price),
        sales_count: parseInt(course.sales_count),
        revenue: parseFloat(course.revenue || 0)
      }))
    });

  } catch (error) {
    console.error('Error fetching sales data:', error);
    res.status(500).json({ message: 'Server error.' });
  }
});

// Покупка курса (для студентов)
router.post('/purchase', authMiddleware.auth, [
  body('course_id').isInt().withMessage('Course ID is required'),
  body('payment_method').isIn(['card', 'bank_transfer', 'cash']).withMessage('Invalid payment method'),
  body('card_number').optional().isLength({ min: 16, max: 19 }).withMessage('Invalid card number'),
  body('card_holder').optional().trim().isLength({ min: 2 }).withMessage('Card holder name is required'),
  body('expiry_date').optional().matches(/^(0[1-9]|1[0-2])\/\d{2}$/).withMessage('Invalid expiry date'),
  body('cvv').optional().isLength({ min: 3, max: 4 }).withMessage('Invalid CVV')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const userId = req.user.id;
    const { course_id, payment_method, card_number, card_holder, expiry_date, cvv } = req.body;

    // Проверяем, что пользователь - студент
    if (req.user.role !== 'STUDENT') {
      return res.status(403).json({ message: 'Only students can purchase courses.' });
    }

    // Проверяем, что курс существует и опубликован
    const courseQuery = `
      SELECT id, title, price, author_id, is_published, access_duration
      FROM courses 
      WHERE id = $1 AND is_published = true
    `;
    const courseResult = await query(courseQuery, [course_id]);
    
    if (courseResult.rows.length === 0) {
      return res.status(404).json({ message: 'Course not found or not available for purchase.' });
    }

    const course = courseResult.rows[0];

    // Проверяем, не записан ли уже студент на курс
    const existingEnrollmentQuery = `
      SELECT id FROM enrollments 
      WHERE user_id = $1 AND course_id = $2
    `;
    const existingResult = await query(existingEnrollmentQuery, [userId, course_id]);
    
    if (existingResult.rows.length > 0) {
      return res.status(400).json({ message: 'You are already enrolled in this course.' });
    }

    // Создаем запись о покупке (в реальном приложении здесь была бы интеграция с платежной системой)
    const purchaseQuery = `
      INSERT INTO purchases (
        user_id, 
        course_id, 
        amount, 
        payment_method, 
        payment_status,
        card_number_masked,
        card_holder,
        expiry_date,
        created_at
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, NOW())
      RETURNING *
    `;

    // Маскируем номер карты для безопасности
    const maskedCardNumber = card_number ? 
      card_number.replace(/(\d{4})\d{8,12}(\d{4})/, '$1****$2') : null;

    const purchaseResult = await query(purchaseQuery, [
      userId,
      course_id,
      course.price,
      payment_method,
      'completed', // В реальном приложении статус зависит от ответа платежной системы
      maskedCardNumber,
      card_holder,
      expiry_date
    ]);

    // Создаем запись о записи на курс
    const enrollmentQuery = `
      INSERT INTO enrollments (user_id, course_id, enrolled_at)
      VALUES ($1, $2, NOW())
      RETURNING *
    `;

    const enrollmentResult = await query(enrollmentQuery, [userId, course_id]);

    // Получаем информацию о курсе для ответа
    const courseInfoQuery = `
      SELECT 
        c.*,
        u.name as author_name,
        u.avatar as author_avatar
      FROM courses c
      JOIN users u ON c.author_id = u.id
      WHERE c.id = $1
    `;
    const courseInfoResult = await query(courseInfoQuery, [course_id]);

    res.status(201).json({
      success: true,
      message: 'Course purchased successfully',
      purchase: {
        id: purchaseResult.rows[0].id,
        amount: parseFloat(purchaseResult.rows[0].amount),
        payment_method: purchaseResult.rows[0].payment_method,
        payment_status: purchaseResult.rows[0].payment_status,
        created_at: purchaseResult.rows[0].created_at
      },
      enrollment: {
        id: enrollmentResult.rows[0].id,
        enrolled_at: enrollmentResult.rows[0].enrolled_at
      },
      course: courseInfoResult.rows[0]
    });

  } catch (error) {
    console.error('Error processing purchase:', error);
    res.status(500).json({ message: 'Server error.' });
  }
});

// Получить историю покупок студента
router.get('/my-purchases', authMiddleware.auth, async (req, res) => {
  try {
    const userId = req.user.id;

    if (req.user.role !== 'STUDENT') {
      return res.status(403).json({ message: 'Only students can view purchase history.' });
    }

    const { page = 1, limit = 20 } = req.query;
    const offset = (page - 1) * limit;

    const purchasesQuery = `
      SELECT 
        p.id,
        p.amount,
        p.payment_method,
        p.payment_status,
        p.created_at as purchase_date,
        c.id as course_id,
        c.title as course_title,
        c.image_src as course_image,
        c.description as course_description,
        u.name as author_name,
        u.avatar as author_avatar,
        e.enrolled_at,
        e.completed_at
      FROM purchases p
      JOIN courses c ON p.course_id = c.id
      JOIN users u ON c.author_id = u.id
      LEFT JOIN enrollments e ON p.user_id = e.user_id AND p.course_id = e.course_id
      WHERE p.user_id = $1
      ORDER BY p.created_at DESC
      LIMIT $2 OFFSET $3
    `;

    const purchasesResult = await query(purchasesQuery, [userId, limit, offset]);

    // Подсчет общего количества
    const countQuery = `
      SELECT COUNT(*) as total
      FROM purchases p
      WHERE p.user_id = $1
    `;
    const countResult = await query(countQuery, [userId]);
    const total = parseInt(countResult.rows[0].total);

    res.json({
      success: true,
      purchases: purchasesResult.rows.map(purchase => ({
        id: purchase.id,
        amount: parseFloat(purchase.amount),
        payment_method: purchase.payment_method,
        payment_status: purchase.payment_status,
        purchase_date: purchase.purchase_date,
        course: {
          id: purchase.course_id,
          title: purchase.course_title,
          image_src: purchase.course_image,
          description: purchase.course_description,
          author_name: purchase.author_name,
          author_avatar: purchase.author_avatar
        },
        enrollment: {
          enrolled_at: purchase.enrolled_at,
          completed_at: purchase.completed_at,
          status: purchase.completed_at ? 'completed' : 'active'
        }
      })),
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });

  } catch (error) {
    console.error('Error fetching purchase history:', error);
    res.status(500).json({ message: 'Server error.' });
  }
});

module.exports = router;
