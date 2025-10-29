"use client";

import React from "react";
import { Button } from "../ui/button";
import { Plus, Search, ExternalLink } from "lucide-react";

interface ActionButtonsSectionProps {
  onSearch: () => void;
  hasErrors: boolean;
}

export function ActionButtonsSection({
  onSearch,
  hasErrors,
}: ActionButtonsSectionProps) {
  return (
    <div className="flex justify-end pt-6">
      {/* Search Button - Bottom right */}
      <Button
        onClick={onSearch}
        disabled={hasErrors}
        size="lg"
        className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-medium px-8 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <Search className="h-4 w-4" />
        Search
        <ExternalLink className="h-3 w-3" />
      </Button>
    </div>
  );
}
