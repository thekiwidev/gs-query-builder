"use client";

import React from "react";
import { Menu, X, ChevronRight } from "lucide-react";

interface MobileMenuItemProps {
  label: string;
  icon: React.ReactNode;
  badge?: number;
  onClick?: () => void;
}

function MobileMenuItem({ label, icon, badge, onClick }: MobileMenuItemProps) {
  return (
    <button
      onClick={onClick}
      className="w-full flex items-center justify-between px-4 py-3 hover:bg-gray-50 transition-colors border-b border-gray-200 last:border-b-0"
    >
      <div className="flex items-center gap-3">
        <div className="text-gray-600">{icon}</div>
        <span className="font-medium text-gray-900">{label}</span>
      </div>
      <div className="flex items-center gap-2">
        {badge !== undefined && (
          <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs font-semibold rounded-full">
            {badge}
          </span>
        )}
        <ChevronRight className="w-4 h-4 text-gray-400" />
      </div>
    </button>
  );
}

interface MobileSearchMenuProps {
  isOpen: boolean;
  onClose: () => void;
  blockCount?: number;
  filterCount?: number;
  onFiltersClick?: () => void;
  onPreviewClick?: () => void;
}

export function MobileSearchMenu({
  isOpen,
  onClose,
  blockCount = 0,
  filterCount = 0,
  onFiltersClick,
  onPreviewClick,
}: MobileSearchMenuProps) {
  return (
    <>
      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
          onClick={onClose}
        />
      )}

      {/* Mobile Menu Panel */}
      <div
        className={`fixed top-0 right-0 bottom-0 w-64 bg-white shadow-xl z-50 md:hidden transition-transform duration-300 ease-out ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Menu Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <h2 className="font-semibold text-gray-900">Menu</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-600" />
          </button>
        </div>

        {/* Menu Items */}
        <div className="divide-y divide-gray-200">
          <MobileMenuItem
            label="Search Blocks"
            icon={<span className="text-lg">🔍</span>}
            badge={blockCount || undefined}
            onClick={() => {
              onClose();
              window.scrollTo({ top: 0, behavior: "smooth" });
            }}
          />

          <MobileMenuItem
            label="Filters & Options"
            icon={<span className="text-lg">⚙️</span>}
            badge={filterCount || undefined}
            onClick={() => {
              onFiltersClick?.();
              onClose();
            }}
          />

          <MobileMenuItem
            label="Query Preview"
            icon={<span className="text-lg">👁️</span>}
            onClick={() => {
              onPreviewClick?.();
              onClose();
            }}
          />
        </div>

        {/* Footer Info */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-200 bg-gray-50">
          <p className="text-xs text-gray-600">
            💡 Tap on any section to jump to it, or scroll to navigate
          </p>
        </div>
      </div>
    </>
  );
}

interface MobileMenuToggleProps {
  isOpen: boolean;
  onToggle: () => void;
  hasUpdates?: boolean;
}

export function MobileMenuToggle({
  isOpen,
  onToggle,
  hasUpdates,
}: MobileMenuToggleProps) {
  return (
    <button
      onClick={onToggle}
      className="md:hidden p-2 hover:bg-gray-100 rounded-lg transition-colors relative"
      aria-label="Toggle menu"
    >
      {isOpen ? (
        <X className="w-6 h-6 text-gray-600" />
      ) : (
        <>
          <Menu className="w-6 h-6 text-gray-600" />
          {hasUpdates && (
            <span className="absolute top-1 right-1 w-2 h-2 bg-blue-600 rounded-full" />
          )}
        </>
      )}
    </button>
  );
}
