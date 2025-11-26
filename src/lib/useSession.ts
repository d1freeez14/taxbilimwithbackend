"use client";

import {useCallback, useEffect, useState} from "react";
import {ISession} from "@/types/user";

export const useSession = () => {
  const [session, setSession] = useState<ISession | null>(null);
  const [ready, setReady] = useState(false);

  // Load session once on client mount
  useEffect(() => {
    if (typeof window === "undefined") return;

    const stored = localStorage.getItem("session");
    if (stored) {
      try {
        setSession(JSON.parse(stored) as ISession);
      } catch {
        setSession(null);
      }
    }
    setReady(true);
  }, []);

  const saveSession = useCallback((newSession: ISession) => {
    if (typeof window !== "undefined") {
      localStorage.setItem("session", JSON.stringify(newSession));
    }
    setSession(newSession);
  }, []);

  const removeSession = useCallback(() => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("session");
    }
    setSession(null);
  }, []);

  return { session, ready, saveSession, removeSession };
};
