# 🐳 Docker Workflow для TaxBilim

## ❌ Что НЕ нужно делать
```bash
# НЕ УДАЛЯЙТЕ контейнеры каждый раз!
docker compose down
docker compose up --build
```

## ✅ Правильный workflow

### 1. **Для изменений в коде (90% случаев)**
```bash
# Просто перезапустить backend
./scripts/dev.sh restart-backend

# Или вручную
docker compose restart backend
```

### 2. **Для изменений в зависимостях**
```bash
# Пересобрать backend
./scripts/dev.sh rebuild-backend

# Или вручную
docker compose up --build backend
```

### 3. **Для проверки статуса**
```bash
# Показать статус контейнеров
./scripts/dev.sh status

# Показать логи
./scripts/dev.sh logs-backend
```

## 🚀 Удобные команды

### **Скрипт `./scripts/dev.sh`:**
```bash
./scripts/dev.sh restart          # Перезапустить все
./scripts/dev.sh restart-backend  # Перезапустить только backend
./scripts/dev.sh restart-frontend # Перезапустить только frontend
./scripts/dev.sh rebuild          # Пересобрать все
./scripts/dev.sh rebuild-backend  # Пересобрать только backend
./scripts/dev.sh logs             # Показать все логи
./scripts/dev.sh logs-backend     # Показать логи backend
./scripts/dev.sh status           # Показать статус
./scripts/dev.sh clean            # Остановить контейнеры
./scripts/dev.sh clean-all        # Остановить и удалить все
```

### **Ручные команды:**
```bash
# Перезапуск
docker compose restart
docker compose restart backend
docker compose restart frontend

# Пересборка
docker compose up --build
docker compose up --build backend

# Логи
docker compose logs -f
docker compose logs -f backend

# Статус
docker compose ps
```

## 🔄 Типичные сценарии

### **Сценарий 1: Изменили код в backend**
```bash
# 1. Внесли изменения в backend/src/
# 2. Перезапустить backend
./scripts/dev.sh restart-backend

# 3. Проверить логи
./scripts/dev.sh logs-backend
```

### **Сценарий 2: Добавили новую зависимость**
```bash
# 1. Добавили в backend/package.json
# 2. Пересобрать backend
./scripts/dev.sh rebuild-backend
```

### **Сценарий 3: Изменили frontend**
```bash
# 1. Внесли изменения в frontend/
# 2. Перезапустить frontend
./scripts/dev.sh restart-frontend
```

### **Сценарий 4: Проблемы с кэшем**
```bash
# 1. Остановить все
./scripts/dev.sh clean

# 2. Пересобрать без кэша
docker compose build --no-cache
docker compose up
```

## 🎯 Почему это работает

Ваш `docker-compose.yml` настроен с volume mapping:
```yaml
volumes:
  - ./backend:/app          # Код монтируется в контейнер
  - /app/node_modules       # node_modules изолированы
```

Это означает:
- ✅ Изменения в коде **автоматически** попадают в контейнер
- ✅ `node_modules` остаются в контейнере
- ✅ Нужно только **перезапустить** для применения изменений

## 🚨 Когда нужно пересобирать

### **Перезапуск достаточно для:**
- Изменения в `.js`, `.ts`, `.json` файлах
- Изменения в конфигурации
- Изменения в API endpoints
- Изменения в логике приложения

### **Пересборка нужна для:**
- Изменения в `package.json` (новые зависимости)
- Изменения в `Dockerfile`
- Изменения в `docker-compose.yml`
- Проблемы с кэшем

## 📊 Мониторинг

### **Проверить статус:**
```bash
./scripts/dev.sh status
```

### **Посмотреть логи:**
```bash
# Все логи
./scripts/dev.sh logs

# Только backend
./scripts/dev.sh logs-backend

# Только frontend
docker compose logs -f frontend
```

### **Проверить здоровье:**
```bash
# Backend health
curl http://localhost:5001/api/health

# Frontend
curl http://localhost:3000
```

## 🧹 Очистка (редко нужно)

### **Остановить контейнеры:**
```bash
./scripts/dev.sh clean
```

### **Полная очистка (только при проблемах):**
```bash
./scripts/dev.sh clean-all
```

## 💡 Советы

1. **Используйте скрипт** `./scripts/dev.sh` для удобства
2. **Перезапуск** быстрее пересборки
3. **Логи** помогают отладить проблемы
4. **Статус** показывает состояние контейнеров
5. **Не удаляйте** контейнеры без необходимости

## 🎉 Результат

Теперь вы можете:
- ✅ Быстро применять изменения в коде
- ✅ Не пересобирать контейнеры каждый раз
- ✅ Эффективно работать с Docker
- ✅ Легко отлаживать проблемы
