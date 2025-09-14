# ✅ Решение: Как определить наличие тестов в модулях

## Проблема
Команда в базе данных показывала наличие тестов в модуле 1, но API `/api/courses/1` не отображал эту информацию.

## Решение
Обновлены API endpoints для включения информации о тестах в модулях.

## 🎯 Теперь доступно

### 1. В API курсов (`/api/courses/:id`)
```json
{
  "course": {
    "modules": [
      {
        "id": 1,
        "title": "Модуль 1: Введение в налогообложение",
        "hasTests": true,
        "testCount": 1,
        "testTitles": ["Тест по основам налогообложения"],
        "lessons": [
          {
            "id": 49,
            "title": "Итоговый тест по основам налогообложения",
            "lesson_type": "TEST",
            "test_id": 1
          }
        ]
      }
    ]
  }
}
```

### 2. В API модулей (`/api/modules/course/:courseId`)
```json
{
  "modules": [
    {
      "id": 1,
      "title": "Модуль 1: Введение в налогообложение",
      "hasTests": true,
      "testCount": 1,
      "testTitles": ["Тест по основам налогообложения"]
    }
  ]
}
```

### 3. Специальные endpoints для тестов
- `GET /api/modules/:id/tests` - получить все тесты модуля
- `GET /api/modules/:id/tests/summary` - получить сводку по тестам

## 🔍 Как использовать

### JavaScript пример
```javascript
// Проверить, есть ли тесты в модуле
const module = course.modules[0];
if (module.hasTests) {
  console.log(`В модуле ${module.title} есть ${module.testCount} тест(ов)`);
  console.log('Тесты:', module.testTitles);
}

// Найти уроки-тесты
const testLessons = module.lessons.filter(lesson => lesson.lesson_type === 'TEST');
console.log('Уроки-тесты:', testLessons);
```

### React компонент
```jsx
const ModuleCard = ({ module }) => (
  <div className="module-card">
    <h3>{module.title}</h3>
    {module.hasTests && (
      <div className="tests-indicator">
        📝 {module.testCount} тест{module.testCount > 1 ? 'ов' : ''}
      </div>
    )}
  </div>
);
```

## ✅ Результат
Теперь API курсов корректно показывает:
- `hasTests` - есть ли тесты в модуле
- `testCount` - количество тестов
- `testTitles` - названия тестов
- Уроки с `lesson_type: "TEST"` и соответствующим `test_id`

**Проблема решена!** 🎉
