"use client";

import React, { ReactNode, useState, useRef, useEffect } from "react";
import { SidebarContainer } from "@/components/sidebar/SidebarContainer";
import { ChevronLeft, Menu, X } from "lucide-react";

interface MainLayoutProps {
  children: ReactNode;
  sidebarProps?: {
    selectedFieldCodes: string[];
    onFieldCodesChange: (fieldCodes: string[]) => void;
    selectedJournalISSNs: string[];
    onJournalsChange: (issnList: string[]) => void;
    selectedJournalRatings: string[];
    onJournalRatingsChange: (ratings: string[]) => void;
    yearLow?: number;
    yearHigh?: number;
    onYearChange?: (yearLow?: number, yearHigh?: number) => void;
  };
}

const MIN_SIDEBAR_WIDTH = 250;
const MAX_SIDEBAR_WIDTH = 600;
const DEFAULT_SIDEBAR_WIDTH = 420;
const STORAGE_KEY = "sidebar-width";
const COLLAPSED_SIDEBAR_WIDTH = 50; // Space bar width

export function MainLayout({ children, sidebarProps }: MainLayoutProps) {
  const [sidebarWidth, setSidebarWidth] = useState(DEFAULT_SIDEBAR_WIDTH);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const dividerRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Load saved width on mount and detect mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);

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

    return () => window.removeEventListener("resize", checkMobile);
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
        className={`fixed h-screen bg-gray-50 border-r border-gray-200 overflow-visible z-40 transition-all duration-300 flex flex-col ${
          isCollapsed ? "" : "opacity-100"
        } ${isMobile ? "top-0 left-0" : "top-0 left-0"}`}
        style={{
          width: isCollapsed
            ? `${COLLAPSED_SIDEBAR_WIDTH}px`
            : `${sidebarWidth}px`,
          boxShadow:
            isMobile && !isCollapsed ? "2px 0 8px rgba(0,0,0,0.1)" : "none",
        }}
      >
        {/* Toggle Buttons - Header (only shown when expanded) */}
        {!isCollapsed && (
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
        )}

        {/* Collapsed State - Hamburger Menu at top */}
        {isCollapsed && (
          <div className="flex items-center justify-center pt-2 pb-4">
            <button
              onClick={() => setIsCollapsed(false)}
              className="p-1 hover:bg-gray-200 rounded transition-colors"
              title="Expand sidebar"
              aria-label="Expand sidebar"
            >
              <Menu className="h-5 w-5 text-gray-600" />
            </button>
          </div>
        )}

        {/* Collapsed State - Vertical Layout with Text */}
        {isCollapsed && (
          <div className="flex-1 flex flex-col items-center justify-center relative gap-6">
            {/* FILTER Text - Centered vertically and horizontally */}
            <div className="text-gray-500">
              <div
                className="text-xs font-semibold tracking-widest"
                style={{
                  writingMode: "vertical-rl",
                  textOrientation: "mixed",
                  transform: "rotate(180deg)",
                }}
              >
                FILTER
              </div>
            </div>
          </div>
        )}

        {/* Sidebar Content - Hidden when collapsed, shown with delay when expanded */}
        {!isCollapsed && (
          <div
            className="flex-1 overflow-y-auto"
            style={{ animation: "fadeIn 0.3s ease-in-out 0.2s both" }}
          >
            {sidebarProps && <SidebarContainer {...sidebarProps} />}
          </div>
        )}
      </aside>

      {/* DIVIDER - Draggable resize handle (hidden on mobile and when collapsed) */}
      <div
        ref={dividerRef}
        onMouseDown={handleDividerMouseDown}
        className={`w-1 bg-gray-300 hover:bg-blue-400 cursor-col-resize transition-colors z-40 ${
          isCollapsed || isMobile ? "hidden" : ""
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
          marginLeft:
            isMobile || isCollapsed
              ? `${COLLAPSED_SIDEBAR_WIDTH}px`
              : `${sidebarWidth + 4}px`,
        }}
      >
        {/* Close Button - Show when sidebar is open on mobile */}
        {!isCollapsed && isMobile && (
          <button
            onClick={() => setIsCollapsed(true)}
            className="fixed top-4 left-4 z-30 p-2 bg-white rounded-lg border border-gray-200 hover:bg-gray-50 transition-all md:hidden"
            title="Close sidebar"
            aria-label="Close sidebar"
          >
            <X className="h-5 w-5 text-gray-600" />
          </button>
        )}

        {children}
      </main>
    </div>
  );
}
