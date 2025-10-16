"use client";

import React, { useState, useEffect } from "react";
import { Search, X } from "lucide-react";
import type { JournalRecord } from "@/types/journal";

interface MultiJournalSelectorProps {
  selectedJournals: JournalRecord[];
  onJournalsChange: (journals: JournalRecord[]) => void;
  availableJournals: JournalRecord[];
}

export function MultiJournalSelector({
  selectedJournals,
  onJournalsChange,
  availableJournals,
}: MultiJournalSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredJournals, setFilteredJournals] =
    useState<JournalRecord[]>(availableJournals);

  useEffect(() => {
    const filtered = availableJournals.filter((journal) =>
      journal.title.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredJournals(filtered);
  }, [searchTerm, availableJournals]);

  const handleJournalToggle = (journal: JournalRecord) => {
    if (selectedJournals.find((j) => j.issn === journal.issn)) {
      onJournalsChange(selectedJournals.filter((j) => j.issn !== journal.issn));
    } else {
      onJournalsChange([...selectedJournals, journal]);
    }
  };

  const handleRemoveJournal = (issn: string) => {
    onJournalsChange(selectedJournals.filter((j) => j.issn !== issn));
  };

  return (
    <div className="space-y-3">
      <div className="relative">
        <div
          className="flex items-center gap-2 p-3 border border-gray-200 rounded-lg hover:border-gray-300 transition-colors cursor-pointer"
          onClick={() => setIsOpen(!isOpen)}
        >
          <Search className="w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search journals..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onClick={(e) => {
              e.stopPropagation();
              setIsOpen(true);
            }}
            className="flex-1 outline-none bg-transparent text-sm"
          />
          <span className="text-xs text-gray-500">
            {selectedJournals.length} selected
          </span>
        </div>

        {isOpen && (
          <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
            <div className="max-h-64 overflow-y-auto">
              {filteredJournals.length > 0 ? (
                filteredJournals.map((journal) => (
                  <label
                    key={journal.issn}
                    className="flex items-center space-x-3 p-3 hover:bg-gray-50 border-b border-gray-100 last:border-b-0 cursor-pointer transition-colors"
                  >
                    <input
                      type="checkbox"
                      checked={
                        selectedJournals.findIndex(
                          (j) => j.issn === journal.issn
                        ) > -1
                      }
                      onChange={() => handleJournalToggle(journal)}
                      className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {journal.title}
                      </p>
                      <p className="text-xs text-gray-500">{journal.issn}</p>
                    </div>
                  </label>
                ))
              ) : (
                <div className="p-4 text-center text-sm text-gray-500">
                  No journals found
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {selectedJournals.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {selectedJournals.map((journal) => (
            <div
              key={journal.issn}
              className="flex items-center gap-2 px-3 py-1 bg-blue-50 border border-blue-200 rounded-full text-sm text-blue-700"
            >
              <span>{journal.title}</span>
              <button
                onClick={() => handleRemoveJournal(journal.issn)}
                className="hover:bg-blue-100 rounded-full p-0.5 transition-colors"
              >
                <X className="w-3 h-3" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
