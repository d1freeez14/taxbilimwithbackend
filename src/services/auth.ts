import {ISession} from "@/types/user";

const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL || 'http://89.219.32.91:5001';

export const AuthService = {
  login: async (email: string, password: string) => {
    const response = await fetch(`${BACKEND_URL}/api/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    const data = await response.json();
    if (response.status !== 200) {
      throw new Error(data.non_field_errors?.join("\n") || "Error while logging in");
    }
    return data as ISession;
  },

  register: async (name: string, email: string, password: string) => {
    const response = await fetch(`${BACKEND_URL}/api/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password }),
    });
    const data = await response.json();
    if (response.status !== 200) {
      throw new Error(data.non_field_errors?.join("\n") || "Error while registering");
    }
    return data as ISession;
  },
}