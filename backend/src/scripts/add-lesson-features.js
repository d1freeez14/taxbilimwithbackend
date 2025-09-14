const { query } = require('../lib/db');

/**
 * Script to add new lesson features and author description
 * This script will:
 * 1. Add new columns to authors, enrollments, and lessons tables
 * 2. Create tests, test_questions, and test_attempts tables
 * 3. Update existing data with default values
 */

async function addLessonFeatures() {
  try {
    console.log('Starting migration: Adding lesson features and author description...');

    // Step 1: Add description column to authors table
    console.log('Step 1: Adding description column to authors table...');
    const addAuthorDescriptionQuery = `
      DO $$ 
      BEGIN
          IF NOT EXISTS (
              SELECT 1 FROM information_schema.columns 
              WHERE table_name = 'authors' AND column_name = 'description'
          ) THEN
              ALTER TABLE authors ADD COLUMN description TEXT;
          END IF;
      END $$;
    `;

    await query(addAuthorDescriptionQuery);
    console.log('✓ Author description column added/verified');

    // Step 2: Add is_recorded column to enrollments table
    console.log('Step 2: Adding is_recorded column to enrollments table...');
    const addEnrollmentRecordedQuery = `
      DO $$ 
      BEGIN
          IF NOT EXISTS (
              SELECT 1 FROM information_schema.columns 
              WHERE table_name = 'enrollments' AND column_name = 'is_recorded'
          ) THEN
              ALTER TABLE enrollments ADD COLUMN is_recorded BOOLEAN DEFAULT true;
          END IF;
      END $$;
    `;

    await query(addEnrollmentRecordedQuery);
    console.log('✓ Enrollment is_recorded column added/verified');

    // Step 3: Add new columns to lessons table
    console.log('Step 3: Adding new columns to lessons table...');
    const addLessonColumnsQuery = `
      DO $$ 
      BEGIN
          IF NOT EXISTS (
              SELECT 1 FROM information_schema.columns 
              WHERE table_name = 'lessons' AND column_name = 'image'
          ) THEN
              ALTER TABLE lessons ADD COLUMN image VARCHAR(255);
          END IF;
          
          IF NOT EXISTS (
              SELECT 1 FROM information_schema.columns 
              WHERE table_name = 'lessons' AND column_name = 'locked'
          ) THEN
              ALTER TABLE lessons ADD COLUMN locked BOOLEAN DEFAULT false;
          END IF;
          
          IF NOT EXISTS (
              SELECT 1 FROM information_schema.columns 
              WHERE table_name = 'lessons' AND column_name = 'lesson_type'
          ) THEN
              ALTER TABLE lessons ADD COLUMN lesson_type VARCHAR(50) DEFAULT 'VIDEO';
          END IF;
          
          IF NOT EXISTS (
              SELECT 1 FROM information_schema.columns 
              WHERE table_name = 'lessons' AND column_name = 'test_id'
          ) THEN
              ALTER TABLE lessons ADD COLUMN test_id INTEGER;
          END IF;
          
          IF NOT EXISTS (
              SELECT 1 FROM information_schema.columns 
              WHERE table_name = 'lessons' AND column_name = 'url'
          ) THEN
              ALTER TABLE lessons ADD COLUMN url VARCHAR(500);
          END IF;
      END $$;
    `;

    await query(addLessonColumnsQuery);
    console.log('✓ Lesson columns added/verified');

    // Step 4: Create tests table
    console.log('Step 4: Creating tests table...');
    const createTestsTableQuery = `
      CREATE TABLE IF NOT EXISTS tests (
        id SERIAL PRIMARY KEY,
        lesson_id INTEGER,
        title VARCHAR(255) NOT NULL,
        description TEXT,
        time_limit INTEGER,
        passing_score INTEGER DEFAULT 70,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `;

    await query(createTestsTableQuery);
    console.log('✓ Tests table created/verified');

    // Step 5: Create test_questions table
    console.log('Step 5: Creating test_questions table...');
    const createTestQuestionsTableQuery = `
      CREATE TABLE IF NOT EXISTS test_questions (
        id SERIAL PRIMARY KEY,
        test_id INTEGER REFERENCES tests(id) ON DELETE CASCADE,
        question_text TEXT NOT NULL,
        question_type VARCHAR(50) DEFAULT 'multiple_choice',
        options JSONB,
        correct_answer VARCHAR(255) NOT NULL,
        points INTEGER DEFAULT 1,
        question_order INTEGER NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `;

    await query(createTestQuestionsTableQuery);
    console.log('✓ Test questions table created/verified');

    // Step 6: Create test_attempts table
    console.log('Step 6: Creating test_attempts table...');
    const createTestAttemptsTableQuery = `
      CREATE TABLE IF NOT EXISTS test_attempts (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        test_id INTEGER REFERENCES tests(id) ON DELETE CASCADE,
        score INTEGER DEFAULT 0,
        percentage DECIMAL(5,2) DEFAULT 0,
        passed BOOLEAN DEFAULT false,
        answers JSONB,
        completed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `;

    await query(createTestAttemptsTableQuery);
    console.log('✓ Test attempts table created/verified');

    // Step 7: Add foreign key constraint for lessons.test_id
    console.log('Step 7: Adding foreign key constraints...');
    const addForeignKeyQuery = `
      DO $$ 
      BEGIN
          IF NOT EXISTS (
              SELECT 1 FROM information_schema.table_constraints 
              WHERE constraint_name = 'lessons_test_id_fkey'
          ) THEN
              ALTER TABLE lessons ADD CONSTRAINT lessons_test_id_fkey 
              FOREIGN KEY (test_id) REFERENCES tests(id) ON DELETE SET NULL;
          END IF;
      END $$;
    `;

    await query(addForeignKeyQuery);
    console.log('✓ Foreign key constraints added/verified');

    // Step 8: Create indexes for better performance
    console.log('Step 8: Creating indexes...');
    const createIndexesQuery = `
      CREATE INDEX IF NOT EXISTS idx_lessons_module_order ON lessons(module_id, "order");
      CREATE INDEX IF NOT EXISTS idx_lessons_type ON lessons(lesson_type);
      CREATE INDEX IF NOT EXISTS idx_lessons_locked ON lessons(locked);
      CREATE INDEX IF NOT EXISTS idx_tests_lesson ON tests(lesson_id);
      CREATE INDEX IF NOT EXISTS idx_test_questions_test ON test_questions(test_id);
      CREATE INDEX IF NOT EXISTS idx_test_attempts_user_test ON test_attempts(user_id, test_id);
      CREATE INDEX IF NOT EXISTS idx_enrollments_recorded ON enrollments(is_recorded);
    `;

    await query(createIndexesQuery);
    console.log('✓ Indexes created/verified');

    // Step 9: Update existing lessons with default values
    console.log('Step 9: Updating existing lessons...');
    const updateLessonsQuery = `
      UPDATE lessons 
      SET 
        lesson_type = COALESCE(lesson_type, 'VIDEO'),
        locked = COALESCE(locked, false)
      WHERE lesson_type IS NULL OR locked IS NULL
    `;

    const updateResult = await query(updateLessonsQuery);
    console.log(`✓ Updated ${updateResult.rowCount} lessons with default values`);

    // Step 10: Update existing enrollments with default values
    console.log('Step 10: Updating existing enrollments...');
    const updateEnrollmentsQuery = `
      UPDATE enrollments 
      SET is_recorded = COALESCE(is_recorded, true)
      WHERE is_recorded IS NULL
    `;

    const updateEnrollmentsResult = await query(updateEnrollmentsQuery);
    console.log(`✓ Updated ${updateEnrollmentsResult.rowCount} enrollments with default values`);

    console.log('✓ Migration completed successfully!');
    console.log('New features added:');
    console.log('- Author description field');
    console.log('- Enrollment is_recorded field');
    console.log('- Lesson image, locked, lesson_type, test_id, url fields');
    console.log('- Tests, test_questions, and test_attempts tables');
    console.log('- Lesson type support: VIDEO, TEST, READING, ASSIGNMENT, LIVE_SESSION, QUIZ');

  } catch (error) {
    console.error('❌ Migration failed:', error);
    throw error;
  }
}

// Run migration if this script is executed directly
if (require.main === module) {
  addLessonFeatures()
    .then(() => {
      console.log('Lesson features migration completed successfully');
      process.exit(0);
    })
    .catch((error) => {
      console.error('Lesson features migration failed:', error);
      process.exit(1);
    });
}

module.exports = { addLessonFeatures };
