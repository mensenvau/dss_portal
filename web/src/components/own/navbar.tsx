"use client";

import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";
import { useState } from "react";
import { useConfig } from "@/lib/config-provider";
import { useAuth } from "@/lib/auth-provider";
import Link from "next/link";
import Image from "next/image";

export function Navbar() {
  const { config } = useConfig();
  const [menu_open, set_menu_open] = useState(false);
  const { user } = useAuth();

  function toggleMenu() {
    set_menu_open(!menu_open);
  }

  return (
    <nav className="w-full bg-white border-b sticky top-0 z-50">
      <div className="mx-auto max-w-7xl flex items-center justify-between px-4 py-3">
        {/* Logo / Site name */}
        <div className="flex items-center gap-2">
          <Image src="/logo.png" alt="" width={120} height={80} priority />
          {/* <span className="font-bold tracking-wide">{config?.site_name || "App"}</span> */}
        </div>
        {/* Desktop Links */}
        <div className="hidden md:flex flex-1 justify-left ml-4">
          {(config?.menu || []).map((item) => (
            <Link key={item.href} href={item.href} className="text-gray-700 hover:text-blue-600 transition-colors font-medium px-2 py-1 rounded hover:bg-gray-100">
              {item.label}
            </Link>
          ))}
        </div>

        {/* Action */}
        <div className="hidden md:flex gap-2 items-center">
          {!user && (
            <>
              <Link href="/login">
                <Button variant="default">Login</Button>
              </Link>
              <Link href="/register">
                <Button variant="outline">Register</Button>
              </Link>
            </>
          )}

          {user && (
            <Link href="/dashboard">
              <Button variant="default">Hello, {user.name || user.email}</Button>
            </Link>
          )}
        </div>
        {/* Mobile Menu Button */}
        <button className="md:hidden p-2" onClick={toggleMenu} aria-label="Toggle Menu">
          <Menu className="h-6 w-6 text-gray-700" />
        </button>
      </div>

      {/* Mobile Menu */}
      {menu_open && (
        <div className="md:hidden px-4 pb-4 space-y-2">
          {(config?.menu || []).map((item) => (
            <Link key={item.href} href={item.href} className="block text-gray-700 hover:text-blue-600 transition-colors">
              {item.label}
            </Link>
          ))}
          {!user && (
            <div className="pt-2 flex gap-2">
              <Link href="/login">
                <Button variant="default">Login</Button>
              </Link>
              <Link href="/register">
                <Button variant="outline">Register</Button>
              </Link>
            </div>
          )}
        </div>
      )}
    </nav>
  );
}
