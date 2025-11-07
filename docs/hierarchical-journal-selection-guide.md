# Hierarchical Journal Selection Implementation Guide

## 1. Introduction

This guide outlines the implementation of a hierarchical journal selection system. The goal is to replace the current single-level journal selection with a multi-level system based on `Department > Field of Research > Journal`.

This will be implemented in two phases:
- **Phase 1 (Temporary):** A mixed-depth hierarchy. The "Business, Economics, and Management" department will have a sub-category ("Field of Research"), while other departments will directly link to journals.
- **Phase 2 (Future):** All departments will have a "Field of Research" sub-category.

## 2. Data Structure and Types

The foundation of this feature is a clear data structure.

### 2.1. Departments (Categories)

First, we need to define the top-level categories, which we'll call `Departments`.

**File to Update:** `types/journal.ts`

Add a new `Department` type and a constant for the available departments.

```typescript
// In types/journal.ts

export interface Department {
  id: string; // e.g., 'business-economics-and-management'
  name: string; // e.g., 'Business, Economics, and Management'
  hasSubcategories: boolean;
  dataFile: string; // Path to the CSV file
}

export const DEPARTMENTS: Department[] = [
  { id: 'business-economics-and-management', name: 'Business, Economics, and Management', hasSubcategories: true, dataFile: '/data/business-economics-and-management.csv' },
  { id: 'chemical-and-material-sciences', name: 'Chemical and Material Sciences', hasSubcategories: false, dataFile: '/data/chemical-and-material-sciences.csv' },
  { id: 'engineering-and-computer-science', name: 'Engineering and Computer Science', hasSubcategories: false, dataFile: '/data/engineering-and-computer-science.csv' },
  { id: 'health-and-medical-sciences', name: 'Health and Medical Sciences', hasSubcategories: false, dataFile: '/data/health-and-medical-sciences.csv' },
  { id: 'humanities-literature-and-art', name: 'Humanities, Literature, and Art', hasSubcategories: false, dataFile: '/data/humanities-literature-and-art.csv' },
  { id: 'life-sciences-and-earth-sciences', name: 'Life Sciences and Earth Sciences', hasSubcategories: false, dataFile: '/data/life-sciences-and-earth-sciences.csv' },
  { id: 'physics-and-mathematics', name: 'Physics and Mathematics', hasSubcategories: false, dataFile: '/data/physics-and-mathematics.csv' },
  { id: 'social-sciences', name: 'Social Sciences', hasSubcategories: false, dataFile: '/data/social-sciences.csv' },
];
```

### 2.2. Journal Record

The `JournalRecord` in `types/journal.ts` is mostly fine, but we should add the `departmentId` to it to easily trace journals back to their department.

```typescript
// In types/journal.ts
export interface JournalRecord {
  // ... existing fields
  departmentId: string;
}
```

## 3. State Management (`QueryBuilder.tsx`)

The main state will be managed in the `QueryBuilder` component.

**File to Update:** `components/QueryBuilder.tsx`

```typescript
// In components/QueryBuilder.tsx

// ... imports

import { DEPARTMENTS, Department } from '@/types/journal'; // Import new types

export function QueryBuilder() {
  // ... existing state

  const [selectedDepartments, setSelectedDepartments] = useState<Department[]>([]);
  const [selectedFields, setSelectedFields] = useState<string[]>([]);
  const [availableJournals, setAvailableJournals] = useState<JournalRecord[]>([]);
  const [availableFields, setAvailableFields] = useState<FieldOfStudy[]>([]);

  // ... useEffect to load journals based on selectedDepartments
  useEffect(() => {
    const loadJournals = async () => {
      if (selectedDepartments.length === 0) {
        setAvailableJournals([]);
        setAvailableFields([]);
        return;
      }

      // This function will be created in lib/journalLoader.ts
      const { journals, fields } = await loadJournalsForDepartments(selectedDepartments);

      setAvailableJournals(journals);
      setAvailableFields(fields);
    };

    loadJournals();
  }, [selectedDepartments]);

  // ... rest of the component
}
```

## 4. Component Implementation

### 4.1. Department Selector (New Component)

Create a new component for selecting departments. This will be a multi-select dropdown.

**New File:** `components/filters/DepartmentSelector.tsx`

```typescript
// In components/filters/DepartmentSelector.tsx

"use client";

import React from "react";
import { DEPARTMENTS, Department } from "@/types/journal";
// Use a multi-select dropdown library or build one

interface DepartmentSelectorProps {
  selectedDepartments: Department[];
  onDepartmentsChange: (departments: Department[]) => void;
}

export function DepartmentSelector({ selectedDepartments, onDepartmentsChange }: DepartmentSelectorProps) {
  // Implementation of a multi-select dropdown
  // ...
}
```

