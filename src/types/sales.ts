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

export interface PurchaseCourseRequest {
  course_id: number;
  payment_method: "card" | "bank_transfer" | "cash";
  card_number?: string;
  card_holder?: string;
  expiry_date?: string;
  cvv?: string;
}

export interface PurchaseCourseResponse {
  success: boolean;
  message: string;
  purchase: {
    id: number;
    amount: number;
    payment_method: string;
    payment_status: string;
    created_at: string;
  };
  enrollment: {
    id: number;
    enrolled_at: string;
  };
  course: {
    id: number;
    title: string;
    description: string | null;
    image_src: string | null;
    price: number;
    author_name?: string;
    author_avatar?: string | null;
  };
}

export type PayStatus = "idle" | "loading" | "success" | "error";
