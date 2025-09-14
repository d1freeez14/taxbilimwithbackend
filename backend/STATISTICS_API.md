# Course and Module Statistics API Documentation

## Overview
This document describes the new statistics functionality added to the TaxBilim backend API. The statistics provide detailed information about course and module content including counts and durations.

## Database Changes

### Courses Table
- `module_count` (INTEGER) - Number of modules in the course
- `lesson_count` (INTEGER) - Number of video lessons in the course  
- `total_duration` (INTEGER) - Total duration in minutes

### Modules Table
- `lesson_count` (INTEGER) - Number of video lessons in the module
- `assignment_count` (INTEGER) - Number of assignments in the module
- `total_duration` (INTEGER) - Total duration in minutes
- `duration_weeks` (INTEGER) - Duration in weeks (default: 1)

## API Endpoints

### Course Statistics

#### 1. Get Course with Statistics
**GET** `/api/courses/{id}`

Returns detailed course information including formatted statistics.

**Response:**
```json
{
  "course": {
    "id": 1,
    "title": "Основы налогообложения",
    "module_count": 5,
    "lesson_count": 78,
    "total_duration": 750,
    "statistics": {
      "moduleCount": 5,
      "lessonCount": 78,
      "totalDuration": 750,
      "formattedDuration": "12 часов 30 минут"
    },
    "summaryText": "5 модулей, 78 видеоуроков, 12 часов 30 минут",
    "modules": [
      {
        "id": 1,
        "title": "Модуль 1: Введение в налогообложение",
        "lesson_count": 15,
        "assignment_count": 3,
        "total_duration": 150,
        "duration_weeks": 2,
        "statistics": {
          "lessonCount": 15,
          "assignmentCount": 3,
          "totalDuration": 150,
          "durationWeeks": 2,
          "formattedDuration": "2 часа 30 минут"
        },
        "summaryText": "15 видеоуроков, 3 задания, 2 недели"
      }
    ]
  }
}
```

#### 2. Get Courses List with Statistics
**GET** `/api/courses`

Returns paginated list of courses with statistics.

**Response:**
```json
{
  "courses": [
    {
      "id": 1,
      "title": "Основы налогообложения",
      "module_count": 5,
      "lesson_count": 78,
      "total_duration": 750,
      "statistics": {
        "moduleCount": 5,
        "lessonCount": 78,
        "totalDuration": 750,
        "formattedDuration": "12 часов 30 минут"
      },
      "summaryText": "5 модулей, 78 видеоуроков, 12 часов 30 минут"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 25,
    "pages": 3
  }
}
```

#### 3. Calculate Course Statistics
**POST** `/api/courses/{id}/statistics/calculate`

Calculates and updates course statistics based on modules and lessons.

**Response:**
```json
{
  "statistics": {
    "moduleCount": 5,
    "lessonCount": 78,
    "totalDuration": 750
  },
  "course": {
    "id": 1,
    "module_count": 5,
    "lesson_count": 78,
    "total_duration": 750
  }
}
```

### Module Statistics

#### 1. Get Modules for Course
**GET** `/api/modules/course/{courseId}`

Returns all modules for a course with statistics.

**Response:**
```json
{
  "modules": [
    {
      "id": 1,
      "title": "Модуль 1: Введение в налогообложение",
      "lesson_count": 15,
      "assignment_count": 3,
      "total_duration": 150,
      "duration_weeks": 2,
      "statistics": {
        "lessonCount": 15,
        "assignmentCount": 3,
        "totalDuration": 150,
        "durationWeeks": 2,
        "formattedDuration": "2 часа 30 минут"
      },
      "summaryText": "15 видеоуроков, 3 задания, 2 недели"
    }
  ]
}
```

#### 2. Get Module by ID
**GET** `/api/modules/{id}`

Returns specific module with statistics.

#### 3. Calculate Module Statistics
**POST** `/api/modules/{id}/statistics/calculate`

Calculates and updates module statistics based on lessons.

**Response:**
```json
{
  "statistics": {
    "lessonCount": 15,
    "totalDuration": 150
  },
  "module": {
    "id": 1,
    "lesson_count": 15,
    "total_duration": 150
  }
}
```

## Migration Script

To add statistics columns and calculate statistics for existing data, run:

```bash
node src/scripts/update-course-statistics.js
```

This script will:
1. Add statistics columns to courses and modules tables
2. Calculate statistics for all existing modules
3. Calculate statistics for all existing courses

## Formatting Functions

The API includes Russian language formatting for durations and counts:

### Duration Formatting
- `formatDuration(90)` → "1 час 30 минут"
- `formatDuration(45)` → "45 минут"
- `formatDuration(120)` → "2 часа"

### Summary Text
- Course: "5 модулей, 78 видеоуроков, 12 часов 30 минут"
- Module: "15 видеоуроков, 3 задания, 2 недели"

## Usage Examples

### Get course with statistics
```javascript
const response = await fetch('/api/courses/1');
const data = await response.json();
console.log(data.course.summaryText); // "5 модулей, 78 видеоуроков, 12 часов 30 минут"
```

### Calculate statistics for all courses
```javascript
const courses = await fetch('/api/courses').then(r => r.json());
for (const course of courses.courses) {
  await fetch(`/api/courses/${course.id}/statistics/calculate`, {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${token}` }
  });
}
```

### Get module statistics
```javascript
const response = await fetch('/api/modules/1');
const data = await response.json();
console.log(data.module.summaryText); // "15 видеоуроков, 3 задания, 2 недели"
```

## Frontend Integration

The statistics can be used in the frontend to display:

1. **Course cards** with statistics:
   ```jsx
   <div className="course-card">
     <h3>{course.title}</h3>
     <p>{course.summaryText}</p>
   </div>
   ```

2. **Module information** in course program:
   ```jsx
   <div className="module-info">
     <h4>{module.title}</h4>
     <p>{module.summaryText}</p>
   </div>
   ```

3. **Progress indicators** using duration data:
   ```jsx
   <div className="progress-bar">
     <span>{course.statistics.formattedDuration}</span>
   </div>
   ```

## Notes

- All duration values are stored in minutes
- Statistics are automatically calculated when modules/lessons are added/updated
- The `summaryText` field provides ready-to-display Russian text
- Statistics are cached in the database for better performance