This new component should be added to `QueryBuilder.tsx`.

### 4.2. Field of Research Filter (Update)

This component needs to be updated to be dynamic.

**File to Update:** `components/filters/FieldOfResearchFilter.tsx`

- Remove the hardcoded `FIELDS_OF_RESEARCH`.
- Receive `availableFields` as a prop.
- Only render if `availableFields` is not empty.

```typescript
// In components/filters/FieldOfResearchFilter.tsx

// ...

interface FieldOfResearchFilterProps {
  selectedFields: string[];
  onFieldsChange: (fields: string[]) => void;
  availableFields: FieldOfStudy[]; // New prop
}

export function FieldOfResearchFilter({
  selectedFields,
  onFieldsChange,
  availableFields,
}: FieldOfResearchFilterProps) {
  // ...

  if (availableFields.length === 0) {
    return null; // Don't render if no fields are available
  }

  // ... rest of the component logic, using availableFields instead of the hardcoded array
}
```

### 4.3. Journal Loader (Update)

This is the most critical part of the implementation. We need to update `lib/journalLoader.ts` to handle loading from multiple CSV files.

**File to Update:** `lib/journalLoader.ts`

1.  **Modify `parseJournalCSV`**: Update it to accept the `departmentId` and add it to the `JournalRecord`.

    ```typescript
    // In lib/journalLoader.ts
    export function parseJournalCSV(csvText: string, departmentId: string): JournalValidationResult {
      // ... inside the loop for valid journals
      const journal: JournalRecord = {
        // ...
        departmentId: departmentId,
      };
      // ...
    }
    ```

2.  **Create `loadJournalsForDepartments`**: This new function will load and merge journals from multiple department CSVs.

    ```typescript
    // In lib/journalLoader.ts
    import { Department } from '@/types/journal';

    export async function loadJournalsForDepartments(departments: Department[]): Promise<{ journals: JournalRecord[], fields: FieldOfStudy[] }> {
      const allJournals: JournalRecord[] = [];
      const allFields = new Map<string, FieldOfStudy>();

      for (const department of departments) {
        try {
          const response = await fetch(department.dataFile);
          if (!response.ok) {
            console.error(`Failed to load ${department.dataFile}`);
            continue;
          }
          const csvText = await response.text();
          const result = parseJournalCSV(csvText, department.id);

          allJournals.push(...result.validJournals);

          if (department.hasSubcategories) {
            result.validJournals.forEach(journal => {
              const field = getFieldOfStudyByCode(journal.fieldCode);
              if (field && !allFields.has(field.code)) {
                allFields.set(field.code, field);
              }
            });
          }
        } catch (error) {
          console.error(`Error processing ${department.dataFile}:`, error);
        }
      }

      return {
        journals: allJournals,
        fields: Array.from(allFields.values()),
      };
    }
    ```

## 5. Step-by-Step Implementation Plan

1.  **Update `types/journal.ts`**: Add the `Department` interface and `DEPARTMENTS` constant. Add `departmentId` to `JournalRecord`.
2.  **Create `components/filters/DepartmentSelector.tsx`**: Build the new multi-select dropdown for departments.
3.  **Update `lib/journalLoader.ts`**:
    *   Modify `parseJournalCSV` to accept and assign `departmentId`.
    *   Implement `loadJournalsForDepartments`.
4.  **Update `components/QueryBuilder.tsx`**:
    *   Add the new state variables for `selectedDepartments`, `availableJournals`, and `availableFields`.
    *   Add the `useEffect` hook to call `loadJournalsForDepartments`.
    *   Integrate the new `DepartmentSelector` component.
5.  **Update `components/filters/FieldOfResearchFilter.tsx`**:
    *   Remove hardcoded fields.
    *   Accept `availableFields` as a prop.
    *   Conditionally render based on `availableFields`.
6.  **Update `components/filters/MultiJournalSelector.tsx`**:
    *   The `availableJournals` prop will now be correctly populated based on department selections.
    *   You may need to add filtering logic if a "Field of Research" is selected.

## 6. Future Enhancements (Phase 2)

When all departments have sub-categories and the data is complete, the following changes will be needed:

1.  **Update `DEPARTMENTS` constant**: In `types/journal.ts`, set `hasSubcategories: true` for all departments.
2.  **Simplify `loadJournalsForDepartments`**: The logic to conditionally check `hasSubcategories` can be simplified, as it will always be true.
3.  **Remove Conditional Rendering**: The conditional rendering in `FieldOfResearchFilter.tsx` can be removed, as it will always be shown when a department is selected.
4.  **Data Update**: Replace the temporary CSV files with the final, complete versions.

This guide provides a comprehensive plan for implementing the hierarchical journal selection feature. By following these steps, you can build a robust and scalable system that can be easily updated in the future.
