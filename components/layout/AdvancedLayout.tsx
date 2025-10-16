"use client";

import React, { useState, ReactNode } from "react";
import { Menu, X } from "lucide-react";

interface AdvancedLayoutProps {
  sidebar: ReactNode;
  children: ReactNode;
}

export function AdvancedLayout({ sidebar, children }: AdvancedLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="flex h-screen bg-white">
      {/* Mobile Hamburger */}
      <div className="md:hidden fixed top-4 left-4 z-50">
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          aria-label="Toggle menu"
        >
          {mobileMenuOpen ? (
            <X className="w-6 h-6 text-gray-700" />
          ) : (
            <Menu className="w-6 h-6 text-gray-700" />
          )}
        </button>
      </div>

      {/* Sidebar - Desktop */}
      <aside
        className={`
          hidden md:flex md:flex-col
          w-72 bg-gray-50 border-r border-gray-200
          overflow-y-auto transition-all duration-300
          ${sidebarOpen ? "opacity-100" : "opacity-0 pointer-events-none"}
        `}
      >
        <div className="p-6">
          <h2 className="text-sm font-semibold text-gray-900 mb-6">Filters</h2>
          {sidebar}
        </div>
      </aside>

      {/* Sidebar - Mobile (Drawer) */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 z-40 bg-black bg-opacity-50 md:hidden"
          onClick={() => setMobileMenuOpen(false)}
        >
          <aside className="absolute left-0 top-0 bottom-0 w-72 bg-gray-50 border-r border-gray-200 overflow-y-auto">
            <div className="p-6 pt-16">
              <h2 className="text-sm font-semibold text-gray-900 mb-6">
                Filters
              </h2>
              {sidebar}
            </div>
          </aside>
        </div>
      )}

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto">
        <div className="p-6 md:p-8 max-w-6xl mx-auto">{children}</div>
      </main>

      {/* Desktop Sidebar Toggle */}
      <button
        onClick={() => setSidebarOpen(!sidebarOpen)}
        className="hidden lg:flex items-center justify-center w-10 bg-gray-100 hover:bg-gray-200 border-l border-gray-200 transition-colors"
        aria-label="Toggle sidebar"
        title={sidebarOpen ? "Close sidebar" : "Open sidebar"}
      >
        <div className="w-0.5 h-6 bg-gray-400" />
      </button>
    </div>
  );
}
