# TaxBilim API Documentation

## Overview

This document provides comprehensive information about the TaxBilim Learning Management System API. The API is built with Node.js, Express, and PostgreSQL, providing endpoints for user authentication, course management, enrollments, progress tracking, lesson completion, module completion, and test functionality.

## Base URL

- **Development**: `http://localhost:5001`
- **Production**: `https://api.taxbilim.com`

## Authentication

The API uses JWT (JSON Web Tokens) for authentication. Most endpoints require a valid JWT token in the Authorization header.

### Getting a Token

1. **Register**: `POST /api/auth/register`
2. **Login**: `POST /api/auth/login`

### Using the Token

Include the token in the Authorization header:
```
Authorization: Bearer <your-jwt-token>
```

## Interactive Documentation

Access the interactive Swagger documentation at: `http://localhost:5001/api-docs`

## API Endpoints

### Authentication

#### Register User
```http
POST /api/auth/register
Content-Type: application/json

{
  "email": "user@taxbilim.com",
  "password": "password123",
  "name": "John Doe"
}
```

**Response:**
```json
{
  "message": "User registered successfully",
  "user": {
    "id": 1,
    "email": "user@taxbilim.com",
    "name": "John Doe",
    "role": "STUDENT",
    "avatar": null,
    "created_at": "2025-08-12T21:50:26.161Z"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

#### Login User
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "user@taxbilim.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "message": "Login successful",
  "user": {
    "id": 1,
    "email": "user@taxbilim.com",
    "name": "John Doe",
    "role": "STUDENT",
    "avatar": null,
    "created_at": "2025-08-12T21:50:26.161Z"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

#### Get Current User
```http
GET /api/auth/me
Authorization: Bearer <token>
```

### Courses

#### Get All Courses
```http
GET /api/courses
```

**Query Parameters:**
- `limit` (optional): Number of courses to return (default: 10)
- `page` (optional): Page number (default: 1)
- `search` (optional): Search term for course title/description
- `category` (optional): Filter by category ID

**Response:**
```json
{
  "courses": [
    {
      "id": 1,
      "title": "Основы налогообложения",
      "description": "Комплексный курс по основам налогообложения...",
      "image_src": "/coursePlaceholder.png",
      "price": "25990.00",
      "bg": "white",
      "is_published": true,
      "is_sales_leader": true,
      "is_recorded": true,
      "features": ["5 Модулей", "78 видеоуроков", "7 статей"],
      "what_you_learn": ["Понимание основных принципов налогообложения"],
      "author_name": "Лана Б.",
      "author_avatar": "/avatars.png",
      "enrollment_count": "1",
      "review_count": "1",
      "is_favorite": false
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 18,
    "pages": 2
  }
}
```

#### Get Course by ID
```http
GET /api/courses/:id
```

**Response:**
```json
{
  "course": {
    "id": 1,
    "title": "Основы налогообложения",
    "description": "Комплексный курс по основам налогообложения...",
    "image_src": "/coursePlaceholder.png",
    "price": "25990.00",
    "bg": "white",
    "is_published": true,
    "features": ["5 Модулей", "78 видеоуроков", "7 статей"],
    "what_you_learn": ["Понимание основных принципов налогообложения"],
    "author_name": "Лана Б.",
    "author_avatar": "/avatars.png",
    "author_bio": "Expert tax consultant with 10+ years of experience",
    "enrollment_count": "1",
    "review_count": "1",
    "modules": [
      {
        "id": 1,
        "title": "Модуль 1: Введение в налогообложение",
        "order": 1,
        "lessons": [
          {
            "id": 1,
            "title": "Урок 1: Что такое налоги",
            "duration": 15,
            "order": 1
          }
        ]
      }
    ],
    "reviews": {
      "statistics": {
        "total": 1,
        "average": 5.0,
        "distribution": {
          "five_star": 1,
          "four_star": 0,
          "three_star": 0,
          "two_star": 0,
          "one_star": 0
        }
      },
      "recent_reviews": [
        {
          "id": 1,
          "user_id": 3,
          "course_id": 1,
          "rating": 5,
          "comment": "Отличный курс! Очень понятно объясняют сложные темы.",
          "created_at": "2025-08-12T21:51:54.758Z",
          "user_name": "Student User",
          "user_avatar": null
        }
      ]
    }
  }
}
```

#### Create Course (TEACHER/ADMIN only)
```http
POST /api/courses
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "New Course",
  "description": "Course description",
  "price": 29990.00,
  "features": ["Feature 1", "Feature 2"],
  "what_you_learn": ["Learning 1", "Learning 2"]
}
```

### Lessons

#### Get Lesson by ID (with completion status)
```http
GET /api/lessons/:id
Authorization: Bearer <token>
```

**Response:**
```json
{
  "lesson": {
    "id": 1,
    "title": "Урок 1: Что такое налоги",
    "content": "В этом уроке мы изучим основные понятия налогообложения...",
    "video_url": "https://example.com/video.mp4",
    "order": 1,
    "module_id": 1,
    "duration": 15,
    "module_title": "Модуль 1: Введение в налогообложение",
    "course_title": "Основы налогообложения",
    "course_id": 1,
    "completed": false,
    "completed_at": null
  }
}
```

#### Mark Lesson as Completed
```http
POST /api/lessons/:id/complete
Authorization: Bearer <token>
```

**Response:**
```json
{
  "message": "Lesson completed successfully.",
  "lesson_id": 1,
  "completed": true,
  "completed_at": "2025-08-18T16:45:00.000Z"
}
```

#### Mark Module as Completed
```http
POST /api/lessons/module/:moduleId/complete
Authorization: Bearer <token>
```

**Note:** This endpoint checks if all lessons in the module are completed before allowing module completion.

**Response (Success):**
```json
{
  "message": "Module completed successfully!",
  "module_id": 1,
  "completed_lessons": 3,
  "completed_at": "2025-08-18T16:45:00.000Z"
}
```

**Response (Failure - incomplete lessons):**
```json
{
  "message": "Cannot complete module. Some lessons are not finished.",
  "incomplete_lessons": [
    {
      "lesson_id": 2,
      "lesson_title": "Урок 2: Функции налогов",
      "completed": false
    }
  ]
}
```

#### Get Lessons for Module
```http
GET /api/lessons/module/:moduleId
Authorization: Bearer <token>
```

### Tests

#### Get Test Questions for Lesson
```http
GET /api/tests/lesson/:lessonId
Authorization: Bearer <token>
```

**Response:**
```json
{
  "test": {
    "test_id": 1,
    "test_title": "Тест по основам налогообложения",
    "description": "Проверьте свои знания по основам налогообложения",
    "time_limit": 30,
    "passing_score": 70,
    "questions": [
      {
        "question_id": 1,
        "question_text": "Что такое налог?",
        "question_type": "multiple_choice",
        "options": [
          "A) Добровольный взнос",
          "Б) Обязательный платеж",
          "В) Подарок государству",
          "Г) Благотворительность"
        ],
        "points": 2
      }
    ],
    "previous_attempt": {
      "attempt_id": 1,
      "score": 8,
      "percentage": 66.67,
      "passed": false,
      "completed_at": "2025-08-18T16:30:00.000Z"
    }
  }
}
```

#### Submit Test Answers
```http
POST /api/tests/lesson/:lessonId/submit
Authorization: Bearer <token>
Content-Type: application/json

