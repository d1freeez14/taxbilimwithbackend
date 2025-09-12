export interface User {
  id: number;
  email: string;
  name: string;
  avatar: string | null;
  role: "STUDENT" | "TEACHER" | "ADMIN"; // expand if needed
  created_at: string;
  updated_at: string;
}

export interface ISession {
  token: string;
  user: User;
}

export interface DashboardStats {
  enrolledCourses: number;
  completedCourses: number;
  certificates: number;
  totalProgress: number;
}