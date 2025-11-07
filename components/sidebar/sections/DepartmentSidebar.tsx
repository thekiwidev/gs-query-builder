"use client";

import React from "react";
import { Department } from "@/types/journal";
import { DepartmentSelector } from "@/components/filters/DepartmentSelector";

interface DepartmentSidebarProps {
  selectedDepartments: Department[];
  onDepartmentsChange: (departments: Department[]) => void;
}

export function DepartmentSidebar({ selectedDepartments, onDepartmentsChange }: DepartmentSidebarProps) {
  return (
    <div>
      <DepartmentSelector
        selectedDepartments={selectedDepartments}
        onDepartmentsChange={onDepartmentsChange}
      />
    </div>
  );
}
