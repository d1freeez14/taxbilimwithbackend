# API Документация - Сертификаты

## Обзор

API для управления сертификатами в системе TaxBilim. Поддерживает создание, просмотр, верификацию и управление сертификатами.

## Базовый URL
```
http://localhost:5001/api/certificates
```

## Аутентификация

Большинство endpoints требуют JWT токен в заголовке:
```
Authorization: Bearer <your-jwt-token>
```

**Исключения:** `/verify/:code` - публичный endpoint

## Endpoints

### 1. Получить сертификаты пользователя
```http
GET /my-certificates
```

**Аутентификация:** Требуется

**Параметры запроса:**
- `search` (string, optional) - Поиск по названию или дате
- `status` (string, optional) - Фильтр по статусу (ACTIVE, INACTIVE, REVOKED)
- `type` (string, optional) - Фильтр по типу (COMPLETION, ACHIEVEMENT, PARTICIPATION, CUSTOM)
- `sortBy` (string, optional) - Сортировка (issued_at, title, completion_date, created_at)
- `sortOrder` (string, optional) - Порядок сортировки (ASC, DESC)

**Пример запроса:**
```bash
curl "http://localhost:5001/api/certificates/my-certificates?search=налог&sortBy=issued_at&sortOrder=DESC" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

**Пример ответа:**
```json
{
  "certificates": [
    {
      "id": 3,
      "user_id": 3,
      "course_id": 1,
      "title": "Сертифицированный Налоговый консультант по вопросам имущества",
      "description": "Данный сертификат подтверждает успешное прохождение курса...",
      "certificate_type": "COMPLETION",
      "instructor_name": "Лана Б.",
      "completion_date": "2024-01-20T00:00:00.000Z",
      "certificate_number": "CERT-1757878696064-DK3DBVPSF",
      "verification_code": "DCB2DF388547CB5E",
      "is_verified": false,
      "pdf_url": "/api/certificates/3_1_1757878696064.pdf",
      "share_url": "http://localhost:3000/certificates/verify/DCB2DF388547CB5E",
      "status": "ACTIVE",
      "issued_at": "2025-09-14T19:38:16.064Z",
      "updated_at": "2025-09-14T19:38:16.064Z",
      "course_title": "Основы налогообложения",
      "course_image": "/coursePlaceholder.png",
      "course_description": "Комплексный курс по основам налогообложения...",
      "author_name": "Лана Б.",
      "author_avatar": "/avatars.png"
    }
  ]
}
```

### 2. Получить конкретный сертификат
```http
GET /:id
```

**Аутентификация:** Требуется

**Параметры:**
- `id` (integer) - ID сертификата

**Пример запроса:**
```bash
curl "http://localhost:5001/api/certificates/3" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### 3. Создать сертификат
```http
POST /generate/:courseId
```

**Аутентификация:** Требуется

**Параметры:**
- `courseId` (integer) - ID курса

**Тело запроса:**
```json
{
  "title": "Название сертификата",
  "description": "Описание сертификата",
  "certificateType": "COMPLETION",
  "instructorName": "Имя инструктора",
  "completionDate": "2024-01-20"
}
```

**Пример запроса:**
```bash
curl -X POST "http://localhost:5001/api/certificates/generate/1" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Сертификат о прохождении курса",
    "description": "Описание сертификата",
    "certificateType": "COMPLETION"
  }'
```

### 4. Скачать сертификат
```http
GET /:id/download
```

**Аутентификация:** Требуется

**Параметры:**
- `id` (integer) - ID сертификата

**Пример запроса:**
```bash
curl "http://localhost:5001/api/certificates/3/download" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### 5. Получить ссылку для sharing
```http
GET /:id/share
```

**Аутентификация:** Требуется

**Параметры:**
- `id` (integer) - ID сертификата

**Пример запроса:**
```bash
curl "http://localhost:5001/api/certificates/3/share" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

