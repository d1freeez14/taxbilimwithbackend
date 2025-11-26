// If your API may return other statuses, change to: type CourseStatus = string;
type CourseStatus = 'active' | 'completed' | 'canceled' | 'expired';

export interface StudentsResponse {
  success: boolean;
  students: Student[];
  pagination: Pagination;
  filters: Record<string, unknown>;
}

export interface Student {
  id: number;
  name: string;
  email: string;
  avatar: string | null;
  user_created_at: string;
  total_enrollments: string;
  completed_courses: string;
  last_enrollment_date: string;
  total_spent: number;
  average_rating: number;
  courses: Course[];
}

export interface Course {
  id: number;
  title: string;
  price: number;
  enrolled_at: string;
  completed_at: string | null;
  status: CourseStatus | string;
}

export interface Pagination {
  page: number;
  limit: number;
  total: number;
  pages: number;
}
