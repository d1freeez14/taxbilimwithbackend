# Статистика курсов и модулей - Руководство по использованию

## 🎯 Что добавлено

### 1. **Статистика курсов**
- Количество модулей (`module_count`)
- Количество видеоуроков (`lesson_count`) 
- Общая длительность в минутах (`total_duration`)

### 2. **Статистика модулей**
- Количество видеоуроков (`lesson_count`)
- Количество заданий (`assignment_count`)
- Общая длительность в минутах (`total_duration`)
- Длительность в неделях (`duration_weeks`)

### 3. **Форматирование на русском языке**
- Автоматическое форматирование времени (например: "12 часов 30 минут")
- Готовые тексты для отображения (например: "5 модулей, 78 видеоуроков, 12 часов 30 минут")

## 🚀 Быстрый старт

### 1. Запустите миграцию
```bash
cd backend
node src/scripts/update-course-statistics.js
```

### 2. Используйте новые API endpoints

#### Получить список курсов со статистикой
```bash
GET /api/courses
```

#### Получить детальную информацию о курсе
```bash
GET /api/courses/{id}
```

#### Получить модули курса со статистикой
```bash
GET /api/modules/course/{courseId}
```

#### Рассчитать статистику курса
```bash
POST /api/courses/{id}/statistics/calculate
```

## 📊 Примеры ответов API

### Список курсов
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
  ]
}
```

### Детальная информация о курсе
```json
{
  "course": {
    "id": 1,
    "title": "Основы налогообложения",
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

## 🎨 Использование во фронтенде

### Отображение статистики курса
```jsx
function CourseCard({ course }) {
  return (
    <div className="course-card">
      <h3>{course.title}</h3>
      <div className="course-stats">
        <div className="stat-item">
          <Icon name="modules" />
          <span>{course.statistics.moduleCount} модулей</span>
        </div>
        <div className="stat-item">
          <Icon name="video" />
          <span>{course.statistics.lessonCount} видеоуроков</span>
        </div>
        <div className="stat-item">
          <Icon name="clock" />
          <span>{course.statistics.formattedDuration}</span>
        </div>
      </div>
      <p className="course-summary">{course.summaryText}</p>
    </div>
  );
}
```

### Отображение программы курса
```jsx
function CourseProgram({ course }) {
  return (
    <div className="course-program">
      <h2>Программа курса</h2>
      <div className="course-overview">
        <span>{course.summaryText}</span>
      </div>
      
      {course.modules.map(module => (
        <div key={module.id} className="module-card">
          <h3>{module.title}</h3>
          <p>{module.summaryText}</p>
          <div className="module-details">
            <span>{module.statistics.formattedDuration}</span>
            <span>{module.statistics.durationWeeks} недель</span>
          </div>
        </div>
      ))}
    </div>
  );
}
```

## 🔧 Технические детали

### База данных
- Все поля статистики имеют значения по умолчанию (0)
- Статистика автоматически пересчитывается при изменении модулей/уроков
- Поля индексированы для быстрого поиска

### API
- Все endpoints возвращают форматированные данные
- Статистика кэшируется в базе данных
- Поддержка Swagger документации

### Форматирование
- Автоматическое склонение на русском языке
- Поддержка различных форматов времени
- Готовые тексты для UI

## 📝 Обновление существующих данных

Если у вас уже есть курсы и модули, запустите миграцию:

```bash
# Перейти в папку backend
cd backend

# Запустить миграцию
node src/scripts/update-course-statistics.js
```

Миграция:
1. Добавит новые колонки в таблицы
2. Рассчитает статистику для всех существующих курсов и модулей
3. Обновит данные в базе

## 🎯 Следующие шаги

1. **Запустите миграцию** для обновления существующих данных
2. **Обновите фронтенд** для отображения новой статистики
3. **Используйте новые API endpoints** для получения статистики
4. **Настройте автоматический пересчет** статистики при изменении контента

## 📞 Поддержка

Если у вас возникли вопросы или проблемы:
1. Проверьте логи миграции
2. Убедитесь, что база данных обновлена
3. Проверьте Swagger документацию: `/api-docs`
