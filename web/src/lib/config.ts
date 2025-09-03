export type AppConfig = {
  site_name: string;
  api_base_url: string;
  menu: { label: string; href: string }[];
  // Optional: present in app-config.json for sidebar rendering
  sidebar?: { label: string; href: string; icon?: string; roles?: string[] }[];
};

let cached_config: AppConfig | null = null;

export async function loadConfig(): Promise<AppConfig> {
  if (cached_config) return cached_config;
  try {
    const res = await fetch("/app-config.json", { cache: "no-store" });
    const json = (await res.json()) as Partial<AppConfig>;
    const merged: AppConfig = {
      site_name: process.env.NEXT_PUBLIC_NAME || json.site_name || "App",
      api_base_url: process.env.NEXT_PUBLIC_API_BASE_URL || json.api_base_url || "http://localhost:55000",
      menu: json.menu || [],
      sidebar: json.sidebar as any,
    };
    cached_config = merged;
    return merged;
  } catch (_err) {
    const fallback: AppConfig = {
      site_name: process.env.NEXT_PUBLIC_NAME || "App",
      api_base_url: process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:55000",
      menu: [],
    };
    cached_config = fallback;
    return fallback;
  }
}

export function getCachedConfig(): AppConfig | null {
  return cached_config;
}
