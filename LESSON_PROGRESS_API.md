# 📊 API Отслеживания Прогресса Уроков

## 🎯 Обзор

Добавлено поле `is_finished` для каждого урока, которое позволяет отслеживать прогресс прохождения пользователем. Это поле автоматически вычисляется на основе данных из таблицы `lesson_progress`.

## 🔗 API Endpoints

### 1. **Получение уроков с прогрессом**

#### Все уроки с прогрессом
```http
GET /api/lessons?userId={userId}
Authorization: Bearer <token>
```

**Параметры:**
- `userId` (опционально) - ID пользователя для получения прогресса

**Ответ:**
```json
{
  "lessons": [
    {
      "id": 1,
      "title": "Урок 1: Что такое налоги",
      "lesson_type": "VIDEO",
      "is_finished": true,
      "is_unlocked": false,
      "access": {
        "isAccessible": true,
        "isLocked": false,
        "type": "VIDEO",
        "label": "Видеоурок",
        "icon": "play-circle"
      },
      "navigationUrl": "/lesson/1/video",
      "typeLabel": "Видеоурок",
      "typeIcon": "play-circle"
    }
  ]
}
```

#### Уроки модуля с прогрессом
```http
GET /api/lessons/module/{moduleId}
Authorization: Bearer <token>
```

**Ответ:** Аналогично выше, но только уроки указанного модуля.

#### Конкретный урок с прогрессом
```http
GET /api/lessons/{id}
Authorization: Bearer <token>
```

**Ответ:**
```json
{
  "lesson": {
    "id": 1,
    "title": "Урок 1: Что такое налоги",
    "is_finished": true,
    "is_unlocked": false,
    "access": { /* ... */ },
    "navigationUrl": "/lesson/1/video"
  }
}
```

### 2. **Управление прогрессом уроков**

#### Отметить урок как завершенный
```http
POST /api/lessons/{id}/complete
Authorization: Bearer <token>
```

**Ответ:**
```json
{
  "message": "Lesson marked as completed.",
  "progress": {
    "id": 1,
    "user_id": 3,
    "lesson_id": 1,
    "completed": true,
    "completed_at": "2025-09-14T19:27:47.987Z",
    "created_at": "2025-09-14T19:27:47.987Z",
    "updated_at": "2025-09-14T19:27:47.987Z"
  }
}
```

#### Отметить урок как незавершенный
```http
POST /api/lessons/{id}/incomplete
Authorization: Bearer <token>
```

**Ответ:**
```json
{
  "message": "Lesson marked as incomplete.",
  "progress": {
    "id": 1,
    "user_id": 3,
    "lesson_id": 1,
    "completed": false,
    "completed_at": null,
    "created_at": "2025-09-14T19:27:47.987Z",
    "updated_at": "2025-09-14T19:27:54.136Z"
  }
}
```

## 📊 Структура данных

### Поле `is_finished`
- **Тип:** `boolean`
- **Описание:** Показывает, завершен ли урок пользователем
- **Значения:**
  - `true` - урок завершен
  - `false` - урок не завершен или не начат

### Логика вычисления
```sql
CASE 
  WHEN userId IS NULL THEN false
  ELSE COALESCE(lp.completed, false)
END as is_finished
```

Где `lp.completed` - значение из таблицы `lesson_progress`.

## 🎯 Примеры использования

### 1. Получить все уроки с прогрессом пользователя
```bash
curl -H "Authorization: Bearer <token>" \
  "http://localhost:5001/api/lessons?userId=3"
```

### 2. Получить уроки модуля с прогрессом
```bash
curl -H "Authorization: Bearer <token>" \
  "http://localhost:5001/api/lessons/module/1"
```

### 3. Отметить урок как завершенный
```bash
curl -X POST \
  -H "Authorization: Bearer <token>" \
  "http://localhost:5001/api/lessons/1/complete"
```

### 4. Отметить урок как незавершенный
```bash
curl -X POST \
  -H "Authorization: Bearer <token>" \
  "http://localhost:5001/api/lessons/1/incomplete"
```

## 🔄 Интеграция с существующими функциями

### 1. **Автоматическое обновление прогресса**
- При прохождении теста автоматически отмечается урок как завершенный
- При просмотре видеоурока можно вручную отметить как завершенный
- При выполнении задания можно отметить как завершенный

### 2. **Расчет прогресса курса**
- Общий прогресс курса рассчитывается на основе завершенных уроков
- Прогресс модуля рассчитывается на основе завершенных уроков в модуле
- Статистика обновляется автоматически

### 3. **Система блокировки уроков**
- Уроки могут быть заблокированы до завершения предыдущих
- Поле `is_unlocked` определяет доступность урока
- Поле `is_finished` показывает статус завершения

## 📱 Frontend интеграция

### 1. **Отображение прогресса**
```typescript
interface Lesson {
  id: number;
  title: string;
  is_finished: boolean;
  is_unlocked: boolean;
  lesson_type: 'VIDEO' | 'TEST' | 'READING' | 'ASSIGNMENT' | 'LIVE_SESSION' | 'QUIZ';
  // ... другие поля
}

// Пример использования
const LessonCard = ({ lesson }: { lesson: Lesson }) => {
  return (
    <div className="lesson-card">
      <h3>{lesson.title}</h3>
      {lesson.is_finished && (
        <span className="completed-badge">✓ Завершен</span>
      )}
      {!lesson.is_unlocked && (
        <span className="locked-badge">🔒 Заблокирован</span>
      )}
    </div>
  );
};
```

### 2. **API вызовы**
```typescript
// Отметить урок как завершенный
const markLessonComplete = async (lessonId: number) => {
  const response = await fetch(`/api/lessons/${lessonId}/complete`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}` }
  });
  return response.json();
};

// Отметить урок как незавершенный
const markLessonIncomplete = async (lessonId: number) => {
  const response = await fetch(`/api/lessons/${lessonId}/incomplete`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}` }
  });
  return response.json();
};
```

### 3. **Отслеживание прогресса**
```typescript
// Получить прогресс модуля
const getModuleProgress = (lessons: Lesson[]) => {
  const completed = lessons.filter(lesson => lesson.is_finished).length;
  const total = lessons.length;
  return Math.round((completed / total) * 100);
};

// Получить прогресс курса
const getCourseProgress = (modules: Module[]) => {
  const allLessons = modules.flatMap(module => module.lessons);
  return getModuleProgress(allLessons);
};
```

## 🎨 UI/UX рекомендации

### 1. **Визуальные индикаторы**
- ✅ Зеленый чекбокс для завершенных уроков
- 🔒 Серый замок для заблокированных уроков
- ▶️ Обычная иконка для доступных уроков
- 📊 Прогресс-бар для модулей и курсов

### 2. **Интерактивность**
- Клик по уроку для перехода к содержимому
- Кнопка "Отметить как завершенный" для видеоуроков
- Автоматическое обновление прогресса после тестов
- Уведомления о завершении уроков

### 3. **Статистика**
- Общий прогресс курса в процентах
- Количество завершенных/общих уроков
- Время, потраченное на курс
- Достижения и сертификаты

## 🚀 Готово к использованию!

Все API endpoints протестированы и работают корректно:

✅ **Добавлено поле `is_finished`** во все endpoints уроков
✅ **API для управления прогрессом** (complete/incomplete)
✅ **Автоматическое вычисление прогресса** на основе `lesson_progress`
✅ **Интеграция с существующими функциями** (блокировка, навигация)
✅ **Полная документация** и примеры использования

Система готова для интеграции на фронтенде! 🎉
