export interface Category {
  id: string;
  name: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Course {
  id: number;
  title: string;
  description: string;
  image_src: string;
  price: number;
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
  enrollment_count: number;
  review_count: number;
  created_at: string;
  updated_at: string;
}

export interface Chapter {
  id: string;
  title: string;
  description: string;
  videoUrl: string;
  position: number;
  isPublished: boolean;
  isFree: boolean;
  courseId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface UserProgress {
  id: string;
  userId: string;
  chapterId: string;
  isCompleted: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface Purchase {
  id: string;
  userId: string;
  courseId: string;
  createdAt: Date;
  updatedAt: Date;
} 