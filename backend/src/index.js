require('express-async-errors');
require('dotenv').config();

const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const compression = require('compression');
const rateLimit = require('express-rate-limit');
const { pool } = require('./lib/db');

const authRoutes = require('./routes/auth');
const courseRoutes = require('./routes/courses');
const moduleRoutes = require('./routes/modules');
const lessonRoutes = require('./routes/lessons');
const userRoutes = require('./routes/users');
const enrollmentRoutes = require('./routes/enrollments');
const certificateRoutes = require('./routes/certificates');
const reviewRoutes = require('./routes/reviews');
const favoriteRoutes = require('./routes/favorites');
const categoryRoutes = require('./routes/categories');
const progressRoutes = require('./routes/progress');
const testRoutes = require('./routes/tests');

const errorHandler = require('./middleware/errorHandler');
const authMiddleware = require('./middleware/auth');

const app = express();

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.'
});

// Middleware
app.use(helmet());
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true
}));
app.use(compression());
app.use(morgan('combined'));
app.use(limiter);
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Health check
app.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

// API Documentation
app.get('/api-docs', (req, res) => {
  res.json({
    message: 'TaxBilim API Documentation',
    version: '1.0.0',
    baseUrl: 'http://localhost:5001',
    endpoints: {
      authentication: {
        'POST /api/auth/register': 'Register a new user',
        'POST /api/auth/login': 'Login user',
        'GET /api/auth/me': 'Get current user profile'
      },
      courses: {
        'GET /api/courses': 'Get all published courses',
        'GET /api/courses/:id': 'Get course by ID',
        'POST /api/courses': 'Create course (TEACHER/ADMIN only)',
        'PUT /api/courses/:id': 'Update course (TEACHER/ADMIN only)',
        'DELETE /api/courses/:id': 'Delete course (ADMIN only)'
      },
      enrollments: {
        'POST /api/enrollments': 'Enroll in course',
        'GET /api/enrollments': 'Get user enrollments',
        'GET /api/enrollments/course/:id': 'Get course enrollments (ADMIN/TEACHER)',
        'DELETE /api/enrollments/:id': 'Cancel enrollment'
      },
      progress: {
        'POST /api/progress': 'Update lesson progress',
        'GET /api/progress': 'Get user progress',
        'GET /api/progress/course/:id': 'Get course progress'
      },
      reviews: {
        'POST /api/reviews': 'Create review',
        'GET /api/reviews/course/:id': 'Get course reviews',
        'GET /api/reviews/user': 'Get user reviews',
        'PUT /api/reviews/:id': 'Update review',
        'DELETE /api/reviews/:id': 'Delete review'
      },
      favorites: {
        'POST /api/favorites': 'Add to favorites',
        'GET /api/favorites': 'Get user favorites',
        'DELETE /api/favorites/:id': 'Remove from favorites'
      },
      certificates: {
        'GET /api/certificates': 'Get user certificates',
        'POST /api/certificates': 'Generate certificate'
      },
      modules: {
        'GET /api/modules': 'Get all modules',
        'GET /api/modules/:id': 'Get module by ID',
        'POST /api/modules': 'Create module (TEACHER/ADMIN)',
        'PUT /api/modules/:id': 'Update module (TEACHER/ADMIN)',
        'DELETE /api/modules/:id': 'Delete module (ADMIN)'
      },
      lessons: {
        'GET /api/lessons': 'Get all lessons',
        'GET /api/lessons/:id': 'Get lesson by ID',
        'POST /api/lessons': 'Create lesson (TEACHER/ADMIN)',
        'PUT /api/lessons/:id': 'Update lesson (TEACHER/ADMIN)',
        'DELETE /api/lessons/:id': 'Delete lesson (ADMIN)'
      }
    },
    authentication: {
      type: 'Bearer Token (JWT)',
      header: 'Authorization: Bearer <your-jwt-token>',
      note: 'Get token from /api/auth/login or /api/auth/register'
    },
    testCredentials: {
      admin: 'admin@taxbilim.com / admin123',
      teacher: 'teacher@taxbilim.com / teacher123',
      student: 'student@taxbilim.com / student123'
    },
    documentation: 'See API_DOCUMENTATION.md for detailed documentation'
  });
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/courses', courseRoutes);
app.use('/api/modules', authMiddleware.auth, moduleRoutes);
app.use('/api/lessons', authMiddleware.auth, lessonRoutes);
app.use('/api/users', authMiddleware.auth, userRoutes);
app.use('/api/enrollments', authMiddleware.auth, enrollmentRoutes);
app.use('/api/certificates', authMiddleware.auth, certificateRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/favorites', authMiddleware.auth, favoriteRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/progress', authMiddleware.auth, progressRoutes);
app.use('/api/tests', authMiddleware.auth, testRoutes);

// Error handling
app.use(errorHandler);

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

const PORT = process.env.PORT || 5000;

const { initDatabase } = require('./scripts/init-db');

const start = async () => {
  try {
    // Test database connection
    await pool.query('SELECT NOW()');
    console.log('Database connected successfully');
    
    // Initialize database tables
    await initDatabase();
    
    // Seed database with initial data
    console.log('🌱 Seeding database...');
    try {
      require('./scripts/seed');
      console.log('✅ Database seeded successfully');
    } catch (seedError) {
      console.log('⚠️ Database seeding failed (this is normal if data already exists):', seedError.message);
    }
    
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

start();

// Graceful shutdown
process.on('SIGTERM', async () => {
  console.log('SIGTERM received, shutting down gracefully');
  await pool.end();
  process.exit(0);
});

process.on('SIGINT', async () => {
  console.log('SIGINT received, shutting down gracefully');
  await pool.end();
  process.exit(0);
}); 