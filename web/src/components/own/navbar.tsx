"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";
import { useState } from "react";
import Image from "next/image";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleMenu = () => setMenuOpen(!menuOpen);

  return (
    <nav className="w-full bg-white border-b sticky top-0 z-50">
      <div className="mx-auto max-w-7xl flex items-center justify-between px-4 py-3">
        {/* Logo */}
        <Image src="/logo.png" alt="" width={120} height={80} priority />
        {/* Desktop Links */}
        <div className="hidden w-full md:flex justify-start space-x-6 px-8">
          <Link href="/" className="text-gray-700 hover:text-blue-600 font-semibold transition-colors">
            Home
          </Link>
          <Link href="#about" className="text-gray-700 hover:text-blue-600 font-semibold transition-colors">
            About
          </Link>
          <Link href="#contact" className="text-gray-700 hover:text-blue-600 font-semibold transition-colors">
            Contact Us
          </Link>
          <Link href={process.env.NEXT_PUBLIC_MEDIUM as any} target="_blank" className="text-gray-700 hover:text-blue-600 font-semibold transition-colors">
            Blog
          </Link>
        </div>

        {/* Action */}
        <div className="hidden md:flex gap-2">
          <Link href={process.env.NEXT_PUBLIC_FOR_TALEND as any} target="_blank">
            <Button className="font-semibold transition-colors rounded-none" variant="outline">
              Apply as a Talent
            </Button>
          </Link>

          <Link href={process.env.NEXT_PUBLIC_FOR_CLIENT as any} target="_blank">
            <Button className="bg-red-600 hover:bg-red-700 text-white font-semibold px-4 py-2 rounded-none transition" variant="default">
              Hire Top Talent
            </Button>
          </Link>
        </div>
        {/* Mobile Menu Button */}
        <button className="md:hidden p-2" onClick={toggleMenu} aria-label="Toggle Menu">
          <Menu className="h-6 w-6 text-gray-700" />
        </button>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden px-4 pb-4 space-y-2">
          <Link href="/services" className="block text-gray-700 hover:text-blue-600 transition-colors">
            Services
          </Link>
          <Link href="/about" className="block text-gray-700 hover:text-blue-600 transition-colors">
            About
          </Link>
          <Link href="https://medium.com/databek" className="block text-gray-700 hover:text-blue-600 transition-colors">
            Blog
          </Link>
          <Button className="bg-red-600 hover:bg-red-700 text-white font-semibold px-4 py-2 rounded transition">Hire Top Talent</Button>
        </div>
      )}
    </nav>
  );
}
