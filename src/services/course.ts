import {Course, CourseModule, Enrollment, Lesson} from "@/types/course";
import {Certificate} from "@/types/certificate";

const BACKEND_URL = (typeof window !== 'undefined' ? process.env.NEXT_PUBLIC_API_URL : undefined) || 'http://89.219.32.91:5001';

export const CourseService = {
  getAllCourses: async (token: string) => {
    const res = await fetch(`${BACKEND_URL}/api/courses`, {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    const data = await res.json();
    if (!res.ok) {
      throw new Error(data?.message || "Error fetching courses");
    }

    return data.courses as Course[];
  },
  getCourseById: async (id: string, token: string) => {
    const res = await fetch(`${BACKEND_URL}/api/courses/${id}`, {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    const data = await res.json();
    if (!res.ok) {
      throw new Error(data?.message || "Error fetching course");
    }

    return data.course as Course;
  },
  getMyEnrollments: async (token: string) => {
    const res = await fetch(`${BACKEND_URL}/api/enrollments/my-enrollments`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      cache: "no-store",
    });

    const data = await res.json();
    if (!res.ok) {
      throw new Error(data?.message || "Error fetching enrollments");
    }
    return data.enrollments as Enrollment[];
  },
  getModulesByCourseId: async (id: string, token: string) => {
    const res = await fetch(`${BACKEND_URL}/api/modules/course/${id}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      cache: "no-store",
    });

    const data = await res.json();
    if (!res.ok) {
      throw new Error(data?.message || "Error fetching enrollments");
    }
    return data.modules as CourseModule[];
  },
  getLessonById: async (id: string, token: string) => {
    const res = await fetch(`${BACKEND_URL}/api/lessons/${id}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      cache: "no-store",
    });

    const data = await res.json();
    if (!res.ok) {
      throw new Error(data?.message || "Error fetching enrollments");
    }
    return data.lesson as Lesson;
  },
  getMyCertificates: async (token: string) => {
    const res = await fetch(`${BACKEND_URL}/api/certificates/my-certificates`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      cache: "no-store",
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data?.message || "Error fetching certificates");
    return (data.certificates || []) as Certificate[];
  },
  markLessonComplete: async (id: string | number, token: string) => {
    const res = await fetch(`${BACKEND_URL}/api/lessons/${id}/complete`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data?.message || "Failed to mark lesson completed");
    return data as {
      message: string;
      progress: {
        id: number;
        user_id: number;
        lesson_id: number;
        completed: boolean;
        completed_at: string | null;
        created_at: string;
        updated_at: string;
      };
    };
  },

  markLessonIncomplete: async (id: string | number, token: string) => {
    const res = await fetch(`${BACKEND_URL}/api/lessons/${id}/incomplete`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data?.message || "Failed to mark lesson incomplete");
    return data as {
      message: string;
      progress: {
        id: number;
        user_id: number;
        lesson_id: number;
        completed: boolean;
        completed_at: string | null;
        created_at: string;
        updated_at: string;
      };
    };
  },
}