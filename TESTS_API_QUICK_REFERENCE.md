# 🧪 API Тестов - Краткая справка

## 🚀 Быстрый старт

### 1. Получить все тесты
```bash
curl -H "Authorization: Bearer <token>" \
  http://localhost:5001/api/tests
```

### 2. Получить тест с вопросами
```bash
curl -H "Authorization: Bearer <token>" \
  http://localhost:5001/api/tests/1
```

### 3. Пройти тест
```bash
curl -X POST \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "answers": [
      {"questionId": 1, "answer": "Б) Обязательный платеж"},
      {"questionId": 2, "answer": "Б) Фискальная"}
    ]
  }' \
  http://localhost:5001/api/tests/1/attempt
```

### 4. Получить попытки теста
```bash
curl -H "Authorization: Bearer <token>" \
  http://localhost:5001/api/tests/1/attempts
```

## 📋 Endpoints

| Method | Endpoint | Описание |
|--------|----------|----------|
| `GET` | `/api/tests` | Список всех тестов |
| `GET` | `/api/tests/:id` | Детали теста с вопросами |
| `POST` | `/api/tests/:id/attempt` | Прохождение теста |
| `GET` | `/api/tests/:id/attempts` | Попытки теста |
| `GET` | `/api/lessons?lessonType=TEST` | Уроки типа TEST |
| `GET` | `/api/lessons/:id/navigate` | Навигация к тесту |

## 🔑 Авторизация

Все endpoints требуют JWT токен:
```http
Authorization: Bearer <your-jwt-token>
```

## 📊 Структуры данных

### Test
```typescript
{
  id: number;
  lesson_id: number;
  title: string;
  description: string;
  time_limit: number;      // минуты
  passing_score: number;   // проценты
  questions?: TestQuestion[];
}
```

### TestQuestion
```typescript
{
  id: number;
  question_text: string;
  question_type: "multiple_choice";
  options: string[];
  correct_answer: string;
  points: number;
  question_order: number;
}
```

### SubmitAnswer
```typescript
{
  questionId: number;
  answer: string;
}
```

## 🎯 Примеры ответов

### Успешное прохождение теста
```json
{
  "attempt": {
    "id": 1,
    "score": 12,
    "percentage": "100.00",
    "passed": true
  },
  "score": 12,
  "maxScore": 12,
  "percentage": 100,
  "passed": true
}
```

### Ошибки
```json
{
  "message": "Access denied. No token provided."
}
```

## 🔗 Интеграция с уроками

### Получить уроки типа TEST
```bash
curl -H "Authorization: Bearer <token>" \
  "http://localhost:5001/api/lessons?lessonType=TEST"
```

### Навигация к тесту
```bash
curl -H "Authorization: Bearer <token>" \
  http://localhost:5001/api/lessons/49/navigate
```

**Ответ:**
```json
{
  "navigationUrl": "/lesson/49/test",
  "isCompleted": false
}
```

## 🎨 Frontend URLs

- **Список тестов:** `/dashboard/tests`
- **Прохождение теста:** `/dashboard/tests/[testId]`
- **Тест в курсе:** `/dashboard/myEducation/[courseId]/module/[moduleId]/test/[testId]`

## ⚡ Готовые тестовые данные

В системе уже есть тестовые данные:
- **Тест ID 1:** "Тест по основам налогообложения" (5 вопросов)
- **Урок ID 49:** Урок типа TEST, связанный с тестом ID 1

## 🧪 Тестовые пользователи

- **Студент:** `student@taxbilim.com` / `student123`
- **Преподаватель:** `teacher@taxbilim.com` / `teacher123`
- **Админ:** `admin@taxbilim.com` / `admin123`

## 🚀 Готово к использованию!

Backend полностью готов. Все API endpoints протестированы и работают. Фронтенд можно интегрировать по документации `FRONTEND_INTEGRATION_GUIDE.md`.
