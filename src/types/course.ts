export type ContentType = "video" | "text" | "quiz" | "download";
export type LessonKind = "VIDEO" | "READING" | "TEST" | "ASSIGNMENT" | "LIVE_SESSION" | "QUIZ";

/** Full lesson shape (detailed view) — unchanged */
export interface LessonAccess {
  isAccessible: boolean;
  isLocked: boolean;
  reason: string | null;
  /** API sends e.g. "VIDEO" */
  type: LessonKind;
  label: string;      // e.g., "Видеоурок"
  icon: string;       // e.g., "play-circle" (Iconify name)
}

export interface Lesson {
  id: number;
  title: string;
  duration: number;
  order: number;

  // Progress/completion
  completed: boolean;
  completed_at: string | null;

  // Content & links
  content: string;
  video_url: string | null;

  // Relations
  course_id: number;
  course_title: string;
  module_id: number;
  module_title: string;

  // Audit
  created_at: string;
  updated_at: string;

  // Existing optional
  content_type?: ContentType;

  // NEW (from payload)
  image?: string | null;
  locked?: boolean;
  lesson_type?: LessonKind;     // UPPERCASE from API
  test_id?: number | null;
  url?: string | null;
  is_unlocked?: boolean;
  is_finished?: boolean;
  access?: LessonAccess;
  navigationUrl?: string;       // e.g., "/lesson/2/video"
  typeLabel?: string;           // e.g., "Видеоурок"
  typeIcon?: string;            // e.g., "play-circle"
}

/** NEW: compact lesson used in module listings */
export interface LessonPreview {
  id: number;
  title: string;
  duration: number;
  order: number;
  image: string | null;
  locked: boolean;
  lesson_type: LessonKind;     // e.g. "VIDEO"
  test_id: number | null;
  url: string | null;
}

/** Allow either full lessons or previews in module payloads */
export type ModuleLesson = Lesson | LessonPreview;

/** NEW: stats block for modules */
export interface CourseModuleStatistics {
  lessonCount: number;
  assignmentCount: number;
  totalDuration: number;
  durationWeeks: number;
  formattedDuration: string;
}

export interface CourseModule {
  id: number;
  title: string;
  order: number;
  course_id: number;

  /** NEW snake_case aggregates from API */
  lesson_count?: number;
  assignment_count?: number;
  total_duration?: number;
  duration_weeks?: number;

  created_at: string;   // ISO
  updated_at: string;   // ISO

  /** Can be full lessons or preview items depending on endpoint */
  lessons: ModuleLesson[];

  /** NEW camelCase stats + human summary */
  statistics?: CourseModuleStatistics;
  summaryText?: string;
}

/** Reviews: stats + latest reviews */
export interface ReviewDistribution {
  five_star: number;
  four_star: number;
  three_star: number;
  two_star: number;
  one_star: number;
}

export interface ReviewStatistics {
  total: number;
  average: number;
  distribution: ReviewDistribution;
}

export interface RecentReview {
  id: number;
  user_id: number;
  course_id: number;
  rating: number;
  comment: string;
  created_at: string;
  updated_at: string;
  user_name: string;
  user_avatar: string | null;
}

export interface CourseReviews {
  statistics: ReviewStatistics;
  recent_reviews: RecentReview[];
}

/** Matches the `statistics` object inside each course */
export interface CourseStatistics {
  moduleCount: number;
  lessonCount: number;
  totalDuration: number;
  formattedDuration: string;
}

export interface Course {
  id: number;
  title: string;
  description: string;
  image_src: string;
  price: number | string;
  bg?: string;
  is_published: boolean;
  is_sales_leader: boolean;
  is_recorded: boolean;
  is_favorite?: boolean;
  is_finished?: boolean;

  features?: string[];
  what_you_learn?: string[];

  author_id: number;
  author_name: string;
  author_avatar: string;
  author_bio?: string;

  enrollment_count: number | string;
  review_count: number | string;

  created_at: string;
  updated_at?: string;
  category_id?: number;

  /** From payload */
  progress?: number;
  module_count?: number;
  lesson_count?: number;
  total_duration?: number;
  average_rating?: number | string;
  statistics?: CourseStatistics;
  summaryText?: string;

  modules?: CourseModule[];
  reviews?: CourseReviews;
}

export interface Enrollment {
  id: number;
  user_id: number;
  course_id: number;
  enrolled_at: string;
  completed_at: string | null;
  course_title: string;
  course_image: string;
  course_price: string;
  author_name: string;
}


/** Wrapper for list + pagination */
export interface Pagination {
  page: number;
  limit: number;
  total: number;
  pages: number;
}

export interface CoursesListResponse {
  courses: Course[];
  pagination: Pagination;
}
