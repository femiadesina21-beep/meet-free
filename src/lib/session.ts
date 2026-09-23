export type SessionUser = {
  id: string;
  name: string;
  email: string;
  age: number;
  gender: string;
  bio: string;
  location: string;
  interests: string[];
  avatar: string;
  isVerified?: boolean;
};

const KEY = "meetfree_user";

export function getSession(): SessionUser | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return null;
    return JSON.parse(raw) as SessionUser;
  } catch {
    return null;
  }
}

export function setSession(user: SessionUser) {
  if (typeof window === "undefined") return;
  localStorage.setItem(KEY, JSON.stringify(user));
}

export function clearSession() {
  if (typeof window === "undefined") return;
  localStorage.removeItem(KEY);
}
