"use client";

import React, { ReactNode, useState, useRef, useEffect } from "react";
import { SidebarContainer } from "@/components/sidebar/SidebarContainer";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface MainLayoutProps {
  children: ReactNode;
  sidebarProps?: {
    selectedFieldCodes: string[];
    onFieldCodesChange: (fieldCodes: string[]) => void;
    selectedJournalISSNs: string[];
    onJournalsChange: (issnList: string[]) => void;
    yearLow?: number;
    yearHigh?: number;
    onYearChange?: (yearLow?: number, yearHigh?: number) => void;
  };
}

const MIN_SIDEBAR_WIDTH = 250;
const MAX_SIDEBAR_WIDTH = 600;
const DEFAULT_SIDEBAR_WIDTH = 420;
const STORAGE_KEY = "sidebar-width";

export function MainLayout({ children, sidebarProps }: MainLayoutProps) {
  const [sidebarWidth, setSidebarWidth] = useState(DEFAULT_SIDEBAR_WIDTH);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const dividerRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Load saved width on mount
  useEffect(() => {
    try {
      const savedWidth = localStorage.getItem(STORAGE_KEY);
      if (savedWidth) {
        const width = parseInt(savedWidth, 10);
        if (width >= MIN_SIDEBAR_WIDTH && width <= MAX_SIDEBAR_WIDTH) {
          setSidebarWidth(width);
        }
      }
    } catch (err) {
      console.error("Failed to load sidebar width:", err);
    }
  }, []);

  // Handle mouse move for dragging
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging || !containerRef.current) return;

      const containerRect = containerRef.current.getBoundingClientRect();
      const newWidth = e.clientX - containerRect.left;

      if (newWidth >= MIN_SIDEBAR_WIDTH && newWidth <= MAX_SIDEBAR_WIDTH) {
        setSidebarWidth(newWidth);
      }
    };

    const handleMouseUp = () => {
      setIsDragging(false);
    };

    if (isDragging) {
      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
    }

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isDragging]);

  // Save width to localStorage whenever it changes
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, sidebarWidth.toString());
    } catch (err) {
      console.error("Failed to save sidebar width:", err);
    }
  }, [sidebarWidth]);

  const handleDividerMouseDown = () => {
    setIsDragging(true);
  };

  return (
    <div
      ref={containerRef}
      className="flex h-screen bg-white"
      style={{ userSelect: isDragging ? "none" : "auto" }}
    >
      {/* LEFT SIDEBAR - Resizable & Collapsible */}
      <aside
        className={`fixed h-screen bg-gray-50 border-r border-gray-200 overflow-y-auto z-40 transition-all duration-300 flex flex-col ${
          isCollapsed ? "w-0 opacity-0" : "opacity-100"
        }`}
        style={{
          width: isCollapsed ? 0 : `${sidebarWidth}px`,
        }}
      >
        {/* Toggle Buttons */}
        <div className="sticky top-0 bg-gray-50 border-b border-gray-200 p-2 z-50 flex items-center justify-between">
          <button
            onClick={() => setIsCollapsed(true)}
            className="p-1 hover:bg-gray-200 rounded transition-colors"
            title="Collapse sidebar"
            aria-label="Collapse sidebar"
          >
            <ChevronLeft className="h-5 w-5 text-gray-600" />
          </button>
          <span className="text-xs font-semibold text-gray-600">FILTERS</span>
          <div className="w-6" />
        </div>

        {/* Sidebar Content */}
        <div className="flex-1 overflow-y-auto">
          {sidebarProps && <SidebarContainer {...sidebarProps} />}
        </div>
      </aside>

      {/* DIVIDER - Draggable resize handle */}
      <div
        ref={dividerRef}
        onMouseDown={handleDividerMouseDown}
        className={`w-1 bg-gray-300 hover:bg-blue-400 cursor-col-resize transition-colors z-40 ${
          isCollapsed ? "hidden" : ""
        }`}
        style={{
          marginLeft: isCollapsed ? 0 : `${sidebarWidth}px`,
          position: "fixed",
          height: "100vh",
          top: 0,
        }}
      />

      {/* MAIN CONTENT */}
      <main
        className="flex-1 overflow-y-auto transition-all duration-300"
        style={{
          marginLeft: isCollapsed ? 0 : `${sidebarWidth + 4}px`,
        }}
      >
        {/* Expand Button - Show when collapsed */}
        {isCollapsed && (
          <button
            onClick={() => setIsCollapsed(false)}
            className="fixed left-0 top-4 z-40 p-2 bg-white rounded-r-lg border border-l-0 border-gray-200 hover:bg-gray-50 transition-all"
            title="Expand sidebar"
            aria-label="Expand sidebar"
          >
            <ChevronRight className="h-5 w-5 text-gray-600" />
          </button>
        )}

        {children}
      </main>
    </div>
  );
}
