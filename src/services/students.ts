import {TeacherCoursesResponse} from "@/types/course";
import {StudentsResponse} from "@/types/student";

const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL || 'http://89.219.32.91:5001';

export const StudentsService = {

  getTeacherStudents: async (token: string) => {
    const res = await fetch(`${BACKEND_URL}/api/teacher/students/students`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      cache: "no-store",
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data?.message || "Error fetching teacher courses");
    return data as StudentsResponse
    // return (data.certificates || []) as Certificate[];
  },
}
