const { query } = require('../lib/db');

/**
 * Script to add progress field to existing courses
 * This script will:
 * 1. Add progress column to courses table if it doesn't exist
 * 2. Calculate progress for existing courses based on completed lessons
 * 3. Update all courses with calculated progress
 */

async function addProgressToCourses() {
  try {
    console.log('Starting migration: Adding progress field to courses...');

    // Step 1: Add progress column if it doesn't exist
    console.log('Step 1: Adding progress column to courses table...');
    const addColumnQuery = `
      DO $$ 
      BEGIN
          IF NOT EXISTS (
              SELECT 1 FROM information_schema.columns 
              WHERE table_name = 'courses' AND column_name = 'progress'
          ) THEN
              ALTER TABLE courses ADD COLUMN progress INTEGER DEFAULT 0;
              RAISE NOTICE 'Progress column added to courses table';
          ELSE
              RAISE NOTICE 'Progress column already exists in courses table';
          END IF;
      END $$;
    `;

    await query(addColumnQuery);
    console.log('✓ Progress column added/verified');

    // Step 2: Get all courses
    console.log('Step 2: Fetching all courses...');
    const coursesQuery = 'SELECT id FROM courses';
    const coursesResult = await query(coursesQuery);
    const courses = coursesResult.rows;

    console.log(`Found ${courses.length} courses to process`);

    // Step 3: Calculate and update progress for each course
    console.log('Step 3: Calculating progress for each course...');
    
    for (const course of courses) {
      const courseId = course.id;
      
      // Calculate progress based on completed lessons
      const progressQuery = `
        SELECT 
          COUNT(l.id) as total_lessons,
          COUNT(CASE WHEN lp.completed = true THEN 1 END) as completed_lessons
        FROM lessons l
        JOIN modules m ON l.module_id = m.id
        LEFT JOIN lesson_progress lp ON l.id = lp.lesson_id
        WHERE m.course_id = $1
      `;

      const progressResult = await query(progressQuery, [courseId]);
      const { total_lessons, completed_lessons } = progressResult.rows[0];
      
      const totalLessons = parseInt(total_lessons) || 0;
      const completedLessons = parseInt(completed_lessons) || 0;
      const progressPercentage = totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0;

      // Update course progress
      const updateQuery = `
        UPDATE courses 
        SET progress = $1, updated_at = CURRENT_TIMESTAMP
        WHERE id = $2
      `;

      await query(updateQuery, [progressPercentage, courseId]);
      
      console.log(`✓ Course ${courseId}: ${completedLessons}/${totalLessons} lessons completed (${progressPercentage}%)`);
    }

    console.log('✓ Migration completed successfully!');
    console.log(`Updated progress for ${courses.length} courses`);

  } catch (error) {
    console.error('❌ Migration failed:', error);
    throw error;
  }
}

// Run migration if this script is executed directly
if (require.main === module) {
  addProgressToCourses()
    .then(() => {
      console.log('Migration completed successfully');
      process.exit(0);
    })
    .catch((error) => {
      console.error('Migration failed:', error);
      process.exit(1);
    });
}

module.exports = { addProgressToCourses };