**Пример ответа:**
```json
{
  "shareUrl": "http://localhost:3000/certificates/verify/DCB2DF388547CB5E",
  "verificationCode": "DCB2DF388547CB5E",
  "certificateNumber": "CERT-1757878696064-DK3DBVPSF"
}
```

### 6. Верифицировать сертификат (публичный)
```http
GET /verify/:code
```

**Аутентификация:** Не требуется

**Параметры:**
- `code` (string) - Код верификации

**Пример запроса:**
```bash
curl "http://localhost:5001/api/certificates/verify/DCB2DF388547CB5E"
```

**Пример ответа:**
```json
{
  "certificate": {
    "id": 3,
    "title": "Сертифицированный Налоговый консультант по вопросам имущества",
    "description": "Данный сертификат подтверждает успешное прохождение курса...",
    "certificate_type": "COMPLETION",
    "instructor_name": "Лана Б.",
    "completion_date": "2024-01-20T00:00:00.000Z",
    "certificate_number": "CERT-1757878696064-DK3DBVPSF",
    "verification_code": "DCB2DF388547CB5E",
    "status": "ACTIVE",
    "course_title": "Основы налогообложения",
    "author_name": "Лана Б.",
    "user_name": "Student User",
    "user_email": "student@taxbilim.com"
  },
  "isValid": true,
  "message": "Certificate verified successfully"
}
```

### 7. Обновить сертификат (ADMIN/TEACHER)
```http
PUT /:id
```

**Аутентификация:** Требуется (ADMIN/TEACHER)

**Параметры:**
- `id` (integer) - ID сертификата

**Тело запроса:**
```json
{
  "title": "Новое название",
  "description": "Новое описание",
  "certificateType": "ACHIEVEMENT",
  "status": "ACTIVE",
  "instructorName": "Новое имя инструктора",
  "completionDate": "2024-02-01"
}
```

### 8. Удалить сертификат (ADMIN)
```http
DELETE /:id
```

**Аутентификация:** Требуется (ADMIN)

**Параметры:**
- `id` (integer) - ID сертификата

### 9. Получить статистику сертификатов (ADMIN)
```http
GET /stats/overview
```

**Аутентификация:** Требуется (ADMIN)

**Пример запроса:**
```bash
curl "http://localhost:5001/api/certificates/stats/overview" \
  -H "Authorization: Bearer ADMIN_TOKEN"
```

**Пример ответа:**
```json
{
  "statistics": {
    "total_certificates": "3",
    "active_certificates": "3",
    "inactive_certificates": "0",
    "revoked_certificates": "0",
    "completion_certificates": "2",
    "achievement_certificates": "1",
    "certificates_last_30_days": "3",
    "certificates_last_7_days": "3"
  }
}
```

### 10. Получить все сертификаты (ADMIN)
```http
GET /
```

**Аутентификация:** Требуется (ADMIN)

**Параметры запроса:**
- `search` (string, optional) - Поиск
- `status` (string, optional) - Фильтр по статусу
- `type` (string, optional) - Фильтр по типу
- `page` (integer, optional) - Номер страницы (по умолчанию 1)
- `limit` (integer, optional) - Количество на странице (по умолчанию 10)

## Типы сертификатов

- `COMPLETION` - Сертификат о завершении курса
- `ACHIEVEMENT` - Сертификат о достижении
- `PARTICIPATION` - Сертификат об участии
- `CUSTOM` - Пользовательский сертификат

## Статусы сертификатов

- `ACTIVE` - Активный
- `INACTIVE` - Неактивный
- `REVOKED` - Отозванный

## Коды ошибок

- `400` - Неверный запрос
- `401` - Не авторизован
- `403` - Недостаточно прав
- `404` - Сертификат не найден
- `500` - Внутренняя ошибка сервера

## Примеры использования

### Создание сертификата после завершения курса

