// Тестовый скрипт для проверки API урока
// Запуск: node test-lesson-api.js

const BACKEND_URL = 'http://localhost:5001';

async function testLessonAPI() {
  try {
    console.log('🔍 Тестирование API урока...\n');

    // 1. Получаем токен
    console.log('1. Получение токена...');
    const loginResponse = await fetch(`${BACKEND_URL}/api/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: 'student@taxbilim.com',
        password: 'student123'
      })
    });

    if (!loginResponse.ok) {
      throw new Error(`Ошибка логина: ${loginResponse.status}`);
    }

    const loginData = await loginResponse.json();
    const token = loginData.token;
    console.log('✅ Токен получен:', token.substring(0, 20) + '...\n');

    // 2. Тестируем получение урока
    console.log('2. Получение урока с ID 2...');
    const lessonResponse = await fetch(`${BACKEND_URL}/api/lessons/2`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      cache: 'no-store'
    });

    console.log('Статус ответа:', lessonResponse.status);
    console.log('Headers:', Object.fromEntries(lessonResponse.headers.entries()));

    if (!lessonResponse.ok) {
      const errorText = await lessonResponse.text();
      throw new Error(`Ошибка получения урока: ${lessonResponse.status} - ${errorText}`);
    }

    const lessonData = await lessonResponse.json();
    console.log('✅ Урок получен успешно!');
    console.log('Название урока:', lessonData.lesson.title);
    console.log('Тип урока:', lessonData.lesson.lesson_type);
    console.log('ID урока:', lessonData.lesson.id);

    // 3. Тестируем без токена (должна быть ошибка 401)
    console.log('\n3. Тестирование без токена (должна быть ошибка 401)...');
    const noAuthResponse = await fetch(`${BACKEND_URL}/api/lessons/2`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      }
    });

    console.log('Статус без токена:', noAuthResponse.status);
    if (noAuthResponse.status === 401) {
      console.log('✅ Корректно возвращает 401 без токена');
    } else {
      console.log('❌ Неожиданный статус без токена');
    }

    // 4. Тестируем с неправильным токеном
    console.log('\n4. Тестирование с неправильным токеном...');
    const wrongTokenResponse = await fetch(`${BACKEND_URL}/api/lessons/2`, {
      method: 'GET',
      headers: {
        'Authorization': 'Bearer invalid_token',
        'Content-Type': 'application/json',
      }
    });

    console.log('Статус с неправильным токеном:', wrongTokenResponse.status);
    if (wrongTokenResponse.status === 401) {
      console.log('✅ Корректно возвращает 401 с неправильным токеном');
    } else {
      console.log('❌ Неожиданный статус с неправильным токеном');
    }

    console.log('\n🎉 Все тесты пройдены успешно!');
    console.log('\n📋 Информация для фронтендера:');
    console.log('- Backend URL:', BACKEND_URL);
    console.log('- Endpoint: GET /api/lessons/2');
    console.log('- Требуется: Authorization: Bearer <token>');
    console.log('- Content-Type: application/json');

  } catch (error) {
    console.error('❌ Ошибка:', error.message);
    console.error('Полная ошибка:', error);
  }
}

// Запускаем тест
testLessonAPI();
