import { apiGet } from "./api";

export type AuthUser = {
  id: number | null;
  email: string | null;
  role: string | null;
  roles: string[];
  name?: string | null;
};

function getAuthToken(): string | null {
  return typeof window !== "undefined" ? localStorage.getItem("auth_token") : null;
}

export async function loadMe(): Promise<AuthUser | null> {
  try {
    const token = getAuthToken();
    if (!token) return null;
    const r = await apiGet("/api/auth/me");
    return (r?.user || null) as AuthUser | null;
  } catch (_err) {
    return null;
  }
}
