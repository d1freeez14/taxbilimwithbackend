/**
 * Utility functions for lesson types and navigation
 */

const LESSON_TYPES = {
  VIDEO: 'VIDEO',
  TEST: 'TEST',
  READING: 'READING',
  ASSIGNMENT: 'ASSIGNMENT',
  LIVE_SESSION: 'LIVE_SESSION',
  QUIZ: 'QUIZ'
};

const LESSON_TYPE_LABELS = {
  [LESSON_TYPES.VIDEO]: 'Видеоурок',
  [LESSON_TYPES.TEST]: 'Тест',
  [LESSON_TYPES.READING]: 'Чтение',
  [LESSON_TYPES.ASSIGNMENT]: 'Задание',
  [LESSON_TYPES.LIVE_SESSION]: 'Живая сессия',
  [LESSON_TYPES.QUIZ]: 'Квиз'
};

const LESSON_TYPE_ICONS = {
  [LESSON_TYPES.VIDEO]: 'play-circle',
  [LESSON_TYPES.TEST]: 'clipboard-check',
  [LESSON_TYPES.READING]: 'book-open',
  [LESSON_TYPES.ASSIGNMENT]: 'edit-3',
  [LESSON_TYPES.LIVE_SESSION]: 'video',
  [LESSON_TYPES.QUIZ]: 'help-circle'
};

/**
 * Get lesson type label in Russian
 * @param {string} lessonType - Lesson type
 * @returns {string} Russian label
 */
function getLessonTypeLabel(lessonType) {
  return LESSON_TYPE_LABELS[lessonType] || 'Урок';
}

/**
 * Get lesson type icon
 * @param {string} lessonType - Lesson type
 * @returns {string} Icon name
 */
function getLessonTypeIcon(lessonType) {
  return LESSON_TYPE_ICONS[lessonType] || 'play-circle';
}

/**
 * Get navigation URL for lesson based on type
 * @param {Object} lesson - Lesson object
 * @returns {string} Navigation URL
 */
function getLessonNavigationUrl(lesson) {
  const { id, lesson_type, url, test_id } = lesson;

  // If custom URL is provided, use it
  if (url) {
    return url;
  }

  // Generate URL based on lesson type
  switch (lesson_type) {
    case LESSON_TYPES.VIDEO:
      return `/lesson/${id}/video`;
    case LESSON_TYPES.TEST:
      return `/lesson/${id}/test`;
    case LESSON_TYPES.READING:
      return `/lesson/${id}/reading`;
    case LESSON_TYPES.ASSIGNMENT:
      return `/lesson/${id}/assignment`;
    case LESSON_TYPES.LIVE_SESSION:
      return `/lesson/${id}/live`;
    case LESSON_TYPES.QUIZ:
      return `/lesson/${id}/quiz`;
    default:
      return `/lesson/${id}`;
  }
}

/**
 * Check if lesson is accessible based on locked status and user progress
 * @param {Object} lesson - Lesson object
 * @param {boolean} isUnlocked - Whether lesson is unlocked for user
 * @returns {Object} Access information
 */
function getLessonAccess(lesson, isUnlocked) {
  const { locked, lesson_type } = lesson;
  
  return {
    isAccessible: !locked || isUnlocked,
    isLocked: locked && !isUnlocked,
    reason: locked && !isUnlocked ? 'Урок заблокирован. Пройдите предыдущие уроки.' : null,
    type: lesson_type,
    label: getLessonTypeLabel(lesson_type),
    icon: getLessonTypeIcon(lesson_type)
  };
}

/**
 * Format lesson for display with type information
 * @param {Object} lesson - Lesson object
 * @param {boolean} isUnlocked - Whether lesson is unlocked for user
 * @param {boolean} isFinished - Whether lesson is finished by user
 * @returns {Object} Formatted lesson
 */
function formatLesson(lesson, isUnlocked = true, isFinished = false) {
  const access = getLessonAccess(lesson, isUnlocked);
  
  return {
    ...lesson,
    is_finished: isFinished,
    access,
    navigationUrl: getLessonNavigationUrl(lesson),
    typeLabel: access.label,
    typeIcon: access.icon
  };
}

/**
 * Get lesson type configuration
 * @param {string} lessonType - Lesson type
 * @returns {Object} Type configuration
 */
function getLessonTypeConfig(lessonType) {
  return {
    type: lessonType,
    label: getLessonTypeLabel(lessonType),
    icon: getLessonTypeIcon(lessonType),
    navigationUrl: getLessonNavigationUrl({ lesson_type: lessonType, id: 'placeholder' })
  };
}

/**
 * Get all available lesson types
 * @returns {Array} Array of lesson type configurations
 */
function getAllLessonTypes() {
  return Object.values(LESSON_TYPES).map(type => getLessonTypeConfig(type));
}

/**
 * Validate lesson type
 * @param {string} lessonType - Lesson type to validate
 * @returns {boolean} Whether lesson type is valid
 */
function isValidLessonType(lessonType) {
  return Object.values(LESSON_TYPES).includes(lessonType);
}

module.exports = {
  LESSON_TYPES,
  LESSON_TYPE_LABELS,
  LESSON_TYPE_ICONS,
  getLessonTypeLabel,
  getLessonTypeIcon,
  getLessonNavigationUrl,
  getLessonAccess,
  formatLesson,
  getLessonTypeConfig,
  getAllLessonTypes,
  isValidLessonType
};
