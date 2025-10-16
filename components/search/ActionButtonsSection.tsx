"use client";

import React from "react";
import { Button } from "../ui/button";
import { Plus, Search, ExternalLink } from "lucide-react";

interface ActionButtonsSectionProps {
  onAddBlock: () => void;
  onSearch: () => void;
  hasErrors: boolean;
}

export function ActionButtonsSection({
  onAddBlock,
  onSearch,
  hasErrors,
}: ActionButtonsSectionProps) {
  return (
    <div className="flex gap-4 justify-start pt-4">
      <Button
        onClick={onAddBlock}
        variant="outline"
        className="flex items-center gap-2"
      >
        <Plus className="h-4 w-4" />
        Add Another
      </Button>

      <Button
        onClick={onSearch}
        disabled={hasErrors}
        className="flex items-center gap-2 bg-black text-white"
      >
        <Search className="h-4 w-4" />
        Search
        <ExternalLink className="h-4 w-4" />
      </Button>
    </div>
  );
}
