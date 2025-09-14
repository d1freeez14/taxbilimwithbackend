# Новые функции уроков - Руководство по использованию

## 🎯 Что добавлено

### 1. **Описание автора**
- Добавлено поле `description` для авторов
- Дополнительная информация об авторе курса

### 2. **Статус записи курса**
- Добавлено поле `is_recorded` в enrollments
- Различие между записанными и живыми курсами

### 3. **Система блокировки уроков**
- Поле `locked` для уроков
- Последовательное прохождение уроков
- Первый урок всегда разблокирован
- Следующие уроки разблокируются после завершения предыдущих

### 4. **Типы уроков**
- `VIDEO` - Видеоуроки
- `TEST` - Тесты и квизы
- `READING` - Материалы для чтения
- `ASSIGNMENT` - Задания
- `LIVE_SESSION` - Живые сессии
- `QUIZ` - Интерактивные квизы

### 5. **Изображения уроков**
- Поле `image` для превью уроков
- Поддержка кастомных изображений

### 6. **Интеграция тестов**
- Тесты отображаются как уроки
- Поле `test_id` для связи с тестами
- Поле `url` для кастомных URL навигации

## 🚀 Быстрый старт

### 1. Запустите миграцию
```bash
cd backend
node src/scripts/add-lesson-features.js
```

### 2. Используйте новые API endpoints

#### Получить уроки модуля
```bash
GET /api/lessons/module/{moduleId}
```

#### Создать урок
```bash
POST /api/lessons
```

#### Получить типы уроков
```bash
GET /api/lessons/types
```

#### Создать тест
```bash
POST /api/tests
```

## 📊 Примеры использования

### Создание видеоурока
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

### Создание теста как урока
```javascript
// Сначала создаем тест
const testResponse = await fetch('/api/tests', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  },
  body: JSON.stringify({
    title: 'Тест по основам налогообложения',
    description: 'Проверьте свои знания',
    timeLimit: 30,
    passingScore: 70
  })
});

const { test } = await testResponse.json();

// Затем создаем урок-тест
const lessonResponse = await fetch('/api/lessons', {
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
    testId: test.id,
    locked: true
  })
});
```

### Проверка доступа к уроку
```javascript
const response = await fetch('/api/lessons/lesson_123');
const { lesson } = await response.json();

if (lesson.access.isAccessible) {
  // Урок доступен
  window.location.href = lesson.navigationUrl;
} else {
  // Урок заблокирован
  alert(lesson.access.reason);
}
```

## 🎨 Интеграция во фронтенде

### Компонент урока
```jsx
function LessonCard({ lesson }) {
  const { access, navigationUrl, typeLabel, typeIcon } = lesson;
  
  return (
    <div className={`lesson-card ${access.isLocked ? 'locked' : ''}`}>
      <div className="lesson-icon">
        <Icon name={typeIcon} />
      </div>
      <h3>{lesson.title}</h3>
      <p>{typeLabel}</p>
      {lesson.image && (
        <img src={lesson.image} alt={lesson.title} />
      )}
      {access.isLocked && (
        <p className="locked-message">{access.reason}</p>
      )}
      <a 
        href={navigationUrl} 
        disabled={!access.isAccessible}
        className={access.isAccessible ? 'enabled' : 'disabled'}
      >
        {access.isAccessible ? 'Начать урок' : 'Заблокировано'}
      </a>
    </div>
  );
}
```

### Список типов уроков
```jsx
function LessonTypeSelector({ onTypeSelect }) {
  const [lessonTypes, setLessonTypes] = useState([]);
  
  useEffect(() => {
    fetch('/api/lessons/types')
      .then(res => res.json())
      .then(data => setLessonTypes(data.lessonTypes));
  }, []);
  
  return (
    <select onChange={(e) => onTypeSelect(e.target.value)}>
      {lessonTypes.map(type => (
        <option key={type.type} value={type.type}>
          {type.label}
        </option>
      ))}
    </select>
  );
}
```

### Интеграция тестов
```jsx
function TestLesson({ lesson }) {
  const [test, setTest] = useState(null);
  
  useEffect(() => {
    if (lesson.test_id) {
      fetch(`/api/tests/${lesson.test_id}`)
        .then(res => res.json())
        .then(data => setTest(data.test));
    }
  }, [lesson.test_id]);
  
  return (
    <div className="test-lesson">
      <h3>{lesson.title}</h3>
      {test && (
        <div className="test-info">
          <p>Время: {test.time_limit} минут</p>
          <p>Проходной балл: {test.passing_score}%</p>
          <p>Вопросов: {test.questions.length}</p>
        </div>
      )}
      <a href={lesson.navigationUrl}>
        Пройти тест
      </a>
    </div>
  );
}
```

## 🔧 Настройка блокировки уроков

### Автоматическая блокировка
```javascript
// Уроки автоматически блокируются если:
// 1. locked = true
// 2. order > 1 (не первый урок)
// 3. Предыдущий урок не завершен

const checkLessonAccess = async (lessonId, userId) => {
  const response = await fetch(`/api/lessons/${lessonId}`);
  const { lesson } = await response.json();
  
  return lesson.access.isAccessible;
};
```

### Ручная блокировка
```javascript
// Заблокировать урок
const lockLesson = async (lessonId) => {
  await fetch(`/api/lessons/${lessonId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify({ locked: true })
  });
};
```

## 📝 Типы уроков и их URL

| Тип | URL | Описание |
|-----|-----|----------|
| VIDEO | `/lesson/{id}/video` | Видеоурок |
| TEST | `/lesson/{id}/test` | Тест |
| READING | `/lesson/{id}/reading` | Материал для чтения |
| ASSIGNMENT | `/lesson/{id}/assignment` | Задание |
| LIVE_SESSION | `/lesson/{id}/live` | Живая сессия |
| QUIZ | `/lesson/{id}/quiz` | Квиз |

## 🎯 Следующие шаги

1. **Запустите миграцию** для добавления новых полей
2. **Обновите фронтенд** для поддержки новых типов уроков
3. **Настройте блокировку** уроков для последовательного прохождения
4. **Интегрируйте тесты** как отдельный тип уроков
5. **Добавьте изображения** для уроков

## 📞 Поддержка

Если у вас возникли вопросы:
1. Проверьте логи миграции
2. Убедитесь, что все поля добавлены в базу данных
3. Проверьте Swagger документацию: `/api-docs`
4. См. подробную документацию: `LESSON_FEATURES_API.md`
