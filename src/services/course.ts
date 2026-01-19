import {
  Category,
  ContentType,
  Course,
  CourseModule, CoursesListResponse,
  Enrollment,
  Lesson,
  LessonKind, Pagination,
  TeacherCoursesResponse
} from "@/types/course";
import {Certificate} from "@/types/certificate";

const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL || 'http://89.219.32.91:5001';
type GetCoursesParams = {
  page?: number;
  limit?: number;
  search?: string;
  category?: number | string | null;
};
export const CourseService = {
  getAllCourses: async (token: string, params?: {
    page?: number;
    limit?: number;
    search?: string;
    category?: number | null;
  }) => {
    const qs = new URLSearchParams();
    if (params?.page) qs.set("page", String(params.page));
    if (params?.limit) qs.set("limit", String(params.limit));
    // backend expects `search`
    if (params?.search?.trim()) qs.set("search", params.search.trim());
    // backend expects `category`
    if (params?.category !== null && params?.category !== undefined) {
      qs.set("category", String(params.category));
    }

    const url = `${BACKEND_URL}/api/courses${qs.toString() ? `?${qs.toString()}` : ""}`;

    const res = await fetch(url, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      cache: "no-store",
    });

    const data = await res.json();
    if (!res.ok) {
      throw new Error(data?.message || "Error fetching courses");
    }

    // backend returns { courses: [...], pagination: {...} }
    return data as CoursesListResponse;
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
  markCourseComplete: async (courseId: string | number, token: string) => {
    const res = await fetch(`${BACKEND_URL}/api/enrollments/${courseId}/complete`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    const data = await res.json();
    if (!res.ok) {
      throw new Error(data?.message || "Error completing course");
    }
    return data as {
      message: string;
      enrollment: Enrollment;
    };
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
  getMyEducationByCourseId: async (id: string, token: string) => {
    const res = await fetch(`${BACKEND_URL}/api/courses/${id}/myeducation`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      cache: "no-store",
    });

    const data = await res.json();
    if (!res.ok) {
      throw new Error(data?.message || "Error fetching my education course");
    }
    return data.course as Course;
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
      courseProgress: {
        courseId: number;
        progressPercentage: number;
        totalLessons: number;
        completedLessons: number;
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
      courseProgress: {
        courseId: number;
        progressPercentage: number;
        totalLessons: number;
        completedLessons: number;
      };
    };
  },
  // TEACHER, ADMIN
  createCourse: async (payload: {
    title: string;
    description: string;
    price: number;
    features: string[];
    whatYouLearn: string[];
    category_id: number;
    access_duration: string;
    video_url?: string;
  }, token: string) => {
    const res = await fetch(`${BACKEND_URL}/api/courses`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    const data = await res.json();
    if (!res.ok) {
      throw new Error(data?.message || "Error creating course");
    }

    return data;
  },
  getCategories: async (token: string) => {
    const res = await fetch(`${BACKEND_URL}/api/categories`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      cache: "no-store",
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data?.message || "Error fetching categories");
    return data.categories as Category[]
    // return (data.certificates || []) as Certificate[];
  },

  getTeacherCourses: async (token: string) => {
    const res = await fetch(`${BACKEND_URL}/api/teacher/courses/my-courses`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      cache: "no-store",
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data?.message || "Error fetching teacher courses");
    return data as TeacherCoursesResponse
    // return (data.certificates || []) as Certificate[];
  },

  updateCoursePublishStatus: async (
    id: number | string,
    isPublished: boolean,
    token: string
  ) => {
    const res = await fetch(`${BACKEND_URL}/api/courses/${id}/publish`, {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ isPublished }),
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data?.message || "Error updating course publish status");
    }

    return data.course as Course;
  },

  createModule: async (
    payload: {
      courseId: number;
      title: string;
      description?: string;
      order: number;
    },
    token: string
  ) => {
    const res = await fetch(`${BACKEND_URL}/api/modules`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data?.message || "Error creating module");
    }

    return data.module as CourseModule;
  },
  updateModule: async (
    moduleId: number,
    payload: { title: string; order: number },
    token: string
  ) => {
    const res = await fetch(`${BACKEND_URL}/api/modules/${moduleId}`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data?.message || "Error updating module");
    }

    return data.module; // или data, если бэк так отдаёт
  },
  deleteModule: async (moduleId: number, token: string) => {
    const res = await fetch(`${BACKEND_URL}/api/modules/${moduleId}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    const data = await res.json().catch(() => ({}));

    if (!res.ok) {
      throw new Error(data?.message || "Error deleting module");
    }

    return data;
  },
  // создание урока
  createLesson: async (
    payload: {
      moduleId: number;
      title: string;
      content: string;
      duration: number;
      lessonType: LessonKind;
      video_url?: string | null;
      order: number;
    },
    token: string
  ) => {
    const res = await fetch(`${BACKEND_URL}/api/lessons`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload), // { moduleId, title, ... }
    });

    const data = await res.json();
    if (!res.ok) {
      throw new Error(data?.message || "Error creating lesson");
    }

    return data.lesson as Lesson; // подстрой под свой ответ бэка
  },

  // удаление урока
  deleteLesson: async (lessonId: number, token: string) => {
    const res = await fetch(`${BACKEND_URL}/api/lessons/${lessonId}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    const data = await res.json().catch(() => ({}));

    if (!res.ok) {
      throw new Error(data?.message || "Error deleting lesson");
    }

    return data;
  },
  // обновление урока
  updateLesson: async (
    lessonId: number,
    payload: {
      moduleId: number;
      title: string;
      content: string;
      duration: number;
      lessonType: LessonKind;
      video_url?: string | null;
      order: number;
      testId?: number | null;   // 👈 добавили
    },
    token: string
  ) => {
    const res = await fetch(`${BACKEND_URL}/api/lessons/${lessonId}`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    const data = await res.json();
    if (!res.ok) {
      throw new Error(data?.message || "Error updating lesson");
    }

    return data.lesson as Lesson;
  },
  createTest: async (
    payload: {
      title: string;
      description?: string;
      lessonId: number;
      timeLimit?: number;
      passingScore?: number;
    },
    token: string
  ) => {
    const res = await fetch(`${BACKEND_URL}/api/tests`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    const data = await res.json();
    if (!res.ok) {
      throw new Error(data?.message || "Error creating test");
    }

    return data.test; // подстрой под реальный ответ
  },
  updateTest: async (
    testId: number,
    payload: {
      title?: string;
      description?: string;
      timeLimit?: number;
      passingScore?: number;
    },
    token: string
  ) => {
    const res = await fetch(`${BACKEND_URL}/api/tests/${testId}`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    const data = await res.json();
    if (!res.ok) {
      throw new Error(data?.message || "Error updating test");
    }

    return data.test;
  },

  deleteTest: async (testId: number, token: string) => {
    const res = await fetch(`${BACKEND_URL}/api/tests/${testId}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      throw new Error(data?.message || "Error deleting test");
    }

    return data;
  },

  createTestQuestion: async (
    testId: number,
    payload: {
      questionText: string;
      questionType: string;
      options: string[];
      correctAnswer: string;
      points: number;
      questionOrder: number;
    },
    token: string
  ) => {
    const res = await fetch(`${BACKEND_URL}/api/tests/${testId}/questions`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    const data = await res.json();
    if (!res.ok) {
      console.error("Validation errors:", data);
      throw new Error("Failed to create test question");
    }

    return data.question;
  },
  // Получить все вопросы теста по id
  getTestQuestions: async (
    testId: number | string,
    token: string
  ) => {
    const res = await fetch(`${BACKEND_URL}/api/tests/${testId}/questions`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      cache: "no-store",
    });

    const data = await res.json();
    if (!res.ok) {
      throw new Error(data?.message || "Error fetching test questions");
    }

    // массив вопросов из бэка
    return data.questions as {
      id: number;
      test_id: number;
      question_text: string;
      question_type: "multiple_choice" | "true_false" | "text";
      options: string[];              // JSONB → парсится в массив
      correct_answer: string;
      points: number;
      question_order: number;
      created_at: string;
      updated_at: string | null;
    }[];
  },

  // Обновить вопрос теста
  updateTestQuestion: async (
    testId: number | string,
    questionId: number | string,
    payload: {
      questionText?: string;
      questionType?: "multiple_choice" | "true_false" | "text";
      options?: string[];
      correctAnswer?: string;
      points?: number;
      questionOrder?: number;
    },
    token: string
  ) => {
    const res = await fetch(
      `${BACKEND_URL}/api/tests/${testId}/questions/${questionId}`,
      {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      }
    );

    const data = await res.json();
    if (!res.ok) {
      console.error("Validation errors:", data);
      throw new Error(data?.message || "Error updating test question");
    }

    return data.question as {
      id: number;
      test_id: number;
      question_text: string;
      question_type: "multiple_choice" | "true_false" | "text";
      options: string[];
      correct_answer: string;
      points: number;
      question_order: number;
      created_at: string;
      updated_at: string | null;
    };
  },

  // Удалить вопрос теста
  deleteTestQuestion: async (
    testId: number | string,
    questionId: number | string,
    token: string
  ) => {
    const res = await fetch(
      `${BACKEND_URL}/api/tests/${testId}/questions/${questionId}`,
      {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    const data = await res.json().catch(() => ({}));

    if (!res.ok) {
      throw new Error(data?.message || "Error deleting test question");
    }

    return data as { message?: string };
  },
}
