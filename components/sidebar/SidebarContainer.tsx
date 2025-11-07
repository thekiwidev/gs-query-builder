"use client";

import React from "react";
import { YearRangeFiltersSidebar } from "@/components/sidebar/sections/YearRangeFiltersSidebar";
import { FieldOfResearchSidebar } from "@/components/sidebar/sections/FieldOfResearchSidebar";
import { JournalRatingsSidebar } from "@/components/sidebar/sections/JournalRatingsSidebar";
import { SelectedJournalsSidebar } from "@/components/sidebar/sections/SelectedJournalsSidebar";
import { DepartmentSidebar } from "./sections/DepartmentSidebar";
import { Department, FieldOfStudy, JournalRecord } from "@/types/journal";

interface SidebarContainerProps {
  selectedDepartments: Department[];
  onDepartmentsChange: (departments: Department[]) => void;
  availableFields: FieldOfStudy[];
  selectedFields: string[];
  onFieldsChange: (fields: string[]) => void;
  availableJournals: JournalRecord[];
  selectedJournals: JournalRecord[];
  onJournalsChange: (journals: JournalRecord[]) => void;
  selectedJournalRatings: string[];
  onJournalRatingsChange: (ratings: string[]) => void;
  yearLow?: number;
  yearHigh?: number;
  onYearChange?: (yearLow?: number, yearHigh?: number) => void;
}

export function SidebarContainer({
  selectedDepartments,
  onDepartmentsChange,
  availableFields,
  selectedFields,
  onFieldsChange,
  availableJournals,
  selectedJournals,
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

      {/* Department Selector */}
      <DepartmentSidebar
        selectedDepartments={selectedDepartments}
        onDepartmentsChange={onDepartmentsChange}
      />

      {/* Field of Research */}
      <FieldOfResearchSidebar
        availableFields={availableFields}
        selectedFields={selectedFields}
        onFieldsChange={onFieldsChange}
      />

      {/* Journal Ratings */}
      <JournalRatingsSidebar
        selectedRatings={selectedJournalRatings}
        onRatingsChange={onJournalRatingsChange}
      />

      {/* Available Journals */}
      <SelectedJournalsSidebar
        availableJournals={availableJournals}
        selectedJournals={selectedJournals}
        onJournalsChange={onJournalsChange}
        selectedRatings={selectedJournalRatings}
      />
    </div>
  );
}
