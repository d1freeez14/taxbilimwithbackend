# Lesson Features API Documentation

## Overview
This document describes the new lesson features added to the TaxBilim backend API, including lesson types, locking mechanism, and test integration.

## New Features

### 1. Author Description
- Added `description` field to authors table
- Provides additional detailed information about the author

### 2. Enrollment Recording Status
- Added `is_recorded` field to enrollments table
- Indicates whether the course is recorded or live

### 3. Lesson Locking System
- Added `locked` field to lessons table
- Lessons can be locked to enforce sequential completion
- First lesson is always unlocked
- Subsequent lessons unlock when previous lesson is completed

### 4. Lesson Types
- Added `lesson_type` field with support for:
  - `VIDEO` - Video lessons
  - `TEST` - Tests and quizzes
  - `READING` - Reading materials
  - `ASSIGNMENT` - Assignments
  - `LIVE_SESSION` - Live sessions
  - `QUIZ` - Interactive quizzes

### 5. Lesson Images
- Added `image` field for lesson thumbnails
- Supports custom images for each lesson

### 6. Test Integration
- Tests can be displayed as lessons
- Added `test_id` field to link lessons to tests
- Added `url` field for custom navigation URLs

## API Endpoints

### Lesson Management

#### Get Lessons for Module
**GET** `/api/lessons/module/{moduleId}`

Returns all lessons for a module with access information.

**Response:**
```json
{
  "lessons": [
    {
      "id": 1,
      "title": "Урок 1: Введение в налогообложение",
      "lesson_type": "VIDEO",
      "locked": false,
      "is_unlocked": true,
      "access": {
        "isAccessible": true,
        "isLocked": false,
        "reason": null,
        "type": "VIDEO",
        "label": "Видеоурок",
        "icon": "play-circle"
      },
      "navigationUrl": "/lesson/1/video",
      "typeLabel": "Видеоурок",
      "typeIcon": "play-circle",
      "image": "/lesson-thumbnail.jpg",
      "duration": 15
    }
  ]
}
```

#### Get Lesson by ID
**GET** `/api/lessons/{id}`

Returns detailed lesson information with access status.

#### Create Lesson
**POST** `/api/lessons`

Creates a new lesson with specified type and properties.

**Request Body:**
```json
{
  "title": "Новый урок",
  "moduleId": "module_id",
  "order": 1,
  "lessonType": "VIDEO",
  "content": "Описание урока",
  "videoUrl": "https://example.com/video.mp4",
  "duration": 15,
  "image": "/lesson-image.jpg",
  "locked": false,
  "testId": "test_id",
  "url": "/custom-url"
}
```

#### Update Lesson
**PUT** `/api/lessons/{id}`

Updates lesson properties including type and locking status.

#### Get Lesson Navigation
**GET** `/api/lessons/{id}/navigate`

Returns navigation URL based on lesson type.

**Response:**
```json
{
  "lesson": {
    "id": 1,
    "title": "Урок 1",
    "lesson_type": "VIDEO",
    "navigationUrl": "/lesson/1/video",
    "access": {
      "isAccessible": true,
      "isLocked": false
    }
  },
  "navigationUrl": "/lesson/1/video",
  "isCompleted": false
}
```

#### Get Lesson Types
**GET** `/api/lessons/types`

Returns all available lesson types with labels and icons.

**Response:**
```json
{
  "lessonTypes": [
    {
      "type": "VIDEO",
      "label": "Видеоурок",
      "icon": "play-circle",
      "navigationUrl": "/lesson/placeholder/video"
    },
    {
      "type": "TEST",
      "label": "Тест",
      "icon": "clipboard-check",
      "navigationUrl": "/lesson/placeholder/test"
    }
  ]
}
```

### Test Management

#### Get Test by ID
**GET** `/api/tests/{id}`

Returns test with questions.

**Response:**
```json
{
  "test": {
    "id": 1,
    "title": "Тест по основам налогообложения",
    "description": "Проверьте свои знания",
    "time_limit": 30,
    "passing_score": 70,
    "questions": [
      {
        "id": 1,
        "question_text": "Что такое НДС?",
        "question_type": "multiple_choice",
        "options": ["Налог на добавленную стоимость", "Налог на доходы"],
        "correct_answer": "Налог на добавленную стоимость",
        "points": 1,
        "question_order": 1
      }
    ]
  }
}
```

