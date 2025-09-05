import Link from "next/link";
import { Send, Linkedin, BookOpen } from "lucide-react";

export default function Footer() {
  return (
    <footer className="w-full bg-slate-900 text-white border-t border-gray-200 py-8">
      <div className="mx-auto max-w-7xl px-4 flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
        <p className="text-white">
          &copy; {new Date().getFullYear()} {process.env.NEXT_PUBLIC_NAME}. All rights reserved.
        </p>
        <div className="flex space-x-6">
          <Link href={process.env.NEXT_PUBLIC_TELEGRAM as any} target="_blank" rel="noopener noreferrer" className="flex items-center space-x-2 text-white hover:text-blue-400 font-medium">
            <Send size={18} />
            {/* <span>Telegram</span> */}
          </Link>
          <Link href={process.env.NEXT_PUBLIC_LINKEDIN as any} target="_blank" rel="noopener noreferrer" className="flex items-center space-x-2 text-white hover:text-blue-400 font-medium">
            <Linkedin size={18} />
            {/* <span>LinkedIn</span> */}
          </Link>
          <Link href={process.env.NEXT_PUBLIC_MEDIUM as any} target="_blank" rel="noopener noreferrer" className="flex items-center space-x-2 text-white hover:text-blue-400 font-medium">
            <BookOpen size={18} />
            {/* <span>Medium</span> */}
          </Link>
        </div>
      </div>
    </footer>
  );
}
