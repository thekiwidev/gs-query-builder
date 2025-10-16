# Help Page Integration - Code Reference

## Complete Implementation Code

### 1. QueryBuilder.tsx - Help Button Implementation

```tsx
"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { SearchBlock, buildScholarUrl, GlobalFilters } from "../lib/qtm";
import { MainLayout } from "./layouts/MainLayout";
import { MainContentArea } from "./layouts/MainContentArea";
import { SearchBlocksContainer } from "./search/SearchBlocksContainer";
import { ActionButtonsSection } from "./search/ActionButtonsSection";
import { Button } from "./ui/button";
import { CheckCircle } from "lucide-react";

export function QueryBuilder() {
  // ... other state variables ...

  const router = useRouter();

  // ... component logic ...

  return (
    <MainLayout {...sidebarProps}>
      <MainContentArea>
        {/* Header with Help Button */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Google Scholar Query Builder
              </h1>
              <p className="text-gray-600">
                Create advanced searches using Scopus-style field restrictions
              </p>
            </div>
            <Button
              onClick={() => router.push("/how-to-use")}
              variant="outline"
              className="gap-2"
              title="Open help and documentation"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              Help
            </Button>
          </div>
        </div>

        {/* Rest of component */}
        {/* ... */}
      </MainContentArea>
    </MainLayout>
  );
}
```

### 2. HowToUsePage.tsx - Component Structure

```tsx
"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { X, ChevronDown, ChevronUp } from "lucide-react";

interface CollapsibleSectionProps {
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
}

function CollapsibleSection({
  title,
  children,
  defaultOpen = false,
}: CollapsibleSectionProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className="border-b border-gray-200">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between py-4 px-6 hover:bg-gray-50 transition-colors"
      >
        <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
        {isOpen ? (
          <ChevronUp className="w-5 h-5 text-gray-600" />
        ) : (
          <ChevronDown className="w-5 h-5 text-gray-600" />
        )}
      </button>
      {isOpen && (
        <div className="px-6 pb-4 text-gray-700 space-y-3">{children}</div>
      )}
    </div>
  );
}

interface HowToUsePageProps {
  showCloseButton?: boolean;
}

export function HowToUsePage({ showCloseButton = false }: HowToUsePageProps) {
  const [activeSection, setActiveSection] = useState("getting-started");
  const router = useRouter();

  const scrollToSection = (sectionId: string) => {
    setActiveSection(sectionId);
    const element = document.getElementById(sectionId);
    element?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="bg-white min-h-screen">
      {/* Header */}
      <div className="sticky top-0 bg-white border-b border-gray-200 shadow-sm z-40">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              How to Use Query Builder
            </h1>
            <p className="text-gray-600 mt-1">
              Comprehensive guide to mastering academic research searches
            </p>
          </div>
          {showCloseButton && (
            <button
              onClick={() => router.back()}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              title="Close"
            >
              <X className="w-6 h-6 text-gray-600" />
            </button>
          )}
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Table of Contents */}
          <div className="lg:col-span-1">
            <div className="sticky top-32 bg-gray-50 rounded-lg p-4 border border-gray-200">
              <h2 className="font-bold text-gray-900 mb-4 text-sm uppercase tracking-wide">
                Contents
              </h2>
              <nav className="space-y-2">
                {[
                  { id: "getting-started", label: "Getting Started" },
                  { id: "search-blocks", label: "Search Blocks" },
                  { id: "operators", label: "Operators" },
                  { id: "exact-match", label: "Is Exact" },
                  { id: "journals", label: "Journals" },
                  { id: "filters", label: "Filters" },
                  { id: "examples", label: "Examples" },
                  { id: "tips", label: "Tips & Tricks" },
                  { id: "issues", label: "Common Issues" },
                ].map((item) => (
                  <button
                    key={item.id}
                    onClick={() => scrollToSection(item.id)}
                    className={`block w-full text-left px-3 py-2 rounded-lg transition-colors text-sm ${
                      activeSection === item.id
                        ? "bg-blue-100 text-blue-700 font-medium"
                        : "text-gray-700 hover:bg-gray-200"
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </nav>
            </div>
          </div>

          {/* Content Sections */}
          <div className="lg:col-span-3 space-y-8">
            {/* Each section with CollapsibleSection components */}
            {/* ... 9 major sections of content ... */}
          </div>
        </div>
      </div>
    </div>
  );
}
```

### 3. app/how-to-use/page.tsx - Page Component

```tsx
import { HowToUsePage } from "@/components/help/HowToUsePage";
import React from "react";

export const metadata = {
  title: "How to Use Query Builder",
  description: "Comprehensive guide to mastering academic research searches",
};

