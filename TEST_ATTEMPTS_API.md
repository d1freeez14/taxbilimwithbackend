# Test Attempts API Documentation

## Overview
API endpoints for managing and viewing test attempts. Users can submit test attempts, view their attempt history, and get detailed statistics about their performance.

## Endpoints

### 1. Submit Test Attempt
**POST** `/api/tests/:id/attempt`

Submit answers for a test and get immediate results.

**Headers:**
```
Authorization: Bearer <token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "answers": [
    {
      "questionId": 1,
      "answer": "Б) Обязательный платеж"
    },
    {
      "questionId": 2,
      "answer": "Б) Фискальная"
    }
  ]
}
```

**Response:**
```json
{
  "attempt": {
    "id": 1,
    "user_id": 3,
    "test_id": 1,
    "score": 12,
    "percentage": "100.00",
    "passed": true,
    "answers": [...],
    "completed_at": "2025-09-18T18:28:25.434Z",
    "created_at": "2025-09-18T18:28:25.434Z"
  },
  "score": 12,
  "maxScore": 12,
  "percentage": 100,
  "passed": true,
  "answerResults": [...]
}
```

### 2. Get Test Attempts (Basic)
**GET** `/api/tests/:id/attempts`

Get all attempts for a specific test by the authenticated user.

**Headers:**
```
Authorization: Bearer <token>
```

**Response:**
```json
{
  "attempts": [
    {
      "id": 1,
      "user_id": 3,
      "test_id": 1,
      "score": 12,
      "percentage": "100.00",
      "passed": true,
      "answers": [...],
      "completed_at": "2025-09-18T18:28:25.434Z",
      "created_at": "2025-09-18T18:28:25.434Z"
    }
  ]
}
```

### 3. Get Test Attempts (Detailed) - **NEW**
**GET** `/api/tests/:id/attempts/detailed`

Get comprehensive information about test attempts, including statistics and formatted data for UI display.

**Headers:**
```
Authorization: Bearer <token>
```

**Response:**
```json
{
  "test": {
    "id": 1,
    "title": "Тест по основам налогообложения",
    "description": "Проверьте свои знания по основам налогообложения",
    "lesson_title": "Урок 3: Налоговая система РК",
    "module_title": "Модуль 1: Введение в налогообложение",
    "course_title": "Основы налогообложения",
    "passing_score": 70,
    "time_limit": 30
  },
  "lastAttempt": {
    "id": 3,
    "score": 4,
    "percentage": "33.00",
    "passed": false,
    "status": "Незачёт",
    "statusClass": "failed",
    "completedAt": "2025-09-18T18:28:41.300Z"
  },
  "statistics": {
    "totalAttempts": 3,
    "passedAttempts": 1,
    "failedAttempts": 2,
    "bestScore": 12,
    "bestPercentage": "100.00",
    "successRate": "33.3"
  },
  "attempts": [
    {
      "attemptNumber": "1",
      "status": "Незачёт",
      "statusClass": "failed",
      "score": 4,
      "percentage": "33.00",
      "completedAt": "2025-09-18T18:28:41.300Z",
      "passed": false
    },
    {
      "attemptNumber": "2",
      "status": "Зачёт",
      "statusClass": "passed",
      "score": 12,
      "percentage": "100.00",
      "completedAt": "2025-09-18T18:28:25.434Z",
      "passed": true
    }
  ]
}
```

## Data Structure

### Test Object
- `id` - Test ID
- `title` - Test title
- `description` - Test description
- `lesson_title` - Associated lesson title
- `module_title` - Associated module title
- `course_title` - Associated course title
- `passing_score` - Minimum score to pass (percentage)
- `time_limit` - Time limit in minutes

### Last Attempt Object
- `id` - Attempt ID
- `score` - Points earned
- `percentage` - Score as percentage
- `passed` - Boolean indicating if passed
- `status` - Human-readable status ("Зачёт" or "Незачёт")
- `statusClass` - CSS class for styling ("passed" or "failed")
- `completedAt` - Completion timestamp

### Statistics Object
- `totalAttempts` - Total number of attempts
- `passedAttempts` - Number of passed attempts
- `failedAttempts` - Number of failed attempts
- `bestScore` - Highest score achieved
- `bestPercentage` - Highest percentage achieved
- `successRate` - Percentage of successful attempts

