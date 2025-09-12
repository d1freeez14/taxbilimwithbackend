export type ContentType = "video" | "text" | "quiz" | "download";

export interface Lesson {
  id: number;
  title: string;
  duration: number;
  order: number;
  completed: boolean;
  completed_at: string | null;
  content: string;
  course_id: number;
  course_title: string;
  module_id: number;
  module_title: string;
  created_at: string;
  updated_at: string;
  video_url: string | null;
  content_type?: ContentType;
}

export interface CourseModule {
  id: number;
  title: string;
  order: number;
  course_id: number;
  created_at: string;   // ISO
  updated_at: string;   // ISO
  lessons: Lesson[];
}

// Reviews: stats + latest reviews
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

export interface Course {
  id: number;
  title: string;
  description: string;
  image_src: string;
  price: number | string;
  bg: string;
  is_published: boolean;
  is_sales_leader: boolean;
  is_recorded: boolean;
  is_favorite?: boolean;
  features: string[];
  what_you_learn: string[];
  author_id: number;
  author_name: string;
  author_avatar: string;
  author_bio?: string;
  enrollment_count: number | string;
  review_count: number | string;
  created_at: string;
  updated_at?: string;
  category_id?: number;

  // New fields
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

export interface Certificate {
  id: number;
  user_id: number;
  course_id: number;
  certificate_url: string;
  issued_at: string;
  course_title: string;
  course_image: string;
  author_name: string;
}