{
  "answers": [
    {
      "question_id": 1,
      "selected_answer": "Б) Обязательный платеж"
    },
    {
      "question_id": 2,
      "selected_answer": "Б) Фискальная"
    }
  ]
}
```

**Response (Passed):**
```json
{
  "message": "Test passed!",
  "attempt_id": 2,
  "score": 10,
  "total_possible": 12,
  "percentage": 83.33,
  "passed": true,
  "answers": [
    {
      "question_id": 1,
      "selected_answer": "Б) Обязательный платеж",
      "correct_answer": "Б) Обязательный платеж",
      "is_correct": true,
      "points": 2
    },
    {
      "question_id": 2,
      "selected_answer": "Б) Фискальная",
      "correct_answer": "Б) Фискальная",
      "is_correct": true,
      "points": 2
    }
  ]
}
```

**Response (Failed):**
```json
{
  "message": "Test failed. Try again.",
  "attempt_id": 2,
  "score": 6,
  "total_possible": 12,
  "percentage": 50.00,
  "passed": false,
  "answers": [...]
}
```

#### Get Test Results
```http
GET /api/tests/results/:testId
Authorization: Bearer <token>
```

**Response:**
```json
{
  "attempts": [
    {
      "attempt_id": 1,
      "score": 8,
      "percentage": 66.67,
      "passed": false,
      "completed_at": "2025-08-18T16:30:00.000Z",
      "test_title": "Тест по основам налогообложения",
      "passing_score": 70
    }
  ],
  "total_attempts": 1
}
```

#### Create Test (TEACHER/ADMIN only)
```http
POST /api/tests
Authorization: Bearer <token>
Content-Type: application/json

