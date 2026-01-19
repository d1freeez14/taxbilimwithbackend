import {TeacherCoursesResponse} from "@/types/course";
import {StudentsResponse} from "@/types/student";
import {DashboardStatsResponse, PurchaseCourseRequest, PurchaseCourseResponse} from "@/types/sales";

const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL || 'http://89.219.32.91:5001';

export const SalesService = {

  getTeacherDashboardStats: async (token: string) => {
    const res = await fetch(`${BACKEND_URL}/api/teacher/stats/dashboard-stats`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      cache: "no-store",
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data?.message || "Error fetching teacher courses");
    return data as DashboardStatsResponse
    // return (data.certificates || []) as Certificate[];
  },

  purchaseCourse: async (token: string, payload: PurchaseCourseRequest) => {
    const res = await fetch(`${BACKEND_URL}/api/sales/purchase`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data?.message || "Error purchasing course");
    return data as PurchaseCourseResponse;
  },
}
