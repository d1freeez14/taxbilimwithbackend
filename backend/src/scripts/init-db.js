const { query } = require('../lib/db');

const initDatabase = async () => {
  try {
    console.log('🗄️ Initializing database...');

    // Create users table
    await query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        email VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        name VARCHAR(255),
        avatar VARCHAR(255),
        role VARCHAR(50) DEFAULT 'STUDENT',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Create authors table
    await query(`
      CREATE TABLE IF NOT EXISTS authors (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        avatar VARCHAR(255),
        bio TEXT,
        description TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Create courses table
    await query(`
      CREATE TABLE IF NOT EXISTS courses (
        id SERIAL PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        description TEXT,
        image_src VARCHAR(255),
        price DECIMAL(10,2) NOT NULL,
        bg VARCHAR(50) DEFAULT 'white',
        is_published BOOLEAN DEFAULT false,
        is_sales_leader BOOLEAN DEFAULT false,
        is_recorded BOOLEAN DEFAULT true,
        progress INTEGER DEFAULT 0,
        module_count INTEGER DEFAULT 0,
        lesson_count INTEGER DEFAULT 0,
        total_duration INTEGER DEFAULT 0,
        features TEXT[],
        what_you_learn TEXT[],
        author_id INTEGER REFERENCES authors(id) ON DELETE CASCADE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Create modules table
    await query(`
      CREATE TABLE IF NOT EXISTS modules (
        id SERIAL PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        "order" INTEGER NOT NULL,
        course_id INTEGER REFERENCES courses(id) ON DELETE CASCADE,
        lesson_count INTEGER DEFAULT 0,
        assignment_count INTEGER DEFAULT 0,
        total_duration INTEGER DEFAULT 0,
        duration_weeks INTEGER DEFAULT 1,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Create lessons table
    await query(`
      CREATE TABLE IF NOT EXISTS lessons (
        id SERIAL PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        content TEXT,
        video_url VARCHAR(255),
        "order" INTEGER NOT NULL,
        module_id INTEGER REFERENCES modules(id) ON DELETE CASCADE,
        duration INTEGER,
        image VARCHAR(255),
        locked BOOLEAN DEFAULT false,
        lesson_type VARCHAR(50) DEFAULT 'VIDEO',
        test_id INTEGER,
        url VARCHAR(500),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Create tests table
    await query(`
      CREATE TABLE IF NOT EXISTS tests (
        id SERIAL PRIMARY KEY,
        lesson_id INTEGER REFERENCES lessons(id) ON DELETE CASCADE,
        title VARCHAR(255) NOT NULL,
        description TEXT,
        time_limit INTEGER, -- in minutes
        passing_score INTEGER DEFAULT 70, -- percentage
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Create test_questions table
    await query(`
      CREATE TABLE IF NOT EXISTS test_questions (
        id SERIAL PRIMARY KEY,
        test_id INTEGER REFERENCES tests(id) ON DELETE CASCADE,
        question_text TEXT NOT NULL,
        question_type VARCHAR(50) DEFAULT 'multiple_choice',
        options JSONB, -- array of answer options
        correct_answer VARCHAR(255) NOT NULL,
        points INTEGER DEFAULT 1,
        question_order INTEGER NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Create test_attempts table
    await query(`
      CREATE TABLE IF NOT EXISTS test_attempts (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        test_id INTEGER REFERENCES tests(id) ON DELETE CASCADE,
        score INTEGER DEFAULT 0,
        percentage DECIMAL(5,2) DEFAULT 0,
        passed BOOLEAN DEFAULT false,
        answers JSONB, -- detailed answer data
        completed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Create enrollments table
    await query(`
      CREATE TABLE IF NOT EXISTS enrollments (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        course_id INTEGER REFERENCES courses(id) ON DELETE CASCADE,
        enrolled_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        completed_at TIMESTAMP,
        is_recorded BOOLEAN DEFAULT true,
        UNIQUE(user_id, course_id)
      )
    `);

    // Create lesson_progress table
    await query(`
      CREATE TABLE IF NOT EXISTS lesson_progress (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        lesson_id INTEGER REFERENCES lessons(id) ON DELETE CASCADE,
        completed BOOLEAN DEFAULT false,
        completed_at TIMESTAMP,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(user_id, lesson_id)
      )
    `);

    // Create certificates table
    await query(`
      CREATE TABLE IF NOT EXISTS certificates (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        course_id INTEGER REFERENCES courses(id) ON DELETE CASCADE,
        issued_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        certificate_url VARCHAR(255),
        UNIQUE(user_id, course_id)
      )
    `);

    // Create reviews table
    await query(`
      CREATE TABLE IF NOT EXISTS reviews (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        course_id INTEGER REFERENCES courses(id) ON DELETE CASCADE,
        rating INTEGER CHECK (rating >= 1 AND rating <= 5),
        comment TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(user_id, course_id)
      )
    `);

    // Create course_favorites table
    await query(`
      CREATE TABLE IF NOT EXISTS course_favorites (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        course_id INTEGER REFERENCES courses(id) ON DELETE CASCADE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(user_id, course_id)
      )
    `);

    // Create categories table
    await query(`
      CREATE TABLE IF NOT EXISTS categories (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        description TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Create indexes for better performance
    await query('CREATE INDEX IF NOT EXISTS idx_users_email ON users(email)');
    await query('CREATE INDEX IF NOT EXISTS idx_courses_published ON courses(is_published)');
    await query('CREATE INDEX IF NOT EXISTS idx_enrollments_user_course ON enrollments(user_id, course_id)');
    await query('CREATE INDEX IF NOT EXISTS idx_lesson_progress_user_lesson ON lesson_progress(user_id, lesson_id)');
    await query('CREATE INDEX IF NOT EXISTS idx_reviews_course ON reviews(course_id)');
    await query('CREATE INDEX IF NOT EXISTS idx_course_favorites_user_course ON course_favorites(user_id, course_id)');
    await query('CREATE INDEX IF NOT EXISTS idx_tests_lesson ON tests(lesson_id)');
    await query('CREATE INDEX IF NOT EXISTS idx_test_questions_test ON test_questions(test_id)');
    await query('CREATE INDEX IF NOT EXISTS idx_test_attempts_user_test ON test_attempts(user_id, test_id)');

    console.log('✅ Database initialized successfully!');
  } catch (error) {
    console.error('❌ Error initializing database:', error);
    throw error;
  }
};

module.exports = { initDatabase }; 