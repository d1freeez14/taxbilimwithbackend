const { query } = require('../lib/db');

/**
 * Script to add category_id, access_duration, and video_url fields to courses table
 * This script will:
 * 1. Add category_id column to courses table
 * 2. Add access_duration column to courses table
 * 3. Add video_url column to courses table
 * 4. Create purchases table if it doesn't exist
 * 5. Create necessary indexes
 */

async function addCourseFields() {
  try {
    console.log('Starting migration: Adding course fields and purchases table...');

    // Step 1: Add category_id column to courses table
    console.log('Step 1: Adding category_id column to courses table...');
    const addCategoryIdQuery = `
      DO $$ 
      BEGIN
          IF NOT EXISTS (
              SELECT 1 FROM information_schema.columns 
              WHERE table_name = 'courses' AND column_name = 'category_id'
          ) THEN
              ALTER TABLE courses 
              ADD COLUMN category_id INTEGER REFERENCES categories(id);
          END IF;
      END $$;
    `;

    await query(addCategoryIdQuery);
    console.log('✓ category_id column added/verified');

    // Step 2: Add access_duration column to courses table
    console.log('Step 2: Adding access_duration column to courses table...');
    const addAccessDurationQuery = `
      DO $$ 
      BEGIN
          IF NOT EXISTS (
              SELECT 1 FROM information_schema.columns 
              WHERE table_name = 'courses' AND column_name = 'access_duration'
          ) THEN
              ALTER TABLE courses 
              ADD COLUMN access_duration VARCHAR(20) DEFAULT 'lifetime' 
              CHECK (access_duration IN ('lifetime', '1_year', '2_years', '6_months'));
          END IF;
      END $$;
    `;

    await query(addAccessDurationQuery);
    console.log('✓ access_duration column added/verified');

    // Step 3: Add video_url column to courses table
    console.log('Step 3: Adding video_url column to courses table...');
    const addVideoUrlQuery = `
      DO $$ 
      BEGIN
          IF NOT EXISTS (
              SELECT 1 FROM information_schema.columns 
              WHERE table_name = 'courses' AND column_name = 'video_url'
          ) THEN
              ALTER TABLE courses ADD COLUMN video_url TEXT;
          END IF;
      END $$;
    `;

    await query(addVideoUrlQuery);
    console.log('✓ video_url column added/verified');

    // Step 4: Create purchases table
    console.log('Step 4: Creating purchases table...');
    const createPurchasesTableQuery = `
      CREATE TABLE IF NOT EXISTS purchases (
          id SERIAL PRIMARY KEY,
          user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
          course_id INTEGER NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
          amount DECIMAL(10,2) NOT NULL,
          payment_method VARCHAR(20) NOT NULL CHECK (payment_method IN ('card', 'bank_transfer', 'cash')),
          payment_status VARCHAR(20) DEFAULT 'pending' CHECK (payment_status IN ('pending', 'completed', 'failed', 'refunded')),
          card_number_masked VARCHAR(20),
          card_holder VARCHAR(100),
          expiry_date VARCHAR(7),
          transaction_id VARCHAR(100),
          created_at TIMESTAMP DEFAULT NOW(),
          updated_at TIMESTAMP DEFAULT NOW()
      );
    `;

    await query(createPurchasesTableQuery);
    console.log('✓ purchases table created/verified');

    // Step 5: Create indexes
    console.log('Step 5: Creating indexes...');
    const createIndexesQuery = `
      CREATE INDEX IF NOT EXISTS idx_purchases_user_id ON purchases(user_id);
      CREATE INDEX IF NOT EXISTS idx_purchases_course_id ON purchases(course_id);
      CREATE INDEX IF NOT EXISTS idx_purchases_created_at ON purchases(created_at);
      CREATE INDEX IF NOT EXISTS idx_courses_category_id ON courses(category_id);
      CREATE INDEX IF NOT EXISTS idx_courses_access_duration ON courses(access_duration);
    `;

    await query(createIndexesQuery);
    console.log('✓ Indexes created/verified');

    // Step 6: Add comments
    console.log('Step 6: Adding table comments...');
    const addCommentsQuery = `
      COMMENT ON TABLE purchases IS 'Таблица покупок курсов';
      COMMENT ON COLUMN purchases.amount IS 'Сумма покупки';
      COMMENT ON COLUMN purchases.payment_method IS 'Способ оплаты';
      COMMENT ON COLUMN purchases.payment_status IS 'Статус платежа';
      COMMENT ON COLUMN purchases.card_number_masked IS 'Замаскированный номер карты';
      COMMENT ON COLUMN purchases.transaction_id IS 'ID транзакции в платежной системе';
      COMMENT ON COLUMN courses.category_id IS 'ID категории курса';
      COMMENT ON COLUMN courses.access_duration IS 'Длительность доступа к курсу';
      COMMENT ON COLUMN courses.video_url IS 'Ссылка на видеозапись курса';
    `;

    try {
      await query(addCommentsQuery);
      console.log('✓ Comments added/verified');
    } catch (commentError) {
      // Comments might fail if they already exist, which is fine
      console.log('⚠️ Some comments may already exist (this is normal)');
    }

    console.log('\n✅ Migration completed successfully!');
    console.log('The following columns have been added to the courses table:');
    console.log('  - category_id (INTEGER, references categories(id))');
    console.log('  - access_duration (VARCHAR(20), default: "lifetime")');
    console.log('  - video_url (TEXT)');
    console.log('\nThe purchases table has been created with all necessary indexes.');

  } catch (error) {
    console.error('❌ Error during migration:', error);
    throw error;
  }
}

// Run the migration if this script is executed directly
if (require.main === module) {
  addCourseFields()
    .then(() => {
      console.log('\n✅ Migration script completed');
      process.exit(0);
    })
    .catch((error) => {
      console.error('\n❌ Migration script failed:', error);
      process.exit(1);
    });
}

module.exports = { addCourseFields };

