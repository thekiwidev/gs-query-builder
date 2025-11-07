"use client";

import React, { useState } from "react";
import { ChevronDown } from "lucide-react";
import { DEPARTMENTS, Department } from "@/types/journal";

interface DepartmentSelectorProps {
  selectedDepartments: Department[];
  onDepartmentsChange: (departments: Department[]) => void;
}

export function DepartmentSelector({
  selectedDepartments,
  onDepartmentsChange,
}: DepartmentSelectorProps) {
  const [expanded, setExpanded] = useState(true);

  const handleDepartmentToggle = (department: Department) => {
    if (selectedDepartments.find((d) => d.id === department.id)) {
      onDepartmentsChange(
        selectedDepartments.filter((d) => d.id !== department.id)
      );
    } else {
      onDepartmentsChange([...selectedDepartments, department]);
    }
  };

  const handleSelectAll = () => {
    if (selectedDepartments.length === DEPARTMENTS.length) {
      onDepartmentsChange([]);
    } else {
      onDepartmentsChange(DEPARTMENTS);
    }
  };

  return (
    <div className="space-y-3">
      <button
        onClick={() => setExpanded(!expanded)}
        className="flex items-center justify-between w-full p-3 hover:bg-white rounded-lg transition-colors"
      >
        <h3 className="font-semibold text-sm text-gray-900">Department</h3>
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
            {selectedDepartments.length === DEPARTMENTS.length
              ? "Clear All"
              : "Select All"}
          </button>

          <div className="space-y-2 max-h-96 overflow-y-auto">
            {DEPARTMENTS.map((department) => (
              <label
                key={department.id}
                className="flex items-center space-x-3 p-2 hover:bg-white rounded cursor-pointer transition-colors"
              >
                <input
                  type="checkbox"
                  checked={
                    selectedDepartments.findIndex(
                      (d) => d.id === department.id
                    ) > -1
                  }
                  onChange={() => handleDepartmentToggle(department)}
                  className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                />
                <span className="text-sm text-gray-700 flex-1">
                  {department.name}
                </span>
              </label>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}