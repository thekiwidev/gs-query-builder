"use client";

import Link from "next/link";
import { GraduationCap } from "lucide-react";
import { Button } from "../ui/button";

export function Header() {
  return (
    <header className="bg-white/80 backdrop-blur-md border-b border-gray-100">
      <nav className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-linear-to-br from-blue-500 to-blue-700 flex items-center justify-center">
            <GraduationCap className="w-5 h-5 text-white" />
          </div>
          <span className="text-gray-900 font-semibold">ScholarGO</span>
        </Link>

        <div className="hidden md:flex items-center gap-8">
          <Link
            href="/"
            className="text-gray-600 hover:text-gray-900 transition-colors"
          >
            Home
          </Link>
          <Link
            href="/about"
            className="text-gray-600 hover:text-gray-900 transition-colors"
          >
            About
          </Link>
          <Link
            href="/how-to-use"
            className="text-gray-600 hover:text-gray-900 transition-colors"
          >
            Help
          </Link>
          <Link
            href="/feedback"
            className="text-gray-600 hover:text-gray-900 transition-colors"
          >
            Feedback
          </Link>
        </div>

        <Button>Get Started</Button>
      </nav>
    </header>
  );
}
