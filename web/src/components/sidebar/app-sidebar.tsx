"use client";

import * as React from "react";
import { usePathname } from "next/navigation";
import { Book, Calendar, Clock, Home, Link2, List, Shield, Users, Wallet, Command } from "lucide-react";
import { Sidebar, SidebarContent, SidebarHeader, SidebarRail } from "@/components/ui/sidebar";
import { NavMain } from "@/components/sidebar/nav-main";
import { useConfig } from "@/lib/config-provider";
import { useAuth } from "@/lib/auth-provider";
import { NavUser } from "./nav-user";
import { CompanyLogo } from "./company-logo";

const ICONS: Record<string, any> = {
  home: Home,
  book: Book,
  calendar: Calendar,
  users: Users,
  link: Link2,
  list: List,
  clock: Clock,
  wallet: Wallet,
  shield: Shield,
};

function hasRole(effective: string[], required?: string[]) {
  if (!required || required.length === 0) return true;
  const set = new Set(effective);
  if (set.has("admin")) return true;
  return required.some((r) => set.has(r));
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { config } = useConfig();
  const { user } = useAuth();
  const pathname = usePathname();
  const roles = React.useMemo(() => Array.from(new Set([user?.role || "guest", ...(user?.roles || [])])), [user]);
  const items = React.useMemo(() => {
    const src = (config?.sidebar || []) as any[];
    return src
      .filter((it) => hasRole(roles, it.roles))
      .map((it) => ({
        title: it.label,
        url: it.href,
        icon: ICONS[it.icon] || Home,
        isActive: pathname === it.href,
      }));
  }, [config?.sidebar, roles, pathname]);

  const company = React.useMemo(() => {
    return { name: config?.site_name || "App", version: (config as any)?.site_version || "v1.0.0" };
  }, [config]);

  return (
    <Sidebar className="border-r-0" {...props}>
      <SidebarHeader>
        <CompanyLogo company={company} />
        <NavMain items={items} />
      </SidebarHeader>
      <SidebarContent />
      <SidebarRail />
      <NavUser />
    </Sidebar>
  );
}
