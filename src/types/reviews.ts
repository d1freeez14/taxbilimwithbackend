import {Pagination} from "@/types/course";

export type ReviewItem = {
  id: number;
  user_id: number;
  course_id: number;
  rating: number;
  comment: string;
  created_at: string;
  updated_at: string;
  // эти поля приходят в списке/моём отзыве (судя по доку)
  user_name?: string;
  user_avatar?: string;
};

export type CourseReviewsResponse = {
  reviews: ReviewItem[];
  pagination: Pagination;
};

export type CanReviewResponse = {
  canReview: boolean;
  hasExistingReview: boolean;
  progressPercentage: number;
  completedLessons: number;
  totalLessons: number;
  message: string;
};
