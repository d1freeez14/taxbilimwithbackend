# TaxBilim LMS API Documentation

## Overview
TaxBilim LMS - это система управления обучением для налогового консультирования с полным набором API для учителей, студентов и администраторов.

## Base URL
- Development: `http://localhost:5001/api`
- Production: `http://89.219.32.91:5001/api`

## Authentication
Все защищенные эндпоинты требуют JWT токен в заголовке:
```
Authorization: Bearer <your-jwt-token>
```

## User Roles
- `ADMIN` - Администратор системы
- `TEACHER` - Учитель/Преподаватель
- `STUDENT` - Студент

---

## 🔐 Authentication API

### POST /api/auth/register
Регистрация нового пользователя

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "role": "STUDENT"
}
```

**Response:**
```json
{
  "message": "User registered successfully",
  "user": {
    "id": 1,
    "name": "John Doe",
    "email": "john@example.com",
    "role": "STUDENT"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

### POST /api/auth/login
Вход в систему

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

---

## 📚 Courses API

### GET /api/courses
Получить список всех опубликованных курсов

**Query Parameters:**
- `page` (optional): Номер страницы (default: 1)
- `limit` (optional): Количество курсов на странице (default: 10)
- `search` (optional): Поиск по названию или описанию
- `category` (optional): Фильтр по категории

### POST /api/courses
Создание нового курса (TEACHER/ADMIN only)

**Request Body:**
```json
{
  "title": "Основы налогообложения",
  "description": "Комплексный курс по основам налогообложения",
  "price": 25000,
  "features": ["Практические примеры", "Актуальное законодательство"],
  "whatYouLearn": ["Виды налогов", "Налоговые льготы"],
  "category_id": 1,
  "access_duration": "lifetime",
  "video_url": "https://youtube.com/watch?v=example"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Course created successfully",
  "course": {
    "id": 1,
    "title": "Основы налогообложения",
    "description": "Комплексный курс по основам налогообложения",
    "price": 25000,
    "author_id": 2,
    "category_id": 1,
    "access_duration": "lifetime",
    "video_url": "https://youtube.com/watch?v=example",
    "is_published": false,
    "author": {
      "id": 2,
      "name": "Teacher User",
      "avatar": null
    }
  }
}
```

### GET /api/courses/:id
Получить детальную информацию о курсе

---

## 👨‍🏫 Teacher Dashboard API

### GET /api/teacher/stats/dashboard-stats
Получить общую статистику учителя

**Response:**
```json
{
  "success": true,
  "stats": {
    "total_courses": 5,
    "published_courses": 3,
    "draft_courses": 2,
    "total_enrollments": 150,
    "completed_enrollments": 45,
    "active_enrollments": 105,
    "total_revenue": 15000.00,
    "average_rating": 4.5,
    "total_reviews": 30
  },
  "monthly_stats": [
    {
      "month": "2024-10-01T00:00:00.000Z",
      "enrollments": 25,
      "revenue": 2500.00
    }
  ],
  "top_courses": [
    {
      "id": 1,
      "title": "Course Title",
      "price": 500.00,
      "enrollments": 50,
      "revenue": 25000.00,
      "rating": 4.8,
      "reviews_count": 15
    }
  ]
}
```

### GET /api/teacher/stats/dashboard-stats/filtered
Получить статистику с фильтрами

**Query Parameters:**
- `start_date` (optional): ISO date string
- `end_date` (optional): ISO date string  
- `course_id` (optional): Course ID
- `category_id` (optional): Category ID

---

## 👥 Students Management API

### GET /api/teacher/students/students
Получить список всех учеников с фильтрами

**Query Parameters:**
- `course_id` (optional): Filter by course
- `search` (optional): Search by name or email
- `status` (optional): 'completed' or 'active'
- `enrollment_date_from` (optional): ISO date string
- `enrollment_date_to` (optional): ISO date string
- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 20)

**Response:**
```json
{
  "success": true,
  "students": [
    {
      "id": 1,
      "name": "Student Name",
      "email": "student@example.com",
      "avatar": "avatar_url",
      "user_created_at": "2024-01-01T00:00:00.000Z",
      "total_enrollments": 3,
      "completed_courses": 1,
      "last_enrollment_date": "2024-10-01T00:00:00.000Z",
      "total_spent": 1500.00,
      "average_rating": 4.5,
      "courses": [
        {
          "id": 1,
          "title": "Course Title",
          "price": 500.00,
          "enrolled_at": "2024-10-01T00:00:00.000Z",
          "completed_at": null,
          "status": "active"
        }
      ]
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 100,
    "pages": 5
  }
}
```

### GET /api/teacher/students/students/:studentId
Получить детальную информацию о студенте

---

## 📖 Teacher Courses API

### GET /api/teacher/courses/my-courses
Получить курсы учителя с полной информацией

**Query Parameters:**
- `status` (optional): 'published' or 'draft'
- `search` (optional): Search by title or description
- `category_id` (optional): Filter by category
- `page` (optional): Page number
- `limit` (optional): Items per page

**Response:**
```json
{
  "success": true,
  "courses": [
    {
      "id": 1,
      "title": "Course Title",
      "description": "Course description",
      "price": 500.00,
      "image_src": "image_url",
      "is_published": true,
      "enrollment_count": 50,
      "completed_enrollments": 15,
      "review_count": 10,
      "average_rating": 4.5,
      "total_revenue": 25000.00,
      "module_count": 5,
      "lesson_count": 20,
      "total_duration": 1200,
      "completion_rate": 30
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 10,
    "pages": 1
  }
}
```

### GET /api/teacher/courses/my-courses/:courseId/stats
Получить детальную статистику по курсу

---

## 💰 Sales & Purchases API

### POST /api/sales/purchase
Покупка курса (для студентов)

**Request Body:**
```json
{
  "course_id": 1,
  "payment_method": "card",
  "card_number": "1234567890123456",
  "card_holder": "John Doe",
  "expiry_date": "12/25",
  "cvv": "123"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Course purchased successfully",
  "purchase": {
    "id": 1,
    "amount": 500.00,
    "payment_method": "card",
    "payment_status": "completed",
    "created_at": "2024-10-29T00:00:00.000Z"
  },
  "enrollment": {
    "id": 1,
    "enrolled_at": "2024-10-29T00:00:00.000Z"
  },
  "course": {
    "id": 1,
    "title": "Course Title",
    "description": "Course description",
    "author_name": "Teacher Name",
    "author_avatar": "avatar_url"
  }
}
```

### GET /api/sales/my-purchases
Получить историю покупок студента

**Query Parameters:**
- `page` (optional): Page number
- `limit` (optional): Items per page

---

## 📝 Modules API

### GET /api/modules/course/:courseId
Получить модули курса

### POST /api/modules/:id/complete
Отметить модуль как завершенный

### POST /api/modules/:id/incomplete
Отметить модуль как незавершенный

### GET /api/modules/:id/tests
Проверить есть ли тесты в модуле

### GET /api/modules/:id/tests/summary
Получить сводку по тестам модуля

---

## 📚 Lessons API

### GET /api/lessons/:id
Получить информацию об уроке

### POST /api/lessons/:id/complete
Отметить урок как завершенный

---

## 🧪 Tests API

### GET /api/tests/:id
Получить тест по ID

### POST /api/tests/:id/submit
Отправить ответы на тест

### GET /api/tests/:id/attempts/detailed
Получить детальную информацию о попытках прохождения теста

---

## 📜 Certificates API

### GET /api/certificates/verify/:code
Публичная проверка сертификата (без авторизации)

### GET /api/certificates
Получить сертификаты пользователя

### POST /api/certificates/generate
Сгенерировать сертификат

---

## ⭐ Favorites API

### GET /api/favorites
Получить избранные курсы

### POST /api/favorites/:courseId
Добавить курс в избранное

### DELETE /api/favorites/:courseId
Удалить курс из избранного

---

## 📊 Progress API

### GET /api/progress/course/:courseId
Получить прогресс по курсу

### POST /api/progress/lesson/:lessonId
Обновить прогресс урока

---

## 🏷️ Categories API

### GET /api/categories
Получить список категорий

### POST /api/categories
Создать новую категорию (ADMIN only)

---

## 📝 Reviews API

### GET /api/reviews/course/:courseId
Получить отзывы по курсу

### POST /api/reviews
Создать отзыв

---

## 👤 Users API

### GET /api/users/profile
Получить профиль пользователя

### PUT /api/users/profile
Обновить профиль пользователя

---

## 📋 Enrollments API

### GET /api/enrollments
Получить записи пользователя на курсы

### POST /api/enrollments/:courseId
Записаться на курс

---

## Error Responses

### 400 Bad Request
```json
{
  "message": "Validation error",
  "errors": [
    {
      "type": "field",
      "msg": "Invalid value",
      "path": "email",
      "location": "body"
    }
  ]
}
```

### 401 Unauthorized
```json
{
  "message": "Authentication required."
}
```

### 403 Forbidden
```json
{
  "message": "Access denied. Teacher role required."
}
```

### 404 Not Found
```json
{
  "message": "Course not found."
}
```

### 500 Internal Server Error
```json
{
  "message": "Server error."
}
```

---

## Database Schema

### Courses Table
- `id` (SERIAL PRIMARY KEY)
- `title` (VARCHAR) - Название курса
- `description` (TEXT) - Описание курса
- `price` (DECIMAL) - Цена курса
- `author_id` (INTEGER) - ID автора
- `category_id` (INTEGER) - ID категории
- `access_duration` (VARCHAR) - Длительность доступа
- `video_url` (TEXT) - Ссылка на видео
- `is_published` (BOOLEAN) - Опубликован ли курс
- `features` (TEXT[]) - Массив функций
- `what_you_learn` (TEXT[]) - Массив того, что изучит студент

### Purchases Table
- `id` (SERIAL PRIMARY KEY)
- `user_id` (INTEGER) - ID пользователя
- `course_id` (INTEGER) - ID курса
- `amount` (DECIMAL) - Сумма покупки
- `payment_method` (VARCHAR) - Способ оплаты
- `payment_status` (VARCHAR) - Статус платежа
- `card_number_masked` (VARCHAR) - Замаскированный номер карты
- `card_holder` (VARCHAR) - Владелец карты
- `expiry_date` (VARCHAR) - Дата истечения карты
- `transaction_id` (VARCHAR) - ID транзакции
- `created_at` (TIMESTAMP) - Дата создания

---

## Test Credentials

### Admin
- Email: `admin@taxbilim.com`
- Password: `admin123`

### Teacher
- Email: `teacher@taxbilim.com`
- Password: `teacher123`

### Student
- Email: `student@taxbilim.com`
- Password: `student123`

---

## Rate Limiting
- 100 requests per 15 minutes per IP
- 1000 requests per hour per authenticated user

## CORS
- Allowed origins: `http://localhost:3001`, `http://89.219.32.91:3001`
- Credentials: enabled