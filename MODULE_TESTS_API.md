# API для проверки тестов в модулях

## Обзор

API endpoints для определения наличия тестов в модулях и получения информации о них.

## Базовый URL
```
http://localhost:5001/api/modules
```

## Endpoints

### 1. Получить модули курса с информацией о тестах

```http
GET /course/:courseId
Authorization: Bearer <token>
```

**Параметры:**
- `courseId` (integer) - ID курса

**Ответ:**
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
      "hasTests": true,
      "testCount": 1,
      "testTitles": ["Тест по основам налогообложения"],
      "statistics": {
        "lessonCount": 0,
        "assignmentCount": 0,
        "totalDuration": 0,
        "durationWeeks": 1,
        "formattedDuration": "0 минут"
      },
      "summaryText": "0 видеоурока, 0 задания, 1 неделя"
    }
  ]
}
```

**Новые поля для проверки тестов:**
- `hasTests` (boolean) - есть ли тесты в модуле
- `testCount` (integer) - количество тестов
- `testTitles` (array) - названия тестов

### 2. Получить конкретный модуль с информацией о тестах

```http
GET /:id
Authorization: Bearer <token>
```

**Параметры:**
- `id` (integer) - ID модуля

**Ответ:** Аналогичен предыдущему, но для одного модуля.

### 3. Проверить наличие тестов в модуле

```http
GET /:id/tests
Authorization: Bearer <token>
```

**Параметры:**
- `id` (integer) - ID модуля

**Ответ:**
```json
{
  "hasTests": true,
  "testCount": 1,
  "tests": [
    {
      "id": 1,
      "title": "Тест по основам налогообложения",
      "description": "Проверьте свои знания по основам налогообложения",
      "time_limit": 30,
      "passing_score": 70,
      "lesson_title": "Урок 3: Налоговая система РК",
      "lesson_order": 3
    }
  ]
}
```

### 4. Получить сводку по тестам модуля

```http
GET /:id/tests/summary
Authorization: Bearer <token>
```

**Параметры:**
- `id` (integer) - ID модуля

**Ответ:**
```json
{
  "hasTests": true,
  "totalTests": 1,
  "testsWithPassingScore": 1,
  "avgTimeLimit": 30,
  "avgPassingScore": 70,
  "testTitles": ["Тест по основам налогообложения"]
}
```

## Примеры использования

### JavaScript/TypeScript

```javascript
// Проверить, есть ли тесты в модуле
const checkModuleTests = async (moduleId, token) => {
  try {
    const response = await fetch(`http://localhost:5001/api/modules/${moduleId}/tests`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    
    const data = await response.json();
    return data.hasTests;
  } catch (error) {
    console.error('Error checking module tests:', error);
    return false;
  }
};

// Получить все модули курса с информацией о тестах
const getCourseModulesWithTests = async (courseId, token) => {
  try {
    const response = await fetch(`http://localhost:5001/api/modules/course/${courseId}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    
    const data = await response.json();
    return data.modules.map(module => ({
      id: module.id,
      title: module.title,
      hasTests: module.hasTests,
      testCount: module.testCount,
      testTitles: module.testTitles
    }));
  } catch (error) {
    console.error('Error fetching course modules:', error);
    return [];
  }
};

// Получить сводку по тестам модуля
const getModuleTestSummary = async (moduleId, token) => {
  try {
    const response = await fetch(`http://localhost:5001/api/modules/${moduleId}/tests/summary`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching module test summary:', error);
    return null;
  }
};
```

### React компонент

```jsx
import React, { useState, useEffect } from 'react';

const ModuleTestsIndicator = ({ moduleId, token }) => {
  const [hasTests, setHasTests] = useState(false);
  const [testCount, setTestCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkTests = async () => {
      try {
        const response = await fetch(`http://localhost:5001/api/modules/${moduleId}/tests`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
        
        const data = await response.json();
        setHasTests(data.hasTests);
        setTestCount(data.testCount);
      } catch (error) {
        console.error('Error checking module tests:', error);
      } finally {
        setLoading(false);
      }
    };

    checkTests();
  }, [moduleId, token]);

  if (loading) {
    return <div>Проверка тестов...</div>;
  }

  return (
    <div className="module-tests-indicator">
      {hasTests ? (
        <div className="tests-info">
          <span className="test-icon">📝</span>
          <span>{testCount} тест{testCount > 1 ? 'ов' : ''}</span>
        </div>
      ) : (
        <div className="no-tests">
          <span>Нет тестов</span>
        </div>
      )}
    </div>
  );
};

export default ModuleTestsIndicator;
```

### Компонент списка модулей с тестами

```jsx
import React, { useState, useEffect } from 'react';

const CourseModulesList = ({ courseId, token }) => {
  const [modules, setModules] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchModules = async () => {
      try {
        const response = await fetch(`http://localhost:5001/api/modules/course/${courseId}`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
        
        const data = await response.json();
        setModules(data.modules);
      } catch (error) {
        console.error('Error fetching modules:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchModules();
  }, [courseId, token]);

  if (loading) {
    return <div>Загрузка модулей...</div>;
  }

  return (
    <div className="course-modules">
      {modules.map(module => (
        <div key={module.id} className="module-card">
          <h3>{module.title}</h3>
          <div className="module-stats">
            <span>Уроков: {module.lesson_count}</span>
            {module.hasTests && (
              <span className="tests-badge">
                📝 {module.testCount} тест{module.testCount > 1 ? 'ов' : ''}
              </span>
            )}
          </div>
          {module.hasTests && (
            <div className="test-titles">
              <strong>Тесты:</strong>
              <ul>
                {module.testTitles.map((title, index) => (
                  <li key={index}>{title}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default CourseModulesList;
```

## Логика определения тестов

### В базе данных

Тесты связаны с модулями через таблицу `lessons`:
- `tests.lesson_id` → `lessons.id`
- `lessons.module_id` → `modules.id`

### В API

1. **hasTests** - `testCount > 0`
2. **testCount** - количество тестов в модуле
3. **testTitles** - массив названий тестов

### SQL запрос

```sql
SELECT 
  m.id,
  m.title,
  COUNT(t.id) as test_count,
  STRING_AGG(t.title, ', ') as test_titles
FROM modules m
LEFT JOIN lessons l ON m.id = l.module_id
LEFT JOIN tests t ON l.id = t.lesson_id
WHERE m.id = $1
GROUP BY m.id, m.title
```

## Обработка ошибок

```javascript
const handleModuleTestsError = (error) => {
  if (error.status === 401) {
    console.error('Не авторизован');
  } else if (error.status === 404) {
    console.error('Модуль не найден');
  } else {
    console.error('Ошибка сервера:', error.message);
  }
};
```

## Кэширование

Рекомендуется кэшировать результаты проверки тестов, так как они не часто изменяются:

```javascript
const moduleTestsCache = new Map();

const getCachedModuleTests = async (moduleId, token) => {
  if (moduleTestsCache.has(moduleId)) {
    return moduleTestsCache.get(moduleId);
  }
  
  const result = await checkModuleTests(moduleId, token);
  moduleTestsCache.set(moduleId, result);
  return result;
};
```

## Производительность

- Все запросы оптимизированы с использованием JOIN
- Индексы на `lessons.module_id` и `tests.lesson_id`
- Минимальное количество запросов к базе данных