const HowToUse = () => {
  return <HowToUsePage showCloseButton={true} />;
};

export default HowToUse;
```

### 4. components/help/index.ts - Export Barrel

```ts
export { HowToUsePage } from "./HowToUsePage";
```

## Key Implementation Details

### Router Usage

```tsx
// Import
import { useRouter } from "next/navigation";

// Initialize
const router = useRouter();

// Navigate to help
router.push("/how-to-use");

// Navigate back
router.back();
```

### Button Styling

```tsx
<Button
  onClick={() => router.push("/how-to-use")}
  variant="outline" // Outline style
  className="gap-2" // Gap between icon and text
  title="Open help and documentation" // Tooltip
>
  <svg>...</svg> // Help icon Help // Button text
</Button>
```

### Collapsible Section Pattern

```tsx
<CollapsibleSection
  title="Section Title"
  defaultOpen={true} // Usually true for first section
>
  <p>Content here...</p>
  <ul>
    <li>Item 1</li>
    <li>Item 2</li>
  </ul>
</CollapsibleSection>
```

### Color-Coded Content Boxes

```tsx
// Green box (DO)
<div className="bg-green-50 p-3 rounded border-l-4 border-green-500">
  <p className="font-semibold text-green-900">✅ DO:</p>
  <ul className="text-sm text-green-800">
    <li>Best practice 1</li>
    <li>Best practice 2</li>
  </ul>
</div>

// Red box (DON'T)
<div className="bg-red-50 p-3 rounded border-l-4 border-red-500">
  <p className="font-semibold text-red-900">❌ DON'T:</p>
  <ul className="text-sm text-red-800">
    <li>Anti-pattern 1</li>
    <li>Anti-pattern 2</li>
  </ul>
</div>
```

## Component Props

### HowToUsePage Props

```typescript
interface HowToUsePageProps {
  showCloseButton?: boolean; // Show back button (default: false)
}

// Usage in app/how-to-use/page.tsx
<HowToUsePage showCloseButton={true} />;
```

## Tailwind Classes Used

```
Layout
├── Grid: grid, grid-cols-1, lg:grid-cols-4
├── Sticky: sticky, top-0, top-32
└── Spacing: px-6, py-4, mb-8, gap-8

Typography
├── Size: text-3xl, text-lg, text-sm
├── Weight: font-bold, font-semibold
└── Color: text-gray-900, text-gray-600

States
├── Hover: hover:bg-gray-50, hover:bg-gray-100
├── Background: bg-white, bg-gray-50, bg-blue-50
└── Border: border, border-gray-200, border-l-4

Interactive
├── Transitions: transition-colors
└── Cursor: (default)

Responsive
├── Grid: grid-cols-1 lg:grid-cols-4
└── Display: flex (items-center, justify-between)
```

## CSS Specifics

### Sticky TOC

```tsx
<div className="sticky top-32 bg-gray-50 rounded-lg p-4 border border-gray-200">
  {/* Content stays visible during scroll */}
```

### Header

```tsx
<div className="sticky top-0 bg-white border-b border-gray-200 shadow-sm z-40">
  {/* Stays at top with shadow effect */}
```

### Collapsible Toggle

```tsx
<button
  onClick={() => setIsOpen(!isOpen)}
  className="w-full flex items-center justify-between py-4 px-6 hover:bg-gray-50 transition-colors"
>
  {/* Full width clickable area with smooth hover */}
</button>
```

## Navigation Flow Code

```tsx
// Step 1: User clicks Help button
<Button onClick={() => router.push("/how-to-use")}>
  Help
</Button>

// Step 2: Next.js Router navigates to /how-to-use
// Step 3: app/how-to-use/page.tsx renders HowToUsePage

// Step 4: User reads content, clicks Back button
<button onClick={() => router.back()}>
  <X /> {/* Close icon */}
</button>

// Step 5: Router returns to previous page (/)
```

## State Management

```tsx
// Help page state
const [activeSection, setActiveSection] = useState("getting-started");

// TOC navigation
const scrollToSection = (sectionId: string) => {
  setActiveSection(sectionId);  // Update active section
  const element = document.getElementById(sectionId);
  element?.scrollIntoView({ behavior: "smooth" });  // Smooth scroll
};

// Collapsible sections
const [isOpen, setIsOpen] = useState(defaultOpen);
onClick={() => setIsOpen(!isOpen)}  // Toggle open/closed
```

## SEO Optimization

```tsx
export const metadata = {
  title: "How to Use Query Builder",
  description: "Comprehensive guide to mastering academic research searches",
};

// Generates:
// <title>How to Use Query Builder</title>
// <meta name="description" content="Comprehensive guide..." />
```

---

This code reference provides the complete implementation details for integrating the help page into the Query Builder application.
