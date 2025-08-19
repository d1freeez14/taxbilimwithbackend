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
            completed_at: { type: 'string', format: 'date-time', nullable: true }
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