"use client";

import React, { useState, useRef, useEffect } from "react";
import { getAllFieldsOfStudy } from "../../../types/journal";
import { GraduationCap, ChevronDown } from "lucide-react";
import { Checkbox } from "../../ui/checkbox";

interface FieldOfResearchSidebarProps {
  selectedFieldCodes: string[];
  onFieldCodesChange: (fieldCodes: string[]) => void;
}

export function FieldOfResearchSidebar({
  selectedFieldCodes,
  onFieldCodesChange,
}: FieldOfResearchSidebarProps) {
  const fields = getAllFieldsOfStudy();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  const handleFieldToggle = (fieldCode: string, checked: boolean) => {
    if (checked) {
      onFieldCodesChange([...selectedFieldCodes, fieldCode]);
    } else {
      onFieldCodesChange(
        selectedFieldCodes.filter((code) => code !== fieldCode)
      );
    }
  };

  const handleSelectAll = () => {
    onFieldCodesChange(fields.map((f) => f.code));
  };

  const handleClearAll = () => {
    onFieldCodesChange([]);
  };

  const selectedFieldNames = fields
    .filter((f) => selectedFieldCodes.includes(f.code))
    .map((f) => f.name);

  const displayText =
    selectedFieldCodes.length === 0
      ? "Select fields..."
      : selectedFieldCodes.length === 1
      ? selectedFieldNames[0]
      : `${selectedFieldCodes.length} fields selected`;

  return (
    <div className="space-y-3">
      <h3 className="text-sm font-bold text-gray-900 flex items-center gap-2">
        <GraduationCap className="h-4 w-4" />
        Field of Research
      </h3>

      <div ref={dropdownRef} className="relative">
        {/* Dropdown trigger button */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg bg-white hover:bg-gray-50 transition-colors flex items-center justify-between text-left"
        >
          <span
            className={
              selectedFieldCodes.length === 0
                ? "text-gray-500"
                : "text-gray-900"
            }
          >
            {displayText}
          </span>
          <ChevronDown
            className={`h-4 w-4 text-gray-600 transition-transform ${
              isOpen ? "rotate-180" : ""
            }`}
          />
        </button>

        {/* Dropdown menu */}
        {isOpen && (
          <div className="absolute top-full left-0 right-0 mt-1 border border-gray-300 rounded-lg p-3 space-y-2 bg-white shadow-lg z-50">
            {fields.map((field) => (
              <div key={field.code} className="flex items-center space-x-2">
                <Checkbox
                  id={`field-${field.code}`}
                  checked={selectedFieldCodes.includes(field.code)}
                  onCheckedChange={(checked) =>
                    handleFieldToggle(field.code, checked as boolean)
                  }
                />
                <label
                  htmlFor={`field-${field.code}`}
                  className="text-xs cursor-pointer text-gray-700 flex-1"
                >
                  {field.name}
                </label>
              </div>
            ))}

            {/* Action buttons */}
            <div className="border-t border-gray-200 pt-2 mt-2 flex gap-1">
              <button
                onClick={handleSelectAll}
                className="flex-1 px-2 py-1 text-xs border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Select All
              </button>
              <button
                onClick={handleClearAll}
                className="flex-1 px-2 py-1 text-xs border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Clear All
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
