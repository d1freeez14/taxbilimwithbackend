const { query } = require('../lib/db');
const bcrypt = require('bcryptjs');

async function main() {
  try {
    console.log('🌱 Starting database seeding...');

    // Create admin user
    const adminPassword = await bcrypt.hash('admin123', 10);
    const adminResult = await query(
      'INSERT INTO users (email, password, name, role) VALUES ($1, $2, $3, $4) ON CONFLICT (email) DO UPDATE SET name = EXCLUDED.name RETURNING id, email, name, role',
      ['admin@taxbilim.com', adminPassword, 'Admin User', 'ADMIN']
    );
    const admin = adminResult.rows[0];

    // Create teacher user
    const teacherPassword = await bcrypt.hash('teacher123', 10);
    const teacherResult = await query(
      'INSERT INTO users (email, password, name, role) VALUES ($1, $2, $3, $4) ON CONFLICT (email) DO UPDATE SET name = EXCLUDED.name RETURNING id, email, name, role',
      ['teacher@taxbilim.com', teacherPassword, 'Teacher User', 'TEACHER']
    );
    const teacher = teacherResult.rows[0];

    // Create student user
    const studentPassword = await bcrypt.hash('student123', 10);
    const studentResult = await query(
      'INSERT INTO users (email, password, name, role) VALUES ($1, $2, $3, $4) ON CONFLICT (email) DO UPDATE SET name = EXCLUDED.name RETURNING id, email, name, role',
      ['student@taxbilim.com', studentPassword, 'Student User', 'STUDENT']
    );
    const student = studentResult.rows[0];

    // Create author
    const authorResult = await query(
      'INSERT INTO authors (name, avatar, bio) VALUES ($1, $2, $3) RETURNING id, name, avatar',
      ['Лана Б.', '/avatars.png', 'Expert tax consultant with 10+ years of experience']
    );
    const author = authorResult.rows[0];

    // Create sample courses
    const course1Result = await query(
      `INSERT INTO courses (title, description, image_src, price, bg, is_published, is_sales_leader, is_recorded, features, what_you_learn, author_id) 
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11) 
       RETURNING id, title`,
      [
        'Основы налогообложения',
        'Комплексный курс по основам налогообложения для начинающих. Изучите основные принципы, виды налогов и их применение в Казахстане.',
        '/coursePlaceholder.png',
        25990.00,
        'white',
        true,
        true,
        true,
        ['5 Модулей', '78 видеоуроков', '7 статей', '10 ресурсов для скачивания', 'Полный пожизненный доступ', 'Сертификат об окончании'],
        ['Понимание основных принципов налогообложения', 'Виды налогов и их применение', 'Налоговая отчетность и декларации', 'Практические примеры и кейсы'],
        author.id
      ]
    );
    const course1 = course1Result.rows[0];

    const course2Result = await query(
      `INSERT INTO courses (title, description, image_src, price, bg, is_published, is_sales_leader, is_recorded, features, what_you_learn, author_id) 
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11) 
       RETURNING id, title`,
      [
        'НДС для бизнеса',
        'Подробный курс по НДС для предпринимателей и бухгалтеров. Практические примеры и актуальное законодательство.',
        '/coursePlaceholder.png',
        35990.00,
        'white',
        true,
        true,
        true,
        ['6 Модулей', '95 видеоуроков', '12 статей', '15 ресурсов для скачивания', 'Полный пожизненный доступ', 'Сертификат об окончании'],
        ['Основы НДС и его расчет', 'НДС в различных операциях', 'Налоговые вычеты и возмещение', 'Электронная отчетность по НДС'],
        author.id
      ]
    );
    const course2 = course2Result.rows[0];

    // Create modules for course 1
    const module1Result = await query(
      'INSERT INTO modules (title, "order", course_id) VALUES ($1, $2, $3) RETURNING id, title',
      ['Модуль 1: Введение в налогообложение', 1, course1.id]
    );
    const module1 = module1Result.rows[0];

    const module2Result = await query(
      'INSERT INTO modules (title, "order", course_id) VALUES ($1, $2, $3) RETURNING id, title',
      ['Модуль 2: Виды налогов', 2, course1.id]
    );
    const module2 = module2Result.rows[0];

    // Create lessons for module 1
    const lesson1Result = await query(
      'INSERT INTO lessons (title, content, "order", module_id, duration) VALUES ($1, $2, $3, $4, $5) RETURNING id, title',
      ['Урок 1: Что такое налоги', 'В этом уроке мы изучим основные понятия налогообложения...', 1, module1.id, 15]
    );
    const lesson1 = lesson1Result.rows[0];

    const lesson2Result = await query(
      'INSERT INTO lessons (title, content, "order", module_id, duration) VALUES ($1, $2, $3, $4, $5) RETURNING id, title',
      ['Урок 2: Функции налогов', 'Рассмотрим основные функции налогов в экономике...', 2, module1.id, 20]
    );
    const lesson2 = lesson2Result.rows[0];

    const lesson3Result = await query(
      'INSERT INTO lessons (title, content, "order", module_id, duration) VALUES ($1, $2, $3, $4, $5) RETURNING id, title',
      ['Урок 3: Налоговая система РК', 'Изучим структуру налоговой системы Казахстана...', 3, module1.id, 25]
    );
    const lesson3 = lesson3Result.rows[0];

    // Create lessons for module 2
    const lesson4Result = await query(
      'INSERT INTO lessons (title, content, "order", module_id, duration) VALUES ($1, $2, $3, $4, $5) RETURNING id, title',
      ['Урок 1: Прямые налоги', 'Изучим прямые налоги и их особенности...', 1, module2.id, 18]
    );
    const lesson4 = lesson4Result.rows[0];

    const lesson5Result = await query(
      'INSERT INTO lessons (title, content, "order", module_id, duration) VALUES ($1, $2, $3, $4, $5) RETURNING id, title',
      ['Урок 2: Косвенные налоги', 'Рассмотрим косвенные налоги и их применение...', 2, module2.id, 22]
    );
    const lesson5 = lesson5Result.rows[0];

    // Create modules for course 2
    const module3Result = await query(
      'INSERT INTO modules (title, "order", course_id) VALUES ($1, $2, $3) RETURNING id, title',
      ['Модуль 1: Основы НДС', 1, course2.id]
    );
    const module3 = module3Result.rows[0];

    const module4Result = await query(
      'INSERT INTO modules (title, "order", course_id) VALUES ($1, $2, $3) RETURNING id, title',
      ['Модуль 2: Расчет НДС', 2, course2.id]
    );
    const module4 = module4Result.rows[0];

    // Create lessons for course 2 modules
    const lesson6Result = await query(
      'INSERT INTO lessons (title, content, "order", module_id, duration) VALUES ($1, $2, $3, $4, $5) RETURNING id, title',
      ['Урок 1: Понятие НДС', 'Введение в налог на добавленную стоимость...', 1, module3.id, 20]
    );
    const lesson6 = lesson6Result.rows[0];

    const lesson7Result = await query(
      'INSERT INTO lessons (title, content, "order", module_id, duration) VALUES ($1, $2, $3, $4, $5) RETURNING id, title',
      ['Урок 2: Налоговая база НДС', 'Изучим налоговую базу для расчета НДС...', 2, module3.id, 25]
    );
    const lesson7 = lesson7Result.rows[0];

    const lesson8Result = await query(
      'INSERT INTO lessons (title, content, "order", module_id, duration) VALUES ($1, $2, $3, $4, $5) RETURNING id, title',
      ['Урок 1: Формула расчета НДС', 'Практические примеры расчета НДС...', 1, module4.id, 30]
    );
    const lesson8 = lesson8Result.rows[0];

    // Create test for lesson 3 (Module 1 test)
    const test1Result = await query(
      'INSERT INTO tests (lesson_id, title, description, time_limit, passing_score) VALUES ($1, $2, $3, $4, $5) RETURNING id',
      [lesson3.id, 'Тест по основам налогообложения', 'Проверьте свои знания по основам налогообложения', 30, 70]
    );
    const test1 = test1Result.rows[0];

    // Create test questions
    const questions = [
      {
        question_text: 'Что такое налог?',
        options: ['A) Добровольный взнос', 'Б) Обязательный платеж', 'В) Подарок государству', 'Г) Благотворительность'],
        correct_answer: 'Б) Обязательный платеж',
        points: 2
      },
      {
        question_text: 'Какая основная функция налогов?',
        options: ['A) Развлекательная', 'Б) Фискальная', 'В) Декоративная', 'Г) Рекламная'],
        correct_answer: 'Б) Фискальная',
        points: 2
      },
      {
        question_text: 'Кто является плательщиком налогов в РК?',
        options: ['A) Только физические лица', 'Б) Только юридические лица', 'В) Физические и юридические лица', 'Г) Только иностранцы'],
        correct_answer: 'В) Физические и юридические лица',
        points: 3
      },
      {
        question_text: 'Какой орган отвечает за налоговую политику в РК?',
        options: ['A) Министерство образования', 'Б) Министерство финансов', 'В) Министерство спорта', 'Г) Министерство культуры'],
        correct_answer: 'Б) Министерство финансов',
        points: 2
      },
      {
        question_text: 'Что означает принцип справедливости в налогообложении?',
        options: ['A) Все платят одинаково', 'Б) Богатые платят больше', 'В) Бедные не платят', 'Г) Налоги зависят от способности платить'],
        correct_answer: 'Г) Налоги зависят от способности платить',
        points: 3
      }
    ];

    for (let i = 0; i < questions.length; i++) {
      const question = questions[i];
      await query(
        'INSERT INTO test_questions (test_id, question_text, question_type, options, correct_answer, points, question_order) VALUES ($1, $2, $3, $4, $5, $6, $7)',
        [test1.id, question.question_text, 'multiple_choice', JSON.stringify(question.options), question.correct_answer, question.points, i + 1]
      );
    }

    // Enroll student in course 1
    await query(
      'INSERT INTO enrollments (user_id, course_id) VALUES ($1, $2) ON CONFLICT (user_id, course_id) DO NOTHING',
      [student.id, course1.id]
    );

    // Add some reviews
    await query(
      'INSERT INTO reviews (user_id, course_id, rating, comment) VALUES ($1, $2, $3, $4) ON CONFLICT (user_id, course_id) DO NOTHING',
      [student.id, course1.id, 5, 'Отличный курс! Очень понятно объясняют сложные темы.']
    );

    await query(
      'INSERT INTO reviews (user_id, course_id, rating, comment) VALUES ($1, $2, $3, $4) ON CONFLICT (user_id, course_id) DO NOTHING',
      [student.id, course2.id, 4, 'Хороший курс по НДС, много практических примеров.']
    );

    // Add some favorites
    await query(
      'INSERT INTO course_favorites (user_id, course_id) VALUES ($1, $2) ON CONFLICT (user_id, course_id) DO NOTHING',
      [student.id, course1.id]
    );

    console.log('✅ Database seeded successfully!');
    console.log('👥 Created users:');
    console.log(`   Admin: ${admin.email} (password: admin123)`);
    console.log(`   Teacher: ${teacher.email} (password: teacher123)`);
    console.log(`   Student: ${student.email} (password: student123)`);
    console.log('📚 Created courses and modules');
    console.log('🎓 Created enrollments and reviews');
    console.log('📝 Created test with 5 questions');
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    throw error;
  }
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e);
    process.exit(1);
  }); 