#### Submit Test Attempt
**POST** `/api/tests/{id}/attempt`

Submits test answers and calculates score.

**Request Body:**
```json
{
  "answers": [
    {
      "questionId": 1,
      "answer": "Налог на добавленную стоимость"
    }
  ]
}
```

**Response:**
```json
{
  "attempt": {
    "id": 1,
    "user_id": 1,
    "test_id": 1,
    "score": 8,
    "percentage": 80.0,
    "passed": true
  },
  "score": 8,
  "maxScore": 10,
  "percentage": 80,
  "passed": true,
  "answerResults": [
    {
      "questionId": 1,
      "userAnswer": "Налог на добавленную стоимость",
      "correctAnswer": "Налог на добавленную стоимость",
      "isCorrect": true,
      "points": 1
    }
  ]
}
```

## Database Schema Changes

### Authors Table
```sql
ALTER TABLE authors ADD COLUMN description TEXT;
```

### Enrollments Table
```sql
ALTER TABLE enrollments ADD COLUMN is_recorded BOOLEAN DEFAULT true;
```

### Lessons Table
```sql
ALTER TABLE lessons ADD COLUMN image VARCHAR(255);
ALTER TABLE lessons ADD COLUMN locked BOOLEAN DEFAULT false;
ALTER TABLE lessons ADD COLUMN lesson_type VARCHAR(50) DEFAULT 'VIDEO';
ALTER TABLE lessons ADD COLUMN test_id INTEGER;
ALTER TABLE lessons ADD COLUMN url VARCHAR(500);
```

### New Tables
- `tests` - Test definitions
- `test_questions` - Test questions
- `test_attempts` - User test attempts

## Migration Script

Run the migration script to add new features:

```bash
node src/scripts/add-lesson-features.js
```

## Frontend Integration

### Lesson Type Icons
```jsx
const lessonTypeIcons = {
  VIDEO: 'play-circle',
  TEST: 'clipboard-check',
  READING: 'book-open',
  ASSIGNMENT: 'edit-3',
  LIVE_SESSION: 'video',
  QUIZ: 'help-circle'
};
```

### Lesson Access Control
```jsx
function LessonCard({ lesson }) {
  const { access, navigationUrl } = lesson;
  
  return (
    <div className={`lesson-card ${access.isLocked ? 'locked' : ''}`}>
      <div className="lesson-icon">
        <Icon name={access.icon} />
      </div>
      <h3>{lesson.title}</h3>
      <p>{access.label}</p>
      {access.isLocked && (
        <p className="locked-message">{access.reason}</p>
      )}
      <a href={navigationUrl} disabled={!access.isAccessible}>
        {access.isAccessible ? 'Начать урок' : 'Заблокировано'}
      </a>
    </div>
  );
}
```

### Test Integration
```jsx
function TestLesson({ lesson }) {
  const { test_id, navigationUrl } = lesson;
  
  return (
    <div className="test-lesson">
      <h3>{lesson.title}</h3>
      <p>Тест: {lesson.test_id}</p>
      <a href={navigationUrl}>
        Пройти тест
      </a>
    </div>
  );
}
```

## Usage Examples

### Create Video Lesson
```javascript
const response = await fetch('/api/lessons', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  },
  body: JSON.stringify({
    title: 'Введение в налогообложение',
    moduleId: 'module_123',
    order: 1,
    lessonType: 'VIDEO',
    videoUrl: 'https://example.com/video.mp4',
    duration: 15,
    image: '/lesson-thumbnail.jpg'
  })
});
```

### Create Test Lesson
```javascript
const response = await fetch('/api/lessons', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  },
  body: JSON.stringify({
    title: 'Тест по основам налогообложения',
    moduleId: 'module_123',
    order: 2,
    lessonType: 'TEST',
    testId: 'test_123',
    locked: true
  })
});
```

### Check Lesson Access
```javascript
const response = await fetch('/api/lessons/lesson_123');
const { lesson } = await response.json();

if (lesson.access.isAccessible) {
  window.location.href = lesson.navigationUrl;
} else {
  alert(lesson.access.reason);
}
```

## Notes

- Lesson locking is enforced at the API level
- First lesson in each module is always unlocked
- Tests can be standalone or linked to lessons
- All lesson types support custom navigation URLs
- Russian language support for all labels and messages
