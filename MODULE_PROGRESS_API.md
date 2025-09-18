# Module Progress API Documentation

## Overview
API endpoints for managing module completion status. Users can mark modules as completed or incomplete, and the system tracks their progress.

## Endpoints

### 1. Mark Module as Completed
**POST** `/api/modules/:id/complete`

Marks a module as completed for the authenticated user.

**Headers:**
```
Authorization: Bearer <token>
Content-Type: application/json
```

**Parameters:**
- `id` (path) - Module ID

**Response:**
```json
{
  "message": "Module marked as completed successfully.",
  "progress": {
    "id": 1,
    "user_id": 3,
    "module_id": 1,
    "completed": true,
    "completed_at": "2025-09-18T18:26:26.419Z",
    "created_at": "2025-09-18T18:26:26.419Z",
    "updated_at": "2025-09-18T18:26:26.419Z"
  }
}
```

**Error Responses:**
- `404` - Module not found
- `500` - Server error

### 2. Mark Module as Incomplete
**POST** `/api/modules/:id/incomplete`

Marks a module as incomplete for the authenticated user.

**Headers:**
```
Authorization: Bearer <token>
Content-Type: application/json
```

**Parameters:**
- `id` (path) - Module ID

**Response:**
```json
{
  "message": "Module marked as incomplete successfully.",
  "progress": {
    "id": 1,
    "user_id": 3,
    "module_id": 1,
    "completed": false,
    "completed_at": null,
    "created_at": "2025-09-18T18:26:26.419Z",
    "updated_at": "2025-09-18T18:26:34.094Z"
  }
}
```

**Error Responses:**
- `404` - Module not found or module progress not found
- `500` - Server error

### 3. Get Modules with Progress Status
**GET** `/api/modules/course/:courseId`

Retrieves all modules for a course with their completion status for the authenticated user.

**Headers:**
```
Authorization: Bearer <token>
```

**Parameters:**
- `courseId` (path) - Course ID

**Response:**
```json
{
  "modules": [
    {
      "id": 1,
      "title": "Модуль 1: Введение в налогообложение",
      "order": 1,
      "course_id": 1,
      "lesson_count": 0,
      "assignment_count": 0,
      "total_duration": 0,
      "duration_weeks": 1,
      "test_count": "1",
      "test_titles": "Тест по основам налогообложения",
      "is_finished": true,
      "statistics": {
        "lessonCount": 0,
        "assignmentCount": 0,
        "totalDuration": 0,
        "durationWeeks": 1,
        "formattedDuration": "0 минут"
      },
      "summaryText": "0 видеоурока, 0 задания, 1 неделя",
      "hasTests": true,
      "testCount": 1,
      "testTitles": ["Тест по основам налогообложения"]
    }
  ]
}
```

## Database Schema

### module_progress Table
```sql
CREATE TABLE module_progress (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    module_id INTEGER NOT NULL REFERENCES modules(id) ON DELETE CASCADE,
    completed BOOLEAN DEFAULT FALSE,
    completed_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, module_id)
);
```

## Usage Examples

### JavaScript/TypeScript
```javascript
// Mark module as completed
const completeModule = async (moduleId) => {
  const response = await fetch(`/api/modules/${moduleId}/complete`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  });
  return response.json();
};

// Mark module as incomplete
const incompleteModule = async (moduleId) => {
  const response = await fetch(`/api/modules/${moduleId}/incomplete`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  });
  return response.json();
};

// Get modules with progress
const getModulesWithProgress = async (courseId) => {
  const response = await fetch(`/api/modules/course/${courseId}`, {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
  return response.json();
};
```

### React Component Example
```jsx
import React, { useState, useEffect } from 'react';

const ModuleProgress = ({ moduleId, courseId }) => {
  const [isCompleted, setIsCompleted] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Load initial progress status
    loadModules();
  }, [courseId]);

  const loadModules = async () => {
    try {
      const response = await fetch(`/api/modules/course/${courseId}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await response.json();
      const module = data.modules.find(m => m.id === moduleId);
      setIsCompleted(module?.is_finished || false);
    } catch (error) {
      console.error('Error loading modules:', error);
    }
  };

  const toggleCompletion = async () => {
    setLoading(true);
    try {
      if (isCompleted) {
        await fetch(`/api/modules/${moduleId}/incomplete`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
        setIsCompleted(false);
      } else {
        await fetch(`/api/modules/${moduleId}/complete`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
        setIsCompleted(true);
      }
    } catch (error) {
      console.error('Error updating module progress:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={toggleCompletion}
      disabled={loading}
      className={`px-4 py-2 rounded ${
        isCompleted 
          ? 'bg-green-500 text-white' 
          : 'bg-orange-500 text-white'
      }`}
    >
      {loading ? 'Loading...' : 
       isCompleted ? 'Mark as Incomplete' : 'Mark as Completed'}
    </button>
  );
};

export default ModuleProgress;
```

## Notes

1. **Authentication Required**: All endpoints require valid JWT token
2. **User-Specific**: Progress is tracked per user
3. **Automatic Timestamps**: `completed_at` is automatically set when marking as completed
4. **Unique Constraint**: Each user can have only one progress record per module
5. **Cascade Delete**: Progress records are automatically deleted when user or module is deleted

## Error Handling

Always handle potential errors:
- Network errors
- Authentication failures
- Server errors (500)
- Not found errors (404)
- Validation errors (400)
