import {useCallback} from "react";
import {ISession} from "@/types/user";

export const useSession = () => {
  const saveSession = useCallback((session: ISession) => {
    if (typeof window !== "undefined") {
      localStorage.setItem("session", JSON.stringify(session));
    }
  }, []);

  const getSession = useCallback((): ISession | null => {
    if (typeof window !== "undefined") {
      const session = localStorage.getItem("session");
      return session ? (JSON.parse(session) as ISession) : null;
    }
    return null;
  }, []);

  const removeSession = useCallback(() => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("session");
    }
  }, []);

  return { saveSession, getSession, removeSession };
};