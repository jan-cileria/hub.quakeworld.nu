import { useEffect, useState } from "react";

const API_URL = import.meta.env.VITE_API_URL as string;

export interface AuthUser {
  id: string;
  username: string;
  discriminator: string;
  avatar: string | null;
  email?: string | null;
  provider: "discord";
}

export function useAuth() {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch(`${API_URL}/auth/me`, {
          credentials: "include", // important so cookies are sent
        });

        if (!res.ok) {
          setUser(null);
        } else {
          const data = await res.json();
          setUser(data.user);
        }
      } catch {
        setUser(null);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const logout = async () => {
    await fetch(`${API_URL}/auth/logout`, {
      method: "POST",
      credentials: "include",
    });
    setUser(null);
  };

  return { user, loading, logout };
}