# Course Progress API Documentation

## Overview
This document describes the new course progress functionality added to the TaxBilim backend API. The progress field allows tracking the completion percentage of courses.

## Database Changes
- Added `progress` field to the `courses` table (INTEGER, 0-100, default: 0)
- Field represents the completion percentage of the course

## API Endpoints

### 1. Get Course Progress
**GET** `/api/courses/{id}/progress`

Retrieves the current progress percentage for a specific course.

**Response:**
```json
{
  "progress": 75
}
```

### 2. Update Course Progress
**PATCH** `/api/courses/{id}/progress`

Updates the progress percentage for a specific course. Requires TEACHER or ADMIN role.

**Request Body:**
```json
{
  "progress": 85
}
```

**Response:**
```json
{
  "course": {
    "id": 1,
    "title": "Course Title",
    "progress": 85,
    // ... other course fields
  }
}
```

### 3. Calculate Course Progress Automatically
**POST** `/api/courses/{id}/progress/calculate`

Calculates and updates course progress based on completed lessons. Requires TEACHER or ADMIN role.

**Response:**
```json
{
  "course": {
    "id": 1,
    "title": "Course Title",
    "progress": 75,
    // ... other course fields
  },
  "calculatedProgress": {
    "totalLessons": 20,
    "completedLessons": 15,
    "progressPercentage": 75
  }
}
```

### 4. Create Course with Progress
**POST** `/api/courses`

Creates a new course with optional progress field.

**Request Body:**
```json
{
  "title": "Course Title",
  "description": "Course Description",
  "price": 25990.00,
  "authorId": "author_id",
  "features": ["Feature 1", "Feature 2"],
  "whatYouLearn": ["Learn 1", "Learn 2"],
  "progress": 0  // Optional, defaults to 0
}
```

### 5. Update Course with Progress
**PUT** `/api/courses/{id}`

Updates an existing course, including progress field.

**Request Body:**
```json
{
  "title": "Updated Title",
  "progress": 50  // Optional
}
```

## Migration Script

To add the progress field to existing courses and calculate their progress based on completed lessons, run:

```bash
node src/scripts/add-progress-to-courses.js
```

This script will:
1. Add the progress column to the courses table if it doesn't exist
2. Calculate progress for all existing courses based on completed lessons
3. Update all courses with their calculated progress

## Validation Rules

- Progress must be an integer between 0 and 100
- Progress field is optional when creating/updating courses
- Default value is 0 for new courses

## Error Handling

- **400 Bad Request**: Invalid progress value (not between 0-100)
- **404 Not Found**: Course not found
- **500 Internal Server Error**: Server error

## Usage Examples

### Calculate progress for all courses
```javascript
// Get all courses and calculate their progress
const courses = await fetch('/api/courses').then(r => r.json());
for (const course of courses.courses) {
  await fetch(`/api/courses/${course.id}/progress/calculate`, {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${token}` }
  });
}
```

### Update course progress manually
```javascript
await fetch('/api/courses/1/progress', {
  method: 'PATCH',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  },
  body: JSON.stringify({ progress: 85 })
});
```

## Integration with Frontend

The progress field can be used in the frontend to:
- Display progress bars for courses
- Show completion status
- Filter courses by progress level
- Generate progress reports

## Notes

- Progress is calculated based on completed lessons vs total lessons in the course
- The calculation endpoint provides detailed information about lesson completion
- Progress updates are logged with timestamps in the `updated_at` field
