import {ISession, User} from "@/types/user";

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
    if (response.status !== 200 && response.status !== 201) {
      throw new Error(data.non_field_errors?.join("\n") || "Error while registering");
    }
    return data as ISession;
  },
  getProfile: async (token: string) => {
    const response = await fetch(`${BACKEND_URL}/api/auth/profile`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    const data = (await response.json()) as { user:User } & { message?: string };

    if (!response.ok) {
      throw new Error((data as any).message || "Error while fetching profile");
    }

    return data; // { user }
  },

  // ✅ Update profile (new)
  updateProfile: async (
    token: string,
    payload: { name?: string; avatar?: string | null }
  ) => {
    const response = await fetch(`${BACKEND_URL}/api/auth/profile`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    });

    const data = (await response.json()) as { message: string; user: User } & { message?: string };

    if (!response.ok) {
      throw new Error((data as any).message || "Error while updating profile");
    }

    return data; // { message, user }
  },

  // ✅ Change password (new)
  changePassword: async (
    token: string,
    payload: {
      oldPassword: string;
      newPassword: string;
      confirmNewPassword: string;
    }
  ) => {
    const response = await fetch(`${BACKEND_URL}/api/auth/password`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    });

    const data = (await response.json()) as { message: string } & { message?: string };

    if (!response.ok) {
      throw new Error((data as any).message || "Error while changing password");
    }

    return data; // { message }
  },
}
