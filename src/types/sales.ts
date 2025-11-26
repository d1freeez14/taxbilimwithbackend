export interface DashboardStatsResponse {
  success: boolean;
  stats: Stats;
  monthly_stats: MonthlyStat[];
  top_courses: TopCourse[];
}

export interface Stats {
  total_courses: number;
  published_courses: number;
  draft_courses: number;
  total_enrollments: number;
  completed_enrollments: number;
  active_enrollments: number;
  total_revenue: number;
  average_rating: number;
  total_reviews: number;
}

export interface MonthlyStat {
  month: string;
  enrollments: number;
  revenue: number;
}

export interface TopCourse {
  id: number;
  title: string;
  price: number;
  enrollments: number;
  revenue: number;
  rating: number;
  reviews_count: number;
}
