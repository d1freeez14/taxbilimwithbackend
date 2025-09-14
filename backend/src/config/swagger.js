const swaggerJsdoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'TaxBilim API Documentation',
      version: '1.0.0',
      description: 'Complete API documentation for TaxBilim Learning Management System',
      contact: {
        name: 'TaxBilim Team',
        email: 'support@taxbilim.com'
      },
      license: {
        name: 'MIT',
        url: 'https://opensource.org/licenses/MIT'
      }
    },
    servers: [
      {
        url: 'http://localhost:5001',
        description: 'Development server'
      },
      {
        url: 'https://api.taxbilim.com',
        description: 'Production server'
      }
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          description: 'JWT token obtained from login endpoint'
        }
      },
      schemas: {
        User: {
          type: 'object',
          properties: {
            id: { type: 'integer', example: 1 },
            email: { type: 'string', format: 'email', example: 'user@taxbilim.com' },
            name: { type: 'string', example: 'John Doe' },
            avatar: { type: 'string', nullable: true, example: '/avatars.png' },
            role: { type: 'string', enum: ['STUDENT', 'TEACHER', 'ADMIN'], example: 'STUDENT' },
            created_at: { type: 'string', format: 'date-time' },
            updated_at: { type: 'string', format: 'date-time' }
          }
        },
        Author: {
          type: 'object',
          properties: {
            id: { type: 'integer', example: 1 },
            name: { type: 'string', example: 'Иван Петров' },
            avatar: { type: 'string', nullable: true, example: '/author-avatar.jpg' },
            bio: { type: 'string', nullable: true, example: 'Краткая биография автора' },
            description: { type: 'string', nullable: true, example: 'Подробное описание автора и его опыта' },
            created_at: { type: 'string', format: 'date-time' },
            updated_at: { type: 'string', format: 'date-time' }
          }
        },
        Course: {
          type: 'object',
          properties: {
            id: { type: 'integer', example: 1 },
            title: { type: 'string', example: 'Основы налогообложения' },
            description: { type: 'string', example: 'Комплексный курс по основам налогообложения' },
            image_src: { type: 'string', example: '/coursePlaceholder.png' },
            price: { type: 'number', example: 25990.00 },
            bg: { type: 'string', example: 'white' },
            is_published: { type: 'boolean', example: true },
            progress: { type: 'integer', minimum: 0, maximum: 100, example: 75, description: 'Course progress percentage' },
            module_count: { type: 'integer', example: 5, description: 'Number of modules' },
            lesson_count: { type: 'integer', example: 78, description: 'Number of video lessons' },
            total_duration: { type: 'integer', example: 750, description: 'Total duration in minutes' },
            features: { type: 'array', items: { type: 'string' }, example: ['5 Модулей', '78 видеоуроков'] },
            what_you_learn: { type: 'array', items: { type: 'string' }, example: ['Понимание основных принципов'] },
            author_id: { type: 'integer', example: 1 },
            created_at: { type: 'string', format: 'date-time' },
            updated_at: { type: 'string', format: 'date-time' }
          }
        },
        Module: {
          type: 'object',
          properties: {
            id: { type: 'integer', example: 1 },
            title: { type: 'string', example: 'Модуль 1: Введение в налогообложение' },
            order: { type: 'integer', example: 1 },
            course_id: { type: 'integer', example: 1 },
            lesson_count: { type: 'integer', example: 15, description: 'Number of video lessons' },
            assignment_count: { type: 'integer', example: 3, description: 'Number of assignments' },
            total_duration: { type: 'integer', example: 150, description: 'Total duration in minutes' },
            duration_weeks: { type: 'integer', example: 2, description: 'Duration in weeks' },
            created_at: { type: 'string', format: 'date-time' },
            updated_at: { type: 'string', format: 'date-time' }
          }
        },
        Lesson: {
          type: 'object',
          properties: {
            id: { type: 'integer', example: 1 },
            title: { type: 'string', example: 'Урок 1: Что такое налоги' },
            content: { type: 'string', example: 'В этом уроке мы изучим основные понятия...' },
            video_url: { type: 'string', nullable: true },
            order: { type: 'integer', example: 1 },
            module_id: { type: 'integer', example: 1 },
            duration: { type: 'integer', example: 15 },
            image: { type: 'string', nullable: true, example: '/lesson-thumbnail.jpg' },
            locked: { type: 'boolean', example: false, description: 'Whether lesson is locked' },
            lesson_type: { type: 'string', enum: ['VIDEO', 'TEST', 'READING', 'ASSIGNMENT', 'LIVE_SESSION', 'QUIZ'], example: 'VIDEO' },
            test_id: { type: 'integer', nullable: true, example: 1 },
            url: { type: 'string', nullable: true, example: '/custom-lesson-url' },
            is_unlocked: { type: 'boolean', example: true, description: 'Whether lesson is unlocked for user' },
            created_at: { type: 'string', format: 'date-time' },
            updated_at: { type: 'string', format: 'date-time' }
          }
        },
        Enrollment: {
          type: 'object',
          properties: {
            id: { type: 'integer', example: 1 },
            user_id: { type: 'integer', example: 1 },
            course_id: { type: 'integer', example: 1 },
            enrolled_at: { type: 'string', format: 'date-time' },
            completed_at: { type: 'string', format: 'date-time', nullable: true },
            is_recorded: { type: 'boolean', example: true, description: 'Whether the course is recorded or live' }
          }
        },
        Progress: {
          type: 'object',
          properties: {
            id: { type: 'integer', example: 1 },
            user_id: { type: 'integer', example: 1 },
            lesson_id: { type: 'integer', example: 1 },
            completed: { type: 'boolean', example: true },
            completed_at: { type: 'string', format: 'date-time', nullable: true },
            created_at: { type: 'string', format: 'date-time' },
            updated_at: { type: 'string', format: 'date-time' }
          }
        },
        Review: {
          type: 'object',
          properties: {
            id: { type: 'integer', example: 1 },
            user_id: { type: 'integer', example: 1 },
            course_id: { type: 'integer', example: 1 },
            rating: { type: 'integer', minimum: 1, maximum: 5, example: 5 },
            comment: { type: 'string', example: 'Отличный курс! Очень понятно объясняют.' },
            created_at: { type: 'string', format: 'date-time' },
            updated_at: { type: 'string', format: 'date-time' }
          }
        },
        Certificate: {
          type: 'object',
          properties: {
            id: { type: 'integer', example: 1 },
            user_id: { type: 'integer', example: 1 },
            course_id: { type: 'integer', example: 1 },
            certificate_url: { type: 'string', example: '/certificates/cert_123.pdf' },
            issued_at: { type: 'string', format: 'date-time' },
            created_at: { type: 'string', format: 'date-time' }
          }
        },
        Test: {
          type: 'object',
          properties: {
            id: { type: 'integer', example: 1 },
            lesson_id: { type: 'integer', nullable: true, example: 1 },
            title: { type: 'string', example: 'Тест по основам налогообложения' },
            description: { type: 'string', nullable: true, example: 'Проверьте свои знания' },
            time_limit: { type: 'integer', nullable: true, example: 30, description: 'Time limit in minutes' },
            passing_score: { type: 'integer', example: 70, description: 'Passing score percentage' },
            questions: { type: 'array', items: { $ref: '#/components/schemas/TestQuestion' } },
            created_at: { type: 'string', format: 'date-time' },
            updated_at: { type: 'string', format: 'date-time' }
          }
        },
        TestQuestion: {
          type: 'object',
          properties: {
            id: { type: 'integer', example: 1 },
            test_id: { type: 'integer', example: 1 },
            question_text: { type: 'string', example: 'Что такое НДС?' },
            question_type: { type: 'string', enum: ['multiple_choice', 'true_false', 'text'], example: 'multiple_choice' },
            options: { type: 'array', items: { type: 'string' }, example: ['Налог на добавленную стоимость', 'Налог на доходы', 'Налог на имущество'] },
            correct_answer: { type: 'string', example: 'Налог на добавленную стоимость' },
            points: { type: 'integer', example: 1 },
            question_order: { type: 'integer', example: 1 },
            created_at: { type: 'string', format: 'date-time' },
            updated_at: { type: 'string', format: 'date-time' }
          }
        },
        TestAttempt: {
          type: 'object',
          properties: {
            id: { type: 'integer', example: 1 },
            user_id: { type: 'integer', example: 1 },
            test_id: { type: 'integer', example: 1 },
            score: { type: 'integer', example: 8 },
            percentage: { type: 'number', example: 80.0 },
            passed: { type: 'boolean', example: true },
            answers: { type: 'object', description: 'Detailed answer data' },
            completed_at: { type: 'string', format: 'date-time' },
            created_at: { type: 'string', format: 'date-time' }
          }
        },
        Error: {
          type: 'object',
          properties: {
            message: { type: 'string', example: 'Error message' },
            status: { type: 'integer', example: 400 }
          }
        }
      }
    },
    security: [
      {
        bearerAuth: []
      }
    ]
  },
  apis: ['./src/routes/*.js', './src/index.js']
};

const specs = swaggerJsdoc(options);

module.exports = specs; 