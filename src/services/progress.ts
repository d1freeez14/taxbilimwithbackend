const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL || 'http://89.219.32.91:5001';

export const ProgressService = {
  getCourseProgressById: async (id:string,token: string) => {
    const res = await fetch(`${BACKEND_URL}/api/progress/course/${id}`, {
      method: "GET",
      headers: {
        "Authorization": `Token ${token}`,
        "Content-Type": "application/json",
      },
    });

    const data = await res.json();
    if (!res.ok) {
      throw new Error(data?.message || "Error fetching courses");
    }

    return data;
  },
}