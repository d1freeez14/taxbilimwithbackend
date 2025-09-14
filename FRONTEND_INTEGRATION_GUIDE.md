# 🎯 Руководство по интеграции тестов на фронтенде

## 📋 Обзор

Данное руководство описывает, как интегрировать функциональность тестов в существующий фронтенд приложения TaxBilim. Backend API полностью готов и поддерживает все необходимые операции с тестами.

## 🔗 API Endpoints

### 1. **Получение всех тестов**
```http
GET /api/tests
Authorization: Bearer <token>
```

**Ответ:**
```json
{
  "tests": [
    {
      "id": 1,
      "lesson_id": 3,
      "title": "Тест по основам налогообложения",
      "description": "Проверьте свои знания по основам налогообложения",
      "time_limit": 30,
      "passing_score": 70,
      "created_at": "2025-09-14T12:46:40.473Z",
      "updated_at": "2025-09-14T12:46:40.473Z",
      "lesson_title": "Урок 3: Налоговая система РК",
      "module_title": "Модуль 1: Введение в налогообложение",
      "course_title": "Основы налогообложения"
    }
  ]
}
```

### 2. **Получение теста по ID с вопросами**
```http
GET /api/tests/:id
Authorization: Bearer <token>
```

**Ответ:**
```json
{
  "test": {
    "id": 1,
    "lesson_id": 3,
    "title": "Тест по основам налогообложения",
    "description": "Проверьте свои знания по основам налогообложения",
    "time_limit": 30,
    "passing_score": 70,
    "questions": [
      {
        "id": 1,
        "question_text": "Что такое налог?",
        "question_type": "multiple_choice",
        "options": [
          "A) Добровольный взнос",
          "Б) Обязательный платеж",
          "В) Подарок государству",
          "Г) Благотворительность"
        ],
        "correct_answer": "Б) Обязательный платеж",
        "points": 2,
        "question_order": 1
      }
    ]
  }
}
```