```javascript
// 1. Проверить, что пользователь завершил курс
const courseProgress = await fetch('/api/progress/course/1', {
  headers: { 'Authorization': `Bearer ${token}` }
});

// 2. Создать сертификат
const certificate = await fetch('/api/certificates/generate/1', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    title: 'Сертификат о прохождении курса "Основы налогообложения"',
    description: 'Подтверждает успешное завершение курса',
    certificateType: 'COMPLETION'
  })
});
```

### Верификация сертификата на фронтенде

```javascript
// Получить код верификации из URL
const verificationCode = window.location.pathname.split('/').pop();

// Проверить сертификат
const response = await fetch(`/api/certificates/verify/${verificationCode}`);
const data = await response.json();

if (data.isValid) {
  // Показать данные сертификата
  displayCertificate(data.certificate);
} else {
  // Показать ошибку
  showError('Сертификат не найден или недействителен');
}
```

## Тестовые данные

В системе уже созданы тестовые сертификаты:

1. **Сертифицированный Налоговый консультант по вопросам имущества**
   - Код верификации: `DCB2DF388547CB5E`
   - Тип: COMPLETION
   - Статус: ACTIVE

2. **Специалист по НДС для бизнеса**
   - Код верификации: `FF3FADD68BEB9647`
   - Тип: ACHIEVEMENT
   - Статус: ACTIVE

3. **Эксперт по налоговому планированию**
   - Код верификации: `96B266AE1F70893B`
   - Тип: COMPLETION
   - Статус: ACTIVE

## Интеграция с фронтендом

### Компонент списка сертификатов

```jsx
const CertificatesList = () => {
  const [certificates, setCertificates] = useState([]);
  
  useEffect(() => {
    fetch('/api/certificates/my-certificates', {
      headers: { 'Authorization': `Bearer ${token}` }
    })
    .then(res => res.json())
    .then(data => setCertificates(data.certificates));
  }, []);

  return (
    <div className="certificates-grid">
      {certificates.map(cert => (
        <CertificateCard 
          key={cert.id} 
          certificate={cert}
          onView={() => openCertificateModal(cert.id)}
          onShare={() => copyShareLink(cert.share_url)}
          onDownload={() => downloadCertificate(cert.id)}
        />
      ))}
    </div>
  );
};
```

### Компонент верификации сертификата

```jsx
const CertificateVerification = ({ verificationCode }) => {
  const [certificate, setCertificate] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch(`/api/certificates/verify/${verificationCode}`)
      .then(res => res.json())
      .then(data => {
        if (data.isValid) {
          setCertificate(data.certificate);
        } else {
          setError('Сертификат не найден');
        }
      })
      .catch(err => setError('Ошибка загрузки'))
      .finally(() => setLoading(false));
  }, [verificationCode]);

  if (loading) return <div>Загрузка...</div>;
  if (error) return <div>Ошибка: {error}</div>;
  if (!certificate) return <div>Сертификат не найден</div>;

  return (
    <div className="certificate-verification">
      <h1>{certificate.title}</h1>
      <p>{certificate.description}</p>
      <div className="certificate-details">
        <p><strong>Студент:</strong> {certificate.user_name}</p>
        <p><strong>Курс:</strong> {certificate.course_title}</p>
        <p><strong>Инструктор:</strong> {certificate.instructor_name}</p>
        <p><strong>Дата завершения:</strong> {certificate.completion_date}</p>
        <p><strong>Номер сертификата:</strong> {certificate.certificate_number}</p>
      </div>
    </div>
  );
};
```

## Безопасность

1. **Верификация кодов** - Уникальные коды верификации генерируются криптографически стойким способом
2. **Публичная верификация** - Endpoint `/verify/:code` доступен без аутентификации для проверки подлинности
3. **Контроль доступа** - Только владельцы сертификатов могут их просматривать и скачивать
4. **Валидация данных** - Все входные данные проверяются на корректность

## Ограничения

1. **Один сертификат на курс** - Пользователь может получить только один сертификат за курс
2. **Требование завершения курса** - Сертификат можно создать только после завершения курса
3. **Ограничения ролей** - Некоторые операции доступны только администраторам и преподавателям
