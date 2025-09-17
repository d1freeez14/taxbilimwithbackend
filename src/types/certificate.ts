export interface Certificate {
  id: number;
  user_id: number;
  course_id: number;
  issued_at: string;
  certificate_url: string;
  course_title: string;
  course_image: string;
  course_description: string;
  author_name: string;
  author_avatar: string;
}