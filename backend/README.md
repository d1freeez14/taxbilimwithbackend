# TaxBilim Backend API

A comprehensive Learning Management System (LMS) backend API for tax education platform built with Node.js, Express, PostgreSQL, and Prisma.

## 🚀 Features

- **User Authentication & Authorization** - JWT-based auth with role-based access control
- **Course Management** - CRUD operations for courses, modules, and lessons
- **User Enrollment** - Course enrollment and progress tracking
- **Progress Tracking** - Lesson completion and course progress
- **Reviews & Ratings** - Course reviews and ratings system
- **Favorites** - Course favorites management
- **Certificates** - Certificate generation for completed courses
- **Database** - PostgreSQL with Prisma ORM
- **Docker Support** - Complete containerization with Docker Compose

## 🛠 Tech Stack

- **Runtime**: Node.js 18
- **Framework**: Express.js
- **Database**: PostgreSQL 15
- **ORM**: Prisma
- **Authentication**: JWT
- **Validation**: Express Validator
- **Security**: Helmet, CORS, Rate Limiting
- **Containerization**: Docker & Docker Compose
- **Caching**: Redis (optional)

## 📋 Prerequisites

- Docker and Docker Compose
- Node.js 18+ (for local development)
- PostgreSQL (for local development)

## 🚀 Quick Start with Docker

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd backend
   ```

2. **Set up environment variables**
   ```bash
   cp env.example .env
   # Edit .env with your configuration
   ```

3. **Start the services**
   ```bash
   docker-compose up -d
   ```

4. **Access the API**
   - API: http://localhost:5000
   - Health Check: http://localhost:5000/health
   - Database: localhost:5432

## 🔧 Local Development

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Set up environment variables**
   ```bash
   cp env.example .env
   # Edit .env with your local configuration
   ```

3. **Set up database**
   ```bash
   # Start PostgreSQL (using Docker)
   docker run --name postgres -e POSTGRES_PASSWORD=password -e POSTGRES_DB=taxbilim_db -p 5432:5432 -d postgres:15-alpine
   
   # Run migrations
   npx prisma migrate dev
   
   # Generate Prisma client
   npx prisma generate
   ```

4. **Seed the database**
   ```bash
   npm run seed
   ```

5. **Start development server**
   ```bash
   npm run dev
   ```

## 📚 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user

### Courses
- `GET /api/courses` - Get all published courses
- `GET /api/courses/:id` - Get course by ID
- `POST /api/courses` - Create course (TEACHER/ADMIN)
- `PUT /api/courses/:id` - Update course (TEACHER/ADMIN)
- `DELETE /api/courses/:id` - Delete course (ADMIN)
- `PATCH /api/courses/:id/publish` - Publish/unpublish course

### Enrollments
- `GET /api/enrollments/my` - Get user enrollments
- `POST /api/enrollments` - Enroll in course
- `PATCH /api/enrollments/:courseId/complete` - Complete course
- `DELETE /api/enrollments/:courseId` - Unenroll from course

### Progress
- `GET /api/progress/course/:courseId` - Get course progress
- `POST /api/progress/lesson/:lessonId/complete` - Mark lesson complete
- `POST /api/progress/lesson/:lessonId/incomplete` - Mark lesson incomplete
- `GET /api/progress/overview` - Get overall progress

### Reviews
- `GET /api/reviews/course/:courseId` - Get course reviews
- `GET /api/reviews/my` - Get user reviews
- `POST /api/reviews` - Create review
- `PUT /api/reviews/:courseId` - Update review
- `DELETE /api/reviews/:courseId` - Delete review

### Favorites
- `GET /api/favorites/my` - Get user favorites
- `POST /api/favorites` - Add to favorites
- `DELETE /api/favorites/:courseId` - Remove from favorites
- `GET /api/favorites/check/:courseId` - Check if favorited

### Certificates
- `GET /api/certificates/my` - Get user certificates
- `GET /api/certificates/:id` - Get certificate by ID
- `POST /api/certificates/generate/:courseId` - Generate certificate

### User Management
- `GET /api/users/profile` - Get user profile
- `PUT /api/users/profile` - Update profile
- `PUT /api/users/change-password` - Change password
- `GET /api/users/stats` - Get user statistics

## 👥 User Roles

- **STUDENT** - Can enroll in courses, track progress, leave reviews
- **TEACHER** - Can create and manage courses, modules, lessons
- **ADMIN** - Full access to all features

## 🔐 Default Users (from seed)

- **Admin**: admin@taxbilim.com / admin123
- **Teacher**: teacher@taxbilim.com / teacher123
- **Student**: student@taxbilim.com / student123

## 🗄 Database Schema

The database includes the following main entities:
- Users (with roles)
- Authors
- Courses (with features and learning outcomes)
- Modules
- Lessons
- Enrollments
- Lesson Progress
- Certificates
- Reviews
- Course Favorites

## 🐳 Docker Commands

```bash
# Start all services
docker-compose up -d

# View logs
docker-compose logs -f backend

# Stop all services
docker-compose down

# Rebuild and start
docker-compose up --build -d

# Access database
docker exec -it taxbilim_postgres psql -U postgres -d taxbilim_db

# Run migrations
docker exec -it taxbilim_backend npx prisma migrate deploy

# Seed database
docker exec -it taxbilim_backend npm run seed
```

## 🔧 Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `DATABASE_URL` | PostgreSQL connection string | - |
| `JWT_SECRET` | JWT signing secret | - |
| `PORT` | Server port | 5000 |
| `NODE_ENV` | Environment | development |
| `FRONTEND_URL` | Frontend URL for CORS | http://localhost:3000 |

## 📝 API Documentation

The API follows RESTful conventions and returns JSON responses. All endpoints that require authentication expect a Bearer token in the Authorization header:

```
Authorization: Bearer <jwt-token>
```

## 🧪 Testing

```bash
# Run tests
npm test

# Run tests with coverage
npm run test:coverage
```

## 📦 Production Deployment

1. Set `NODE_ENV=production`
2. Use a strong `JWT_SECRET`
3. Configure proper database credentials
4. Set up SSL/TLS
5. Configure proper CORS origins
6. Set up monitoring and logging

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License. 