{
  "lessonId": 3,
  "title": "Test Title",
  "description": "Test description",
  "timeLimit": 30,
  "passingScore": 70,
  "questions": [
    {
      "question_text": "What is a tax?",
      "question_type": "multiple_choice",
      "options": ["Option A", "Option B", "Option C", "Option D"],
      "correct_answer": "Option B",
      "points": 2
    }
  ]
}
```

### Enrollments

#### Enroll in Course
```http
POST /api/enrollments
Authorization: Bearer <token>
Content-Type: application/json

{
  "courseId": 1
}
```

#### Get User Enrollments
```http
GET /api/enrollments/my-enrollments
Authorization: Bearer <token>
```

**Response:**
```json
{
  "enrollments": [
    {
      "id": 1,
      "user_id": 1,
      "course_id": 1,
      "enrolled_at": "2025-08-12T22:00:00.000Z",
      "completed_at": null,
      "course_title": "Основы налогообложения",
      "course_description": "Комплексный курс по основам налогообложения...",
      "course_image_src": "/coursePlaceholder.png",
      "author_name": "Лана Б.",
      "progress_percentage": 33
    }
  ]
}
```

### Progress

#### Update Lesson Progress
```http
POST /api/progress
Authorization: Bearer <token>
Content-Type: application/json

{
  "lessonId": 1,
  "completed": true
}
```

#### Get User Progress
```http
GET /api/progress
Authorization: Bearer <token>
```

#### Get Course Progress
```http
GET /api/progress/course/:courseId
Authorization: Bearer <token>
```

### Reviews

#### Check if User Can Leave Review
```http
GET /api/reviews/can-review/:courseId
Authorization: Bearer <token>
```

**Response:**
```json
{
  "canReview": true,
  "hasExistingReview": false,
  "progressPercentage": 85,
  "completedLessons": 17,
  "totalLessons": 20,
  "message": "You can leave a review"
}
```

**Note:** User can only leave a review after completing at least 80% of the course.

#### Create Review
```http
POST /api/reviews
Authorization: Bearer <token>
Content-Type: application/json

{
  "courseId": 1,
  "rating": 5,
  "comment": "Excellent course!"
}
```

**Response:**
```json
{
  "review": {
    "id": 1,
    "user_id": 1,
    "course_id": 1,
    "rating": 5,
    "comment": "Excellent course!",
    "created_at": "2025-08-18T16:45:00.000Z"
  },
  "message": "Review submitted successfully!"
}
```

#### Get Course Reviews
```http
GET /api/reviews/course/:courseId
```

**Response:**
```json
{
  "reviews": [
    {
      "id": 1,
      "user_id": 1,
      "course_id": 1,
      "rating": 5,
      "comment": "Excellent course!",
      "created_at": "2025-08-18T16:45:00.000Z",
      "user_name": "John Doe",
      "user_avatar": "/avatars.png"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 1,
    "pages": 1
  }
}
```

#### Get User's Review for Course
```http
GET /api/reviews/my-review/:courseId
Authorization: Bearer <token>
```

#### Get User Reviews
```http
GET /api/reviews/user
Authorization: Bearer <token>
```

### Favorites

#### Add to Favorites
```http
POST /api/favorites
Authorization: Bearer <token>
Content-Type: application/json

{
  "courseId": 1
}
```

#### Get User Favorites
```http
GET /api/favorites
Authorization: Bearer <token>
```

#### Remove from Favorites
```http
DELETE /api/favorites/:courseId
Authorization: Bearer <token>
```

### Certificates

#### Get User Certificates
```http
GET /api/certificates/my-certificates
Authorization: Bearer <token>
```

**Response:**
```json
{
  "certificates": [
    {
      "id": 1,
      "user_id": 1,
      "course_id": 1,
      "issued_at": "2025-08-12T22:00:00.000Z",
      "certificate_url": "/certificates/cert_1.pdf",
      "course_title": "Основы налогообложения",
      "course_image_src": "/coursePlaceholder.png"
    }
  ]
}
```

#### Generate Certificate
```http
POST /api/certificates
Authorization: Bearer <token>
Content-Type: application/json

{
  "courseId": 1
}
```

### Categories

#### Get All Categories
```http
GET /api/categories
```

**Response:**
```json
{
  "categories": [
    {
      "id": 1,
      "name": "Налогообложение",
      "description": "Курсы по налогообложению",
      "course_count": 5
    }
  ]
}
```

## Data Models

### User
```json
{
  "id": 1,
  "email": "user@taxbilim.com",
  "name": "John Doe",
  "role": "STUDENT",
  "avatar": "/avatars.png",
  "created_at": "2025-08-12T21:50:26.161Z"
}
```

### Course
```json
{
  "id": 1,
  "title": "Course Title",
  "description": "Course description",
  "image_src": "/coursePlaceholder.png",
  "price": "25990.00",
  "bg": "white",
  "is_published": true,
  "is_sales_leader": true,
  "is_recorded": true,
  "features": ["Feature 1", "Feature 2"],
  "what_you_learn": ["Learning 1", "Learning 2"],
  "author_id": 1,
  "author_name": "Author Name",
  "author_avatar": "/avatars.png",
  "enrollment_count": "150",
  "review_count": "25",
  "average_rating": 4.8,
  "created_at": "2025-08-12T21:50:26.161Z",
  "reviews": {
    "statistics": {
      "total": 25,
      "average": 4.8,
      "distribution": {
        "five_star": 15,
        "four_star": 8,
        "three_star": 1,
        "two_star": 1,
        "one_star": 0
      }
    },
    "recent_reviews": [
      {
        "id": 1,
        "user_id": 1,
        "course_id": 1,
        "rating": 5,
        "comment": "Excellent course!",
        "created_at": "2025-08-12T21:50:26.161Z",
        "user_name": "John Doe",
        "user_avatar": "/avatars.png"
      }
    ]
  }
}
```

### Lesson
```json
{
  "id": 1,
  "title": "Lesson Title",
  "content": "Lesson content",
  "video_url": "https://example.com/video.mp4",
  "order": 1,
  "module_id": 1,
  "duration": 15,
  "completed": false,
  "completed_at": null
}
```

### Test
```json
{
  "id": 1,
  "lesson_id": 3,
  "title": "Test Title",
  "description": "Test description",
  "time_limit": 30,
  "passing_score": 70,
  "questions": [
    {
      "question_id": 1,
      "question_text": "Question text",
      "question_type": "multiple_choice",
      "options": ["Option A", "Option B", "Option C", "Option D"],
      "points": 2
    }
  ]
}
```

## Error Responses

### Authentication Error
```json
{
  "message": "Access denied. No token provided."
}
```

### Validation Error
```json
{
  "errors": [
    {
      "type": "field",
      "value": "",
      "msg": "Email is required",
      "path": "email",
      "location": "body"
    }
  ]
}
```

### Not Found Error
```json
{
  "message": "Course not found."
}
```

### Server Error
```json
{
  "message": "Server error."
}
```

## Testing

### Test Credentials

The system comes with pre-created test users:

- **Admin**: `admin@taxbilim.com` / `admin123`
- **Teacher**: `teacher@taxbilim.com` / `teacher123`
- **Student**: `student@taxbilim.com` / `student123`

### Sample Data

The system automatically creates:
- 2 courses with modules and lessons
- 1 test with 5 questions for lesson 3
- Sample enrollments, reviews, and favorites
- Test user accounts

## Rate Limiting

The API implements rate limiting:
- **Limit**: 100 requests per 15 minutes per IP
- **Headers**: Rate limit information is included in response headers

## CORS

The API supports CORS for frontend integration:
- **Origin**: `http://localhost:3000` (development)
- **Credentials**: Enabled

## Health Check

```http
GET /health
```

**Response:**
```json
{
  "status": "OK",
  "timestamp": "2025-08-18T16:45:00.000Z",
  "uptime": 3600
}
```

## Getting Started

1. **Start the backend**: `docker compose up -d`
2. **Get authentication token**: Use login/register endpoints
3. **Explore courses**: Use `/api/courses` endpoint
4. **Enroll in a course**: Use `/api/enrollments` endpoint
5. **Access lessons**: Use `/api/lessons/:id` endpoint
6. **Complete lessons**: Use `/api/lessons/:id/complete` endpoint
7. **Take tests**: Use `/api/tests/lesson/:lessonId` endpoint

## Support

For additional support or questions, please refer to the project documentation or contact the development team. 