### Attempt Object (in attempts array)
- `attemptNumber` - Sequential attempt number
- `status` - Human-readable status
- `statusClass` - CSS class for styling
- `score` - Points earned
- `percentage` - Score as percentage
- `completedAt` - Completion timestamp
- `passed` - Boolean indicating if passed

## Usage Examples

### JavaScript/TypeScript
```javascript
// Get detailed test attempts
const getTestAttempts = async (testId) => {
  const response = await fetch(`/api/tests/${testId}/attempts/detailed`, {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
  return response.json();
};

// Submit test attempt
const submitTestAttempt = async (testId, answers) => {
  const response = await fetch(`/api/tests/${testId}/attempt`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ answers })
  });
  return response.json();
};
```

### React Component Example
```jsx
import React, { useState, useEffect } from 'react';

const TestAttemptsView = ({ testId }) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadTestAttempts();
  }, [testId]);

  const loadTestAttempts = async () => {
    try {
      const response = await fetch(`/api/tests/${testId}/attempts/detailed`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const result = await response.json();
      setData(result);
    } catch (error) {
      console.error('Error loading test attempts:', error);
    } finally {
      setLoading(false);
    }
  };

  const startNewAttempt = () => {
    // Navigate to test taking interface
    window.location.href = `/test/${testId}`;
  };

  if (loading) return <div>Loading...</div>;
  if (!data) return <div>No data available</div>;

  return (
    <div className="test-attempts">
      <h1>{data.test.title}</h1>
      
      {/* Last Attempt Section */}
      {data.lastAttempt && (
        <div className="last-attempt">
          <h2>Последняя попытка</h2>
          <div className={`status ${data.lastAttempt.statusClass}`}>
            {data.lastAttempt.status}
          </div>
          <div className="details">
            <span>Баллы: {data.lastAttempt.score}</span>
            <span>{data.lastAttempt.percentage}%</span>
            <span>{new Date(data.lastAttempt.completedAt).toLocaleString()}</span>
          </div>
          <button onClick={startNewAttempt}>
            Начать новую попытку
          </button>
        </div>
      )}

      {/* All Attempts Table */}
      <div className="all-attempts">
        <h2>Все попытки</h2>
        <table>
          <thead>
            <tr>
              <th>#</th>
              <th>Статус</th>
              <th>Баллы</th>
              <th>Процент</th>
              <th>Завершено</th>
            </tr>
          </thead>
          <tbody>
            {data.attempts.map((attempt) => (
              <tr key={attempt.attemptNumber}>
                <td>{attempt.attemptNumber}</td>
                <td>
                  <span className={`status ${attempt.statusClass}`}>
                    {attempt.status}
                  </span>
                </td>
                <td>{attempt.score}</td>
                <td>{attempt.percentage}%</td>
                <td>{new Date(attempt.completedAt).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Statistics */}
      <div className="statistics">
        <h3>Статистика</h3>
        <p>Всего попыток: {data.statistics.totalAttempts}</p>
        <p>Успешных: {data.statistics.passedAttempts}</p>
        <p>Лучший результат: {data.statistics.bestPercentage}%</p>
        <p>Процент успеха: {data.statistics.successRate}%</p>
      </div>
    </div>
  );
};

export default TestAttemptsView;
```

## CSS Classes

For styling the status indicators:

```css
.status.passed {
  background-color: #d4edda;
  color: #155724;
  padding: 2px 8px;
  border-radius: 4px;
}

.status.failed {
  background-color: #f8d7da;
  color: #721c24;
  padding: 2px 8px;
  border-radius: 4px;
}
```

## Notes

1. **Authentication Required**: All endpoints require valid JWT token
2. **User-Specific**: Users can only see their own attempts
3. **Automatic Scoring**: Scores and percentages are calculated automatically
4. **Timestamp Format**: All timestamps are in ISO 8601 format
5. **Status Localization**: Status text is in Russian ("Зачёт"/"Незачёт")
6. **Ordered Results**: Attempts are ordered by creation date (newest first)

## Error Handling

Always handle potential errors:
- Network errors
- Authentication failures (401)
- Test not found (404)
- Server errors (500)
- Validation errors (400)