### 3. **Прохождение теста**
```http
POST /api/tests/:id/attempt
Authorization: Bearer <token>
Content-Type: application/json

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

**Ответ:**
```json
{
  "attempt": {
    "id": 1,
    "user_id": 3,
    "test_id": 1,
    "score": 12,
    "percentage": "100.00",
    "passed": true,
    "answers": [
      {
        "points": 2,
        "isCorrect": true,
        "questionId": 1,
        "userAnswer": "Б) Обязательный платеж",
        "correctAnswer": "Б) Обязательный платеж"
      }
    ],
    "completed_at": "2025-09-14T19:03:53.170Z",
    "created_at": "2025-09-14T19:03:53.170Z"
  },
  "score": 12,
  "maxScore": 12,
  "percentage": 100,
  "passed": true,
  "answerResults": [
    {
      "questionId": 1,
      "userAnswer": "Б) Обязательный платеж",
      "correctAnswer": "Б) Обязательный платеж",
      "isCorrect": true,
      "points": 2
    }
  ]
}
```

### 4. **Получение попыток теста**
```http
GET /api/tests/:id/attempts
Authorization: Bearer <token>
```

## 🎓 Интеграция с уроками

### Получение уроков типа TEST
```http
GET /api/lessons?lessonType=TEST
Authorization: Bearer <token>
```

**Ответ:**
```json
{
  "lessons": [
    {
      "id": 49,
      "title": "Итоговый тест по основам налогообложения",
      "content": "Проверьте свои знания по всему курсу основ налогообложения",
      "lesson_type": "TEST",
      "test_id": 1,
      "duration": 30,
      "module_title": "Модуль 1: Введение в налогообложение",
      "course_title": "Основы налогообложения",
      "navigationUrl": "/lesson/49/test",
      "access": {
        "isAccessible": true,
        "isLocked": false,
        "type": "TEST",
        "label": "Тест",
        "icon": "clipboard-check"
      }
    }
  ]
}
```

### Навигация к тесту
```http
GET /api/lessons/:id/navigate
Authorization: Bearer <token>
```

## 🏗️ Структура фронтенда

### 1. **Страницы для тестов**

#### A. Список тестов
**Путь:** `/dashboard/tests`
**Компонент:** `TestsListPage`
```typescript
// Пример использования
const { data: tests } = useQuery({
  queryKey: ["tests"],
  queryFn: () => TestService.getAllTests(token)
});
```

#### B. Страница прохождения теста
**Путь:** `/dashboard/tests/[testId]`
**Компонент:** `TestPage`
```typescript
// Пример использования
const { data: test } = useQuery({
  queryKey: ["test", testId],
  queryFn: () => TestService.getTestById(testId, token)
});
```

#### C. Интеграция в курс
**Путь:** `/dashboard/myEducation/[courseId]/module/[moduleId]/test/[testId]`
**Компонент:** `CourseTestPage`

### 2. **Компоненты**

#### A. TestCard - карточка теста
```typescript
interface TestCardProps {
  test: {
    id: number;
    title: string;
    description: string;
    time_limit: number;
    passing_score: number;
    course_title: string;
    module_title: string;
  };
  onStart: (testId: number) => void;
}
```

#### B. TestQuestion - вопрос теста
```typescript
interface TestQuestionProps {
  question: {
    id: number;
    question_text: string;
    options: string[];
    points: number;
  };
  selectedAnswer?: string;
  onSelect: (questionId: number, answer: string) => void;
  disabled?: boolean;
}
```

#### C. TestResults - результаты теста
```typescript
interface TestResultsProps {
  result: {
    score: number;
    maxScore: number;
    percentage: number;
    passed: boolean;
    answerResults: Array<{
      questionId: number;
      userAnswer: string;
      correctAnswer: string;
      isCorrect: boolean;
      points: number;
    }>;
  };
  onRetake: () => void;
  onBack: () => void;
}
```

### 3. **Сервисы**

#### TestService
```typescript
export const TestService = {
  // Получить все тесты
  getAllTests: async (token: string) => {
    const res = await fetch(`${BACKEND_URL}/api/tests`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return res.json();
  },

  // Получить тест по ID
  getTestById: async (testId: string, token: string) => {
    const res = await fetch(`${BACKEND_URL}/api/tests/${testId}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return res.json();
  },

  // Отправить ответы
  submitTestAnswers: async (testId: string, token: string, answers: SubmitAnswer[]) => {
    const res = await fetch(`${BACKEND_URL}/api/tests/${testId}/attempt`, {
      method: 'POST',
      headers: { 
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ answers })
    });
    return res.json();
  },

  // Получить попытки
  getTestAttempts: async (testId: string, token: string) => {
    const res = await fetch(`${BACKEND_URL}/api/tests/${testId}/attempts`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return res.json();
  }
};
```

### 4. **Типы TypeScript**

```typescript
export interface Test {
  id: number;
  lesson_id: number;
  title: string;
  description: string;
  time_limit: number;
  passing_score: number;
  created_at: string;
  updated_at: string;
  questions?: TestQuestion[];
  lesson_title?: string;
  module_title?: string;
  course_title?: string;
}

export interface TestQuestion {
  id: number;
  question_text: string;
  question_type: "multiple_choice";
  options: string[];
  correct_answer: string;
  points: number;
  question_order: number;
}

export interface SubmitAnswer {
  questionId: number;
  answer: string;
}

export interface TestAttempt {
  id: number;
  user_id: number;
  test_id: number;
  score: number;
  percentage: string;
  passed: boolean;
  answers: Array<{
    points: number;
    isCorrect: boolean;
    questionId: number;
    userAnswer: string;
    correctAnswer: string;
  }>;
  completed_at: string;
  created_at: string;
}
```

## 🎨 UI/UX Рекомендации

### 1. **Список тестов**
- Отображение тестов в виде карточек
- Показ информации о курсе и модуле
- Индикатор времени и проходного балла
- Кнопка "Начать тест"

### 2. **Страница теста**
- Таймер обратного отсчета
- Прогресс-бар (текущий вопрос / общее количество)
- Навигация между вопросами
- Возможность пропустить вопрос
- Кнопка "Завершить тест"

### 3. **Результаты теста**
- Общий результат (прошел/не прошел)
- Количество баллов и процент
- Разбор каждого вопроса
- Кнопка "Повторить тест"
- Кнопка "Вернуться к курсу"

## 🔄 Интеграция с существующими уроками

### 1. **Обновление LessonCard**
```typescript
// Добавить поддержку типа TEST
const getLessonLink = (lesson: Lesson) => {
  if (lesson.lesson_type === 'TEST' && lesson.test_id) {
    return `/dashboard/myEducation/${courseId}/module/${moduleId}/test/${lesson.test_id}`;
  }
  return `/dashboard/myEducation/${courseId}/module/${moduleId}/lesson/${lesson.id}`;
};

// Добавить иконку для тестов
const getLessonIcon = (lesson: Lesson) => {
  switch (lesson.lesson_type) {
    case 'TEST':
      return 'material-symbols:quiz';
    case 'VIDEO':
      return 'material-symbols:play-circle';
    default:
      return 'material-symbols:play-circle';
  }
};
```

### 2. **Обновление типов Lesson**
```typescript
interface Lesson {
  // ... существующие поля
  lesson_type?: 'VIDEO' | 'TEST' | 'READING' | 'ASSIGNMENT' | 'LIVE_SESSION' | 'QUIZ';
  test_id?: number | null;
  navigationUrl?: string;
  access?: {
    isAccessible: boolean;
    isLocked: boolean;
    type: string;
    label: string;
    icon: string;
  };
}
```

## 🚀 Пошаговая интеграция

### Шаг 1: Создать сервисы
1. Создать `src/services/test.ts`
2. Добавить методы для работы с API тестов
3. Создать типы в `src/types/test.ts`

### Шаг 2: Создать компоненты
1. `TestCard` - карточка теста
2. `TestQuestion` - компонент вопроса
3. `TestResults` - результаты теста
4. `TestTimer` - таймер теста

### Шаг 3: Создать страницы
1. `/dashboard/tests` - список тестов
2. `/dashboard/tests/[testId]` - прохождение теста
3. Интегрировать в существующие страницы курсов

### Шаг 4: Обновить навигацию
1. Добавить ссылки на тесты в меню
2. Обновить компоненты уроков для поддержки тестов
3. Добавить роутинг для тестов

### Шаг 5: Тестирование
1. Протестировать все API endpoints
2. Проверить UI/UX
3. Протестировать интеграцию с курсами

## 📱 Примеры использования

### Получение тестов курса
```typescript
const { data: lessons } = useQuery({
  queryKey: ["lessons", courseId, "TEST"],
  queryFn: () => LessonService.getLessonsByType("TEST", courseId, token)
});

const testLessons = lessons?.filter(lesson => lesson.lesson_type === 'TEST');
```

### Начало теста
```typescript
const startTest = (testId: number) => {
  router.push(`/dashboard/tests/${testId}`);
};
```

### Отправка ответов
```typescript
const submitAnswers = async (answers: SubmitAnswer[]) => {
  const result = await TestService.submitTestAnswers(testId, token, answers);
  setTestResult(result);
};
```

## 🔧 Настройка окружения

### Переменные окружения
```env
NEXT_PUBLIC_API_URL=http://localhost:5001
```

### Зависимости (если нужны)
```json
{
  "dependencies": {
    "@tanstack/react-query": "^4.0.0",
    "react-router-dom": "^6.0.0"
  }
}
```

## 📊 Статистика и аналитика

### Отслеживание прогресса
- Количество пройденных тестов
- Средний балл по тестам
- Время прохождения тестов
- Попытки прохождения

### Интеграция с сертификатами
- Автоматическое создание сертификатов после прохождения тестов
- Условия получения сертификатов
- Отслеживание прогресса курса

## 🎯 Заключение

Backend API полностью готов для интеграции тестов. Все необходимые endpoints реализованы и протестированы. Фронтенд может быть интегрирован пошагово, начиная с базовых компонентов и постепенно добавляя более сложную функциональность.

**Готовые API endpoints:**
- ✅ `GET /api/tests` - список тестов
- ✅ `GET /api/tests/:id` - детали теста
- ✅ `POST /api/tests/:id/attempt` - прохождение теста
- ✅ `GET /api/tests/:id/attempts` - попытки теста
- ✅ `GET /api/lessons?lessonType=TEST` - уроки типа TEST
- ✅ `GET /api/lessons/:id/navigate` - навигация к тесту

**Дополнительные возможности:**
- ✅ Интеграция с уроками
- ✅ Система блокировки уроков
- ✅ Различные типы уроков
- ✅ Автоматическое создание сертификатов
- ✅ Отслеживание прогресса

Система готова к использованию! 🚀
