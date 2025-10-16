"use client";

import React, { useState } from "react";
import { ChevronDown } from "lucide-react";

const FIELDS_OF_RESEARCH = [
  { id: "commerce", label: "Commerce", count: 87 },
  { id: "management", label: "Management", count: 92 },
  { id: "economics", label: "Economics", count: 156 },
  { id: "accounting", label: "Accounting", count: 64 },
  { id: "finance", label: "Finance", count: 78 },
  { id: "marketing", label: "Marketing", count: 45 },
  { id: "operations", label: "Operations Research", count: 53 },
  { id: "information-systems", label: "Information Systems", count: 71 },
];

interface FieldOfResearchFilterProps {
  selectedFields: string[];
  onFieldsChange: (fields: string[]) => void;
}

export function FieldOfResearchFilter({
  selectedFields,
  onFieldsChange,
}: FieldOfResearchFilterProps) {
  const [expanded, setExpanded] = useState(true);

  const handleFieldToggle = (fieldId: string) => {
    if (selectedFields.includes(fieldId)) {
      onFieldsChange(selectedFields.filter((f) => f !== fieldId));
    } else {
      onFieldsChange([...selectedFields, fieldId]);
    }
  };

  const handleSelectAll = () => {
    if (selectedFields.length === FIELDS_OF_RESEARCH.length) {
      onFieldsChange([]);
    } else {
      onFieldsChange(FIELDS_OF_RESEARCH.map((f) => f.id));
    }
  };

  return (
    <div className="space-y-3">
      <button
        onClick={() => setExpanded(!expanded)}
        className="flex items-center justify-between w-full p-3 hover:bg-white rounded-lg transition-colors"
      >
        <h3 className="font-semibold text-sm text-gray-900">
          Field of Research
        </h3>
        <ChevronDown
          className={`w-4 h-4 text-gray-500 transition-transform ${
            expanded ? "rotate-180" : ""
          }`}
        />
      </button>

      {expanded && (
        <div className="space-y-2 px-3 pb-3">
          <button
            onClick={handleSelectAll}
            className="w-full text-left text-xs font-medium text-blue-600 hover:text-blue-700 py-2 px-2 hover:bg-blue-50 rounded transition-colors"
          >
            {selectedFields.length === FIELDS_OF_RESEARCH.length
              ? "Clear All"
              : "Select All"}
          </button>

          <div className="space-y-2 max-h-96 overflow-y-auto">
            {FIELDS_OF_RESEARCH.map((field) => (
              <label
                key={field.id}
                className="flex items-center space-x-3 p-2 hover:bg-white rounded cursor-pointer transition-colors"
              >
                <input
                  type="checkbox"
                  checked={selectedFields.includes(field.id)}
                  onChange={() => handleFieldToggle(field.id)}
                  className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                />
                <span className="text-sm text-gray-700 flex-1">
                  {field.label}
                </span>
                <span className="text-xs text-gray-500">({field.count})</span>
              </label>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
