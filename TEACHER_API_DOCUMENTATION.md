# Teacher API Endpoints

## Dashboard Statistics

### GET /api/teacher/stats/dashboard-stats
Получить общую статистику учителя

**Headers:**
```
Authorization: Bearer <token>
```

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

## Students Management

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

## Teacher Courses

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

## Sales & Purchases

### GET /api/sales/sales
Получить статистику продаж для учителя

**Query Parameters:**
- `start_date` (optional): ISO date string
- `end_date` (optional): ISO date string
- `course_id` (optional): Filter by course
- `period` (optional): 'day', 'week', 'month', 'year' (default: 'month')

**Response:**
```json
{
  "success": true,
  "period": "month",
  "overall_stats": {
    "total_sales": 150,
    "total_revenue": 75000.00,
    "average_price": 500.00,
    "min_price": 100.00,
    "max_price": 1000.00,
    "courses_sold": 5
  },
  "sales_by_period": [
    {
      "period": "2024-10-01T00:00:00.000Z",
      "sales_count": 25,
      "revenue": 12500.00,
      "average_price": 500.00
    }
  ],
  "top_courses": [
    {
      "id": 1,
      "title": "Course Title",
      "price": 500.00,
      "sales_count": 50,
      "revenue": 25000.00
    }
  ]
}
```

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

## Enhanced Course Creation

### POST /api/courses
Создание курса с новыми полями

**Request Body:**
```json
{
  "title": "Course Title",
  "description": "Course description",
  "price": 500.00,
  "features": ["Feature 1", "Feature 2"],
  "whatYouLearn": ["Learn 1", "Learn 2"],
  "imageSrc": "image_url",
  "bg": "white",
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
    "title": "Course Title",
    "description": "Course description",
    "price": 500.00,
    "author_id": 1,
    "category_id": 1,
    "access_duration": "lifetime",
    "video_url": "https://youtube.com/watch?v=example",
    "is_published": false,
    "author": {
      "id": 1,
      "name": "Teacher Name",
      "avatar": "avatar_url"
    }
  }
}
```

## Database Schema Changes

### New Fields in `courses` table:
- `category_id` (INTEGER): References categories table
- `access_duration` (VARCHAR): 'lifetime', '1_year', '2_years', '6_months'
- `video_url` (TEXT): URL to course video

### New `purchases` table:
- `id` (SERIAL PRIMARY KEY)
- `user_id` (INTEGER): References users table
- `course_id` (INTEGER): References courses table
- `amount` (DECIMAL): Purchase amount
- `payment_method` (VARCHAR): 'card', 'bank_transfer', 'cash'
- `payment_status` (VARCHAR): 'pending', 'completed', 'failed', 'refunded'
- `card_number_masked` (VARCHAR): Masked card number
- `card_holder` (VARCHAR): Card holder name
- `expiry_date` (VARCHAR): Card expiry date
- `transaction_id` (VARCHAR): Payment system transaction ID
- `created_at` (TIMESTAMP)
- `updated_at` (TIMESTAMP)
