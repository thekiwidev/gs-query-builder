"use client";

import Link from "next/link";
import { Library } from "lucide-react";
import { Button } from "../ui/button";
import { useRouter } from "next/navigation";

export function Header() {
  const navigate = useRouter();
  return (
    <header className="bg-white/80 backdrop-blur-md border-b border-gray-100">
      <nav className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-0.5">
          <Library className="w-7 h-7 text-[#4D90FD]" />
          <span className="text-gray-900 font-semibold">Scholarle</span>
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

        <Button
          onClick={() => {
            navigate.push("/");
          }}
        >
          Get Started
        </Button>
      </nav>
    </header>
  );
}
