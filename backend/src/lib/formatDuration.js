/**
 * Utility functions for formatting duration and statistics
 */

/**
 * Format duration in minutes to human-readable format
 * @param {number} minutes - Duration in minutes
 * @returns {string} Formatted duration (e.g., "2 часа 30 минут", "45 минут")
 */
function formatDuration(minutes) {
  if (!minutes || minutes === 0) {
    return '0 минут';
  }

  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;

  if (hours === 0) {
    return `${remainingMinutes} минут`;
  } else if (remainingMinutes === 0) {
    return `${hours} ${hours === 1 ? 'час' : hours < 5 ? 'часа' : 'часов'}`;
  } else {
    return `${hours} ${hours === 1 ? 'час' : hours < 5 ? 'часа' : 'часов'} ${remainingMinutes} минут`;
  }
}

/**
 * Format course statistics for display
 * @param {Object} stats - Course statistics object
 * @returns {Object} Formatted statistics
 */
function formatCourseStatistics(stats) {
  return {
    moduleCount: stats.module_count || 0,
    lessonCount: stats.lesson_count || 0,
    totalDuration: stats.total_duration || 0,
    formattedDuration: formatDuration(stats.total_duration || 0)
  };
}

/**
 * Format module statistics for display
 * @param {Object} stats - Module statistics object
 * @returns {Object} Formatted statistics
 */
function formatModuleStatistics(stats) {
  return {
    lessonCount: stats.lesson_count || 0,
    assignmentCount: stats.assignment_count || 0,
    totalDuration: stats.total_duration || 0,
    durationWeeks: stats.duration_weeks || 1,
    formattedDuration: formatDuration(stats.total_duration || 0)
  };
}

/**
 * Get course statistics summary text
 * @param {Object} stats - Course statistics object
 * @returns {string} Summary text (e.g., "5 модулей, 78 видеоуроков, 12 часов 30 минут")
 */
function getCourseSummaryText(stats) {
  const moduleText = `${stats.module_count || 0} ${stats.module_count === 1 ? 'модуль' : stats.module_count < 5 ? 'модуля' : 'модулей'}`;
  const lessonText = `${stats.lesson_count || 0} ${stats.lesson_count === 1 ? 'видеоурок' : stats.lesson_count < 5 ? 'видеоурока' : 'видеоуроков'}`;
  const durationText = formatDuration(stats.total_duration || 0);

  return `${moduleText}, ${lessonText}, ${durationText}`;
}

/**
 * Get module statistics summary text
 * @param {Object} stats - Module statistics object
 * @returns {string} Summary text (e.g., "15 видеоуроков, 3 задания, 2 недели")
 */
function getModuleSummaryText(stats) {
  const lessonText = `${stats.lesson_count || 0} ${stats.lesson_count === 1 ? 'видеоурок' : stats.lesson_count < 5 ? 'видеоурока' : 'видеоуроков'}`;
  const assignmentText = `${stats.assignment_count || 0} ${stats.assignment_count === 1 ? 'задание' : stats.assignment_count < 5 ? 'задания' : 'заданий'}`;
  const weekText = `${stats.duration_weeks || 1} ${stats.duration_weeks === 1 ? 'неделя' : stats.duration_weeks < 5 ? 'недели' : 'недель'}`;

  return `${lessonText}, ${assignmentText}, ${weekText}`;
}

module.exports = {
  formatDuration,
  formatCourseStatistics,
  formatModuleStatistics,
  getCourseSummaryText,
  getModuleSummaryText
};
