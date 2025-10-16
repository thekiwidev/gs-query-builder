"use client";

import React from "react";
import { YearRangeFiltersSidebar } from "@/components/sidebar/sections/YearRangeFiltersSidebar";
import { FieldOfResearchSidebar } from "@/components/sidebar/sections/FieldOfResearchSidebar";
import { JournalRatingsSidebar } from "@/components/sidebar/sections/JournalRatingsSidebar";
import { SelectedJournalsSidebar } from "@/components/sidebar/sections/SelectedJournalsSidebar";

interface SidebarContainerProps {
  selectedFieldCodes: string[];
  onFieldCodesChange: (fieldCodes: string[]) => void;
  selectedJournalISSNs: string[];
  onJournalsChange: (issnList: string[]) => void;
  selectedJournalRatings: string[];
  onJournalRatingsChange: (ratings: string[]) => void;
  yearLow?: number;
  yearHigh?: number;
  onYearChange?: (yearLow?: number, yearHigh?: number) => void;
}

export function SidebarContainer({
  selectedFieldCodes,
  onFieldCodesChange,
  selectedJournalISSNs,
  onJournalsChange,
  selectedJournalRatings,
  onJournalRatingsChange,
  yearLow,
  yearHigh,
  onYearChange,
}: SidebarContainerProps) {
  return (
    <div className="p-6 space-y-6 h-full pb-24">
      {/* Year Range Filters */}
      <YearRangeFiltersSidebar
        yearLow={yearLow}
        yearHigh={yearHigh}
        onYearChange={onYearChange}
      />

      {/* Field of Research */}
      <FieldOfResearchSidebar
        selectedFieldCodes={selectedFieldCodes}
        onFieldCodesChange={onFieldCodesChange}
      />

      {/* Journal Ratings */}
      <JournalRatingsSidebar
        selectedRatings={selectedJournalRatings}
        onRatingsChange={onJournalRatingsChange}
      />

      {/* Available Journals */}
      <SelectedJournalsSidebar
        selectedJournalISSNs={selectedJournalISSNs}
        onJournalsChange={onJournalsChange}
        selectedFieldCodes={selectedFieldCodes}
        selectedRatings={selectedJournalRatings}
      />
    </div>
  );
}
