const { query } = require('../lib/db');

/**
 * Script to update course and module statistics
 * This script will:
 * 1. Add statistics columns to courses and modules tables if they don't exist
 * 2. Calculate and update statistics for all existing courses and modules
 */

async function updateCourseStatistics() {
  try {
    console.log('Starting migration: Updating course and module statistics...');

    // Step 1: Add statistics columns to courses table if they don't exist
    console.log('Step 1: Adding statistics columns to courses table...');
    const addCourseColumnsQuery = `
      DO $$ 
      BEGIN
          IF NOT EXISTS (
              SELECT 1 FROM information_schema.columns 
              WHERE table_name = 'courses' AND column_name = 'module_count'
          ) THEN
              ALTER TABLE courses ADD COLUMN module_count INTEGER DEFAULT 0;
          END IF;
          
          IF NOT EXISTS (
              SELECT 1 FROM information_schema.columns 
              WHERE table_name = 'courses' AND column_name = 'lesson_count'
          ) THEN
              ALTER TABLE courses ADD COLUMN lesson_count INTEGER DEFAULT 0;
          END IF;
          
          IF NOT EXISTS (
              SELECT 1 FROM information_schema.columns 
              WHERE table_name = 'courses' AND column_name = 'total_duration'
          ) THEN
              ALTER TABLE courses ADD COLUMN total_duration INTEGER DEFAULT 0;
          END IF;
      END $$;
    `;

    await query(addCourseColumnsQuery);
    console.log('✓ Course statistics columns added/verified');

    // Step 2: Add statistics columns to modules table if they don't exist
    console.log('Step 2: Adding statistics columns to modules table...');
    const addModuleColumnsQuery = `
      DO $$ 
      BEGIN
          IF NOT EXISTS (
              SELECT 1 FROM information_schema.columns 
              WHERE table_name = 'modules' AND column_name = 'lesson_count'
          ) THEN
              ALTER TABLE modules ADD COLUMN lesson_count INTEGER DEFAULT 0;
          END IF;
          
          IF NOT EXISTS (
              SELECT 1 FROM information_schema.columns 
              WHERE table_name = 'modules' AND column_name = 'assignment_count'
          ) THEN
              ALTER TABLE modules ADD COLUMN assignment_count INTEGER DEFAULT 0;
          END IF;
          
          IF NOT EXISTS (
              SELECT 1 FROM information_schema.columns 
              WHERE table_name = 'modules' AND column_name = 'total_duration'
          ) THEN
              ALTER TABLE modules ADD COLUMN total_duration INTEGER DEFAULT 0;
          END IF;
          
          IF NOT EXISTS (
              SELECT 1 FROM information_schema.columns 
              WHERE table_name = 'modules' AND column_name = 'duration_weeks'
          ) THEN
              ALTER TABLE modules ADD COLUMN duration_weeks INTEGER DEFAULT 1;
          END IF;
      END $$;
    `;

    await query(addModuleColumnsQuery);
    console.log('✓ Module statistics columns added/verified');

    // Step 3: Get all modules and calculate their statistics
    console.log('Step 3: Calculating module statistics...');
    const modulesQuery = 'SELECT id FROM modules';
    const modulesResult = await query(modulesQuery);
    const modules = modulesResult.rows;

    console.log(`Found ${modules.length} modules to process`);

    for (const module of modules) {
      const moduleId = module.id;
      
      // Calculate module statistics
      const moduleStatsQuery = `
        SELECT 
          COUNT(l.id) as lesson_count,
          COALESCE(SUM(l.duration), 0) as total_duration
        FROM lessons l
        WHERE l.module_id = $1
      `;

      const moduleStatsResult = await query(moduleStatsQuery, [moduleId]);
      const { lesson_count, total_duration } = moduleStatsResult.rows[0];
      
      const lessonCount = parseInt(lesson_count) || 0;
      const totalDuration = parseInt(total_duration) || 0;

      // Update module statistics
      const updateModuleQuery = `
        UPDATE modules 
        SET 
          lesson_count = $1,
          total_duration = $2,
          updated_at = CURRENT_TIMESTAMP
        WHERE id = $3
      `;

      await query(updateModuleQuery, [lessonCount, totalDuration, moduleId]);
      
      console.log(`✓ Module ${moduleId}: ${lessonCount} lessons, ${totalDuration} minutes`);
    }

    // Step 4: Get all courses and calculate their statistics
    console.log('Step 4: Calculating course statistics...');
    const coursesQuery = 'SELECT id FROM courses';
    const coursesResult = await query(coursesQuery);
    const courses = coursesResult.rows;

    console.log(`Found ${courses.length} courses to process`);

    for (const course of courses) {
      const courseId = course.id;
      
      // Calculate course statistics
      const courseStatsQuery = `
        SELECT 
          COUNT(DISTINCT m.id) as module_count,
          COUNT(DISTINCT l.id) as lesson_count,
          COALESCE(SUM(l.duration), 0) as total_duration
        FROM modules m
        LEFT JOIN lessons l ON m.id = l.module_id
        WHERE m.course_id = $1
      `;

      const courseStatsResult = await query(courseStatsQuery, [courseId]);
      const { module_count, lesson_count, total_duration } = courseStatsResult.rows[0];
      
      const moduleCount = parseInt(module_count) || 0;
      const lessonCount = parseInt(lesson_count) || 0;
      const totalDuration = parseInt(total_duration) || 0;

      // Update course statistics
      const updateCourseQuery = `
        UPDATE courses 
        SET 
          module_count = $1,
          lesson_count = $2,
          total_duration = $3,
          updated_at = CURRENT_TIMESTAMP
        WHERE id = $4
      `;

      await query(updateCourseQuery, [moduleCount, lessonCount, totalDuration, courseId]);
      
      console.log(`✓ Course ${courseId}: ${moduleCount} modules, ${lessonCount} lessons, ${totalDuration} minutes`);
    }

    console.log('✓ Migration completed successfully!');
    console.log(`Updated statistics for ${modules.length} modules and ${courses.length} courses`);

  } catch (error) {
    console.error('❌ Migration failed:', error);
    throw error;
  }
}

// Run migration if this script is executed directly
if (require.main === module) {
  updateCourseStatistics()
    .then(() => {
      console.log('Statistics migration completed successfully');
      process.exit(0);
    })
    .catch((error) => {
      console.error('Statistics migration failed:', error);
      process.exit(1);
    });
}

module.exports = { updateCourseStatistics };
