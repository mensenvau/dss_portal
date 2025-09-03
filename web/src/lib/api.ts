import { loadConfig } from "./config";

function getAuthToken(): string | null {
  return typeof window !== "undefined" ? localStorage.getItem("auth_token") : null;
}

export function setAuthToken(token: string | null) {
  if (typeof window === "undefined") return;
  if (token) localStorage.setItem("auth_token", token);
  else localStorage.removeItem("auth_token");
}

export async function apiGet(path: string) {
  const cfg = await loadConfig();
  const url = cfg.api_base_url.replace(/\/$/, "") + path;
  const headers: Record<string, string> = { "Content-Type": "application/json" };
  const token = getAuthToken();
  if (token) headers["Authorization"] = `Bearer ${token}`;
  const res = await fetch(url, { method: "GET", headers });
  if (!res.ok) {
    const msg = await safeMessage(res);
    notify("Request failed", msg, "destructive");
    throw new Error(msg);
  }
  return res.json();
}

export async function apiPost(path: string, body: any) {
  const cfg = await loadConfig();
  const url = cfg.api_base_url.replace(/\/$/, "") + path;
  const headers: Record<string, string> = { "Content-Type": "application/json" };
  const token = getAuthToken();
  if (token) headers["Authorization"] = `Bearer ${token}`;
  const res = await fetch(url, { method: "POST", headers, body: JSON.stringify(body) });
  if (!res.ok) {
    const msg = await safeMessage(res);
    notify("Request failed", msg, "destructive");
    throw new Error(msg);
  }
  const data = await res.json();
  notify("Success", data?.message || "Operation completed");
  return data;
}

export async function apiPatch(path: string, body: any) {
  const cfg = await loadConfig();
  const url = cfg.api_base_url.replace(/\/$/, "") + path;
  const headers: Record<string, string> = { "Content-Type": "application/json" };
  const token = getAuthToken();
  if (token) headers["Authorization"] = `Bearer ${token}`;
  const res = await fetch(url, { method: "PATCH", headers, body: JSON.stringify(body) });
  if (!res.ok) {
    const msg = await safeMessage(res);
    notify("Request failed", msg, "destructive");
    throw new Error(msg);
  }
  const data = await res.json();
  notify("Updated", data?.message || "Changes saved");
  return data;
}

export async function apiDelete(path: string) {
  const cfg = await loadConfig();
  const url = cfg.api_base_url.replace(/\/$/, "") + path;
  const headers: Record<string, string> = { "Content-Type": "application/json" };
  const token = getAuthToken();
  if (token) headers["Authorization"] = `Bearer ${token}`;
  const res = await fetch(url, { method: "DELETE", headers });
  if (!res.ok) {
    const msg = await safeMessage(res);
    notify("Request failed", msg, "destructive");
    throw new Error(msg);
  }
  const data = await res.json();
  notify("Deleted", data?.message || "Removed successfully");
  return data;
}

async function safeMessage(res: Response) {
  try {
    const j = await res.json();
    return j?.message || `${res.status} ${res.statusText}`;
  } catch {
    return `${res.status} ${res.statusText}`;
  }
}

function notify(title: string, description?: string, variant?: "default" | "destructive") {
  if (typeof window === "undefined") return;
  // Lazy-load to avoid marking server modules as client.
  import("@/components/ui/use-toast").then((m) => m.toast({ title, description, variant })).catch(() => {});
}
