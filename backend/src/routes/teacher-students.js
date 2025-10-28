const express = require('express');
const { query } = require('../lib/db');
const authMiddleware = require('../middleware/auth');
const { body, validationResult } = require('express-validator');

const router = express.Router();

// Получить список всех учеников с фильтрами
router.get('/students', authMiddleware.auth, async (req, res) => {
  try {
    const userId = req.user.id;
    
    // Проверяем, что пользователь - учитель или админ
    if (req.user.role !== 'TEACHER' && req.user.role !== 'ADMIN') {
      return res.status(403).json({ message: 'Access denied. Teacher role required.' });
    }

    const { 
      course_id, 
      search, 
      status, 
      enrollment_date_from, 
      enrollment_date_to,
      page = 1, 
      limit = 20 
    } = req.query;

    // Строим WHERE условия
    let whereConditions = [];
    let queryParams = [];
    let paramIndex = 1;

    // Базовое условие - только студенты учителя
    whereConditions.push(`
      EXISTS (
        SELECT 1 FROM courses c 
        WHERE c.id = e.course_id 
        AND c.author_id = $${paramIndex}
      )
    `);
    queryParams.push(userId);
    paramIndex++;

    if (course_id) {
      whereConditions.push(`e.course_id = $${paramIndex}`);
      queryParams.push(course_id);
      paramIndex++;
    }

    if (search) {
      whereConditions.push(`(u.name ILIKE $${paramIndex} OR u.email ILIKE $${paramIndex})`);
      queryParams.push(`%${search}%`);
      paramIndex++;
    }

    if (status === 'completed') {
      whereConditions.push(`e.completed_at IS NOT NULL`);
    } else if (status === 'active') {
      whereConditions.push(`e.completed_at IS NULL`);
    }

    if (enrollment_date_from) {
      whereConditions.push(`e.enrolled_at >= $${paramIndex}`);
      queryParams.push(enrollment_date_from);
      paramIndex++;
    }

    if (enrollment_date_to) {
      whereConditions.push(`e.enrolled_at <= $${paramIndex}`);
      queryParams.push(enrollment_date_to);
      paramIndex++;
    }

    const whereClause = whereConditions.length > 0 ? `WHERE ${whereConditions.join(' AND ')}` : '';

    // Подсчет общего количества
    const countQuery = `
      SELECT COUNT(DISTINCT u.id) as total
      FROM users u
      JOIN enrollments e ON u.id = e.user_id
      ${whereClause}
    `;

    const countResult = await query(countQuery, queryParams);
    const total = parseInt(countResult.rows[0].total);

    // Основной запрос с пагинацией
    const offset = (page - 1) * limit;
    const studentsQuery = `
      SELECT 
        u.id,
        u.name,
        u.email,
        u.avatar,
        u.created_at as user_created_at,
        COUNT(e.id) as total_enrollments,
        COUNT(CASE WHEN e.completed_at IS NOT NULL THEN e.id END) as completed_courses,
        MAX(e.enrolled_at) as last_enrollment_date,
        SUM(c.price) as total_spent,
        AVG(r.rating) as average_rating
      FROM users u
      JOIN enrollments e ON u.id = e.user_id
      JOIN courses c ON e.course_id = c.id
      LEFT JOIN reviews r ON u.id = r.user_id AND c.id = r.course_id
      ${whereClause}
      GROUP BY u.id, u.name, u.email, u.avatar, u.created_at
      ORDER BY last_enrollment_date DESC
      LIMIT $${paramIndex} OFFSET $${paramIndex + 1}
    `;

    queryParams.push(limit, offset);
    const studentsResult = await query(studentsQuery, queryParams);

    // Получаем детали по курсам для каждого студента
    const studentsWithCourses = await Promise.all(
      studentsResult.rows.map(async (student) => {
        const coursesQuery = `
          SELECT 
            c.id,
            c.title,
            c.price,
            e.enrolled_at,
            e.completed_at,
            CASE WHEN e.completed_at IS NOT NULL THEN 'completed' ELSE 'active' END as status
          FROM enrollments e
          JOIN courses c ON e.course_id = c.id
          WHERE e.user_id = $1 AND c.author_id = $2
          ORDER BY e.enrolled_at DESC
        `;
        
        const coursesResult = await query(coursesQuery, [student.id, userId]);
        
        return {
          ...student,
          total_spent: parseFloat(student.total_spent || 0),
          average_rating: parseFloat(student.average_rating || 0),
          courses: coursesResult.rows.map(course => ({
            ...course,
            price: parseFloat(course.price),
            status: course.status
          }))
        };
      })
    );

    res.json({
      success: true,
      students: studentsWithCourses,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      },
      filters: {
        course_id,
        search,
        status,
        enrollment_date_from,
        enrollment_date_to
      }
    });

  } catch (error) {
    console.error('Error fetching students:', error);
    res.status(500).json({ message: 'Server error.' });
  }
});

// Получить детальную информацию о студенте
router.get('/students/:studentId', authMiddleware.auth, async (req, res) => {
  try {
    const userId = req.user.id;
    const { studentId } = req.params;

    if (req.user.role !== 'TEACHER' && req.user.role !== 'ADMIN') {
      return res.status(403).json({ message: 'Access denied. Teacher role required.' });
    }

    // Информация о студенте
    const studentQuery = `
      SELECT 
        u.id,
        u.name,
        u.email,
        u.avatar,
        u.created_at,
        COUNT(e.id) as total_enrollments,
        COUNT(CASE WHEN e.completed_at IS NOT NULL THEN e.id END) as completed_courses,
        SUM(c.price) as total_spent,
        AVG(r.rating) as average_rating
      FROM users u
      LEFT JOIN enrollments e ON u.id = e.user_id
      LEFT JOIN courses c ON e.course_id = c.id AND c.author_id = $1
      LEFT JOIN reviews r ON u.id = r.user_id AND c.id = r.course_id
      WHERE u.id = $2
      GROUP BY u.id, u.name, u.email, u.avatar, u.created_at
    `;

    const studentResult = await query(studentQuery, [userId, studentId]);
    
    if (studentResult.rows.length === 0) {
      return res.status(404).json({ message: 'Student not found.' });
    }

    const student = studentResult.rows[0];

    // Курсы студента у этого учителя
    const coursesQuery = `
      SELECT 
        c.id,
        c.title,
        c.description,
        c.price,
        c.image_src,
        e.enrolled_at,
        e.completed_at,
        CASE WHEN e.completed_at IS NOT NULL THEN 'completed' ELSE 'active' END as status,
        r.rating,
        r.comment as review_comment,
        r.created_at as review_date
      FROM enrollments e
      JOIN courses c ON e.course_id = c.id
      LEFT JOIN reviews r ON e.user_id = r.user_id AND e.course_id = r.course_id
      WHERE e.user_id = $1 AND c.author_id = $2
      ORDER BY e.enrolled_at DESC
    `;

    const coursesResult = await query(coursesQuery, [studentId, userId]);

    res.json({
      success: true,
      student: {
        ...student,
        total_spent: parseFloat(student.total_spent || 0),
        average_rating: parseFloat(student.average_rating || 0),
        courses: coursesResult.rows.map(course => ({
          ...course,
          price: parseFloat(course.price),
          rating: course.rating ? parseFloat(course.rating) : null
        }))
      }
    });

  } catch (error) {
    console.error('Error fetching student details:', error);
    res.status(500).json({ message: 'Server error.' });
  }
});

module.exports = router;
