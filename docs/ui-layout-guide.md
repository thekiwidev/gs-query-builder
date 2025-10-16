# UI Layout Guide - Detailed Implementation

## Overview

This document provides a comprehensive guide to achieve the exact UI layout shown in the sketch. The layout follows a two-column design with a left sidebar for filters and a main content area for search blocks.

---

## Overall Layout Structure

### Viewport Grid

```
┌─────────────────────────────────────────────────────────────────────┐
│                          APPLICATION HEADER                          │
├──────────────┬────────────────────────────────────────────────────────┤
│              │                                                        │
│   SIDEBAR    │              MAIN CONTENT AREA                        │
│   (300px)    │              (Remaining space)                        │
│              │                                                        │
│              │                                                        │
│              │                                                        │
│              │                                                        │
│              │                                                        │
└──────────────┴────────────────────────────────────────────────────────┘
```

### Key Dimensions

- **Sidebar Width:** 300px (fixed)
- **Main Content Padding:** 32px on all sides
- **Breakpoint (Mobile):** 768px (sidebar becomes hamburger menu)

---

## Sidebar Layout (Left Column)

### Sidebar Container Properties

```css
Position: fixed / sticky
Width: 300px
Height: 100vh
Background: #F5F5F5
Border-right: 1px solid #E0E0E0
Padding: 24px 16px
Overflow-y: auto
Z-index: 100
```

### Sidebar Sections (Top to Bottom)

#### 1. Year Range Filters (Top Section)

```
┌─────────────────────────────┐
│     YEAR RANGE FILTERS      │
├─────────────┬───────────────┤
│ Year Low    │ Year High     │
│ ┌─────────┐ │ ┌───────────┐ │
│ │ NNNN    │ │ │ NNNN      │ │
│ └─────────┘ │ └───────────┘ │
└─────────────┴───────────────┘
```

**Properties:**

- Label: "Year Range" (14px, bold, #333333)
- Input containers: side-by-side, 48% width each
- Input fields:
  - Type: number
  - Placeholder: "From" / "To"
  - Border: 1px solid #D0D0D0
  - Border-radius: 4px
  - Padding: 8px 12px
  - Font-size: 14px
- Spacing between inputs: 4%

---

#### 2. Field of Research Selector (Accordion)

```
┌─────────────────────────────┐
│ Field of Research ▼         │
├─────────────────────────────┤
│ ☐ Commerce (87)             │
│ ☐ Management (124)          │
│ ☐ Economics (95)            │
│ ☐ Engineering (156)         │
│ ☐ Medical (203)             │
│ ... [scrollable list]        │
├─────────────────────────────┤
│ [Select All] [Clear All]    │
└─────────────────────────────┘
```

**Properties:**

- Header: 14px, bold, #333333
- Header icon: ▼ (chevron down when collapsed, ▲ when expanded)
- List items:
  - Checkbox: 18px x 18px, left-aligned
  - Label: 14px, regular, #555555
  - Count badge: (NNN) in lighter gray (#999999), right-aligned
  - Padding: 8px 12px per item
  - Hover: background #EFEFEF
  - Height per item: 36px
- Max height: 200px, overflow-y: auto (with custom scrollbar)
- Action buttons (Select All / Clear All):
  - Size: 14px, sans-serif
  - Padding: 6px 12px
  - Border: 1px solid #D0D0D0
  - Background: white
  - Hover: background #F0F0F0
  - Spacing: 4px gap between buttons
  - Each button: 48% width

---

#### 3. Journal Ratings Filter

```
┌─────────────────────────────┐
│ Ratings Selector            │
├─────────────────────────────┤
│ ☑ A* (12 journals)          │
│ ☑ A (45 journals)           │
│ ☑ B (78 journals)           │
│ ☑ C (23 journals)           │
├─────────────────────────────┤
│ [Show All] [Show None]      │
└─────────────────────────────┘
```

**Properties:**

- Header: 14px, bold, #333333
- Checkbox items:
  - Layout: vertical stack
  - Checkbox: 18px x 18px
  - Label + count: 14px, regular
  - Padding: 8px 12px per item
  - Height per item: 36px
  - Hover: background #EFEFEF
- Action buttons:
  - Same styling as Field of Research buttons
  - Spacing: 4px gap
  - Each button: 48% width

---

#### 4. Journals List (Selected Journals)

```
┌─────────────────────────────┐
│ Selected Journals (3)       │
├─────────────────────────────┤
│ Nature Reviews              │
│ ISSN: 1234-5678  A* | ×    │
│                             │
│ Science Advances            │
│ ISSN: 8765-4321  A | ×     │
│                             │
│ Tech Science               │
│ ISSN: 2468-1357  B | ×     │
├─────────────────────────────┤
│     [Clear All Selected]     │
└─────────────────────────────┘
```

**Properties:**

- Header: 14px, bold, #333333, with count badge
- Journal items:
  - Journal name: 13px, bold, #222222
  - ISSN line: 12px, regular, #666666
  - Rating badge: 11px, bold, #FFFFFF
    - A\*: background #FF6B6B (red)
    - A: background #4ECDC4 (teal)
    - B: background #45B7D1 (blue)
    - C: background #FFA07A (orange)
  - Remove button (×): 18px x 18px, hover color red
  - Padding: 12px per item
  - Border-bottom: 1px solid #E5E5E5
  - Hover: background #FAFAFA
  - Height per item: ~50px
- Max height: 250px, overflow-y: auto
- Clear all button:
  - Full width
  - Styling: 14px, sans-serif
  - Padding: 8px 12px
  - Border: 1px solid #D0D0D0
  - Background: white
  - Hover: background #F0F0F0

---

### Sidebar Spacing

```
Top padding: 24px
Between sections: 24px
Bottom padding: 24px
```

---

## Main Content Area (Right Column)

### Main Content Container Properties

```css
Margin-left: 300px (to account for sidebar)
Padding: 32px
Background: white
Min-height: 100vh
```

### Header Section (Top of Main Content)

```
┌────────────────────────────────────────────────────────┐
│ Year Low │ Year High │ Field ──────────────────── [×]   │
│ ┌──────┐ │ ┌───────┐ │ Operators │ is exact checkbox   │
│ │ NNNN │ │ │ NNNN  │ │                                  │
│ └──────┘ │ └───────┘ │                                  │
└────────────────────────────────────────────────────────┘
```

**Properties:**

- Background: white
- Border-bottom: 1px solid #E0E0E0
- Padding: 16px 24px
- Display: flex
- Gap: 16px
- Height: auto (content-based)

**Year Low Input:**

- Width: 100px
- Input field properties:
  - Border: 1px solid #D0D0D0
  - Border-radius: 4px
  - Padding: 8px 12px
  - Font-size: 14px
  - Label: "Year Low" (12px, gray, #666666)

**Year High Input:**

- Width: 120px
- Same input properties as Year Low

**Field Selector:**

- Flex: 1 (takes remaining space)
- Dropdown properties:
  - Border: 1px solid #D0D0D0
  - Border-radius: 4px
  - Padding: 8px 12px
  - Font-size: 14px
  - Background: white
  - Min-width: 200px

---

### Search Blocks Container

#### Container Properties

```css
Border: 1px solid #D0D0D0
Border-radius: 8px
Background: white
Padding: 0
Margin-top: 32px
Overflow: hidden
```

#### Individual Search Block Layout

```
┌────────────────────────────────────────────────────────┐
│ Field ──────────── │ Term ──────────────────── │ ○ │ × │
│ Operators         │ is exact checkbox                │
├────────────────────────────────────────────────────────┤
│ Field ──────────── │ Term ──────────────────── │ ○ │ × │
│ Operators         │ is exact checkbox                │
├────────────────────────────────────────────────────────┤
│ Field ──────────── │ Term ──────────────────── │ ○ │ × │
│ Operators         │ is exact checkbox                │
│ ❌ Invalid Selection/Logic Message                    │
└────────────────────────────────────────────────────────┘
```

**Search Block Properties:**

- Height: ~90px (expanded with operators visible)
- Padding: 16px 24px
- Border-bottom: 1px solid #E5E5E5 (except last block)
- Display: flex
- Flex-direction: column
- Gap: 8px

**First Row (Main Controls):**

```
Display: flex
Gap: 16px
Align-items: center
Height: 40px
```

- **Field Dropdown:**

  - Width: 25%
  - Min-width: 150px
  - Border: 1px solid #D0D0D0
  - Border-radius: 4px
  - Padding: 8px 12px
  - Font-size: 14px
  - Background: white

- **Search Term Input:**

  - Width: 50%
  - Border: 1px solid #D0D0D0
  - Border-radius: 4px
  - Padding: 8px 12px
  - Font-size: 14px
  - Placeholder: "Enter search term..."
  - Placeholder color: #999999

- **Is Exact Checkbox:**

  - Width: 40px
  - Display: flex
  - Align-items: center
  - Justify-content: center
  - Circle icon (○): 20px diameter
  - Hover: subtle background highlight

- **Remove Button (×):**
  - Width: 40px
  - Height: 40px
  - Display: flex
  - Align-items: center
  - Justify-content: center
  - Icon: × (24px, #999999)
  - Hover: color #EF4444 (red)
  - Cursor: pointer

**Second Row (Operators):**

```
Display: flex
Gap: 12px
Align-items: center
Height: 32px
```

- **Operators Label:**

  - Font-size: 12px
  - Color: #666666
  - Width: 80px
  - Text-align: right

- **Operator Controls:**

  - Small buttons / radio buttons
  - Font-size: 12px
  - Padding: 4px 8px
  - Border: 1px solid #D0D0D0
  - Background: white
  - Hover: background #F5F5F5

- **Is Exact Checkbox Label:**
  - Font-size: 12px
  - Color: #666666
  - Margin-left: auto

#### Error State Search Block

```
┌────────────────────────────────────────────────────────┐
│ Field ──────────── │ Term ──────────────────── │ ○ │ × │
│ Operators         │ is exact checkbox                │
├────────────────────────────────────────────────────────┤
│ ❌ Invalid Selection/Logic Message                    │
└────────────────────────────────────────────────────────┘
```

**Error State Properties:**

- Border: 2px solid #EF4444 (red)
- Background: #FEF2F2 (very light red)
- Error message:
  - Font-size: 13px
  - Color: #EF4444 (red)
  - Padding: 8px 24px
  - Display: flex
  - Align-items: center
  - Gap: 8px
  - Icon: ⚠️ (16px)

---

### Action Buttons Section

```
┌────────────────────────────────────────────────────────┐
│                                                        │
│         [Add Another Button]  [Search Button]         │
│                                                        │
└────────────────────────────────────────────────────────┘
```

**Properties:**

- Margin-top: 32px
- Display: flex
- Gap: 16px
- Justify-content: center
- Align-items: center

**Add Another Button:**

- Padding: 12px 32px
- Font-size: 14px, bold
- Border: 1px solid #D0D0D0
- Background: white
- Border-radius: 4px
- Hover: background #F5F5F5
- Cursor: pointer

**Search Button:**

- Padding: 12px 48px
- Font-size: 14px, bold
- Border: none
- Background: #0066CC (primary blue)
- Color: white
- Border-radius: 4px
- Hover: background #0052A3 (darker blue)
- Active: background #003D7A (even darker)
- Cursor: pointer
- Min-width: 160px

**Disabled State (if errors exist):**

- Background: #CCCCCC
- Cursor: not-allowed
- Opacity: 0.6

---

## Advanced Options (Collapsed/Hidden by Default)

### Toggle Location

```
Top-right corner of main content area
Next to or above the search blocks container
```

### Toggled Content

```
┌────────────────────────────────────────────────────────┐
│ ▼ Advanced Options (Click to expand)                   │
├────────────────────────────────────────────────────────┤
│ Citation Filtering:                                    │
│  ○ Include all citations  ○ Exclude citations          │
│                                                        │
│ Language:                                              │
│  [ Select Language ▼ ]                                 │
│                                                        │
│ Document Type:                                         │
│  [ Select Type ▼ ]                                     │
└────────────────────────────────────────────────────────┘
```

**Properties:**

- Border: 1px solid #E0E0E0
- Border-radius: 8px
- Padding: 16px 24px
- Margin-bottom: 24px
- Background: #FAFAFA (very light gray)

---

## Query Preview Panel

### Location

```
Bottom of main content area
Below the search buttons
```

### Layout

```
┌────────────────────────────────────────────────────────┐
│ Query Preview                          [↓ Hide]        │
├────────────────────────────────────────────────────────┤
│ intitle:"machine learning" AND                         │
│ author:Hinton -"cryptocurrency"                        │
│ (1234-5678 OR 8765-4321)                               │
├────────────────────────────────────────────────────────┤
│ URL: https://scholar.google.com/scholar?q=...         │
├────────────────────────────────────────────────────────┤
│ [Copy Query]  [Copy URL]  [View Results]              │
└────────────────────────────────────────────────────────┘
```

**Properties:**

- Border: 1px solid #E0E0E0
- Border-radius: 8px
- Padding: 16px 24px
- Margin-top: 32px
- Background: white
- Font-family: monospace
- Font-size: 13px

**Query Text Properties:**

- Line-height: 1.6
- Color: #333333
- Word-break: break-all
- Syntax highlighting:
  - Field operators (intitle:, author:): #0066CC (blue)
  - Boolean operators (AND, OR): #22C55E (green)
  - Excluded terms (-): #EF4444 (red)
  - Quoted phrases: **bold**
  - ISSNs: #9333EA (purple)

**Buttons:**

- Padding: 8px 16px
- Font-size: 13px
- Border: 1px solid #D0D0D0
- Background: white
- Border-radius: 4px
- Gap: 8px
- Hover: background #F5F5F5

---

## Responsive Breakpoints

### Tablet (768px - 1024px)

- Sidebar width: 280px
- Main content padding: 24px
- Search block layout: adjust field widths

### Mobile (< 768px)

```
┌─────────────────────────────────────┐
│ [≡] Main Content                    │
├─────────────────────────────────────┤
│                                     │
│  Search blocks (stacked vertically) │
│                                     │
├─────────────────────────────────────┤
│ [Add Another]  [Search]             │
└─────────────────────────────────────┘
```

**Mobile Properties:**

- Sidebar: fixed drawer / hamburger menu
- Drawer width: 280px or full width - 40px
- Drawer z-index: 1000
- Overlay: black, opacity 0.5
- Main content: full width
- Padding: 16px
- Search blocks: full-width stack
- Buttons: stacked vertically or full-width

---

## Color Palette Reference

```css
Primary Colors:
  Primary Blue: #0066CC (Google Scholar blue)
  Dark Blue: #0052A3 (hover state)
  Darkest Blue: #003D7A (active state)

Semantic Colors:
  Success Green: #22C55E
  Error Red: #EF4444
  Warning Amber: #F59E0B
  Info Blue: #3B82F6

Neutral Colors:
  Background Gray: #F5F5F5
  Light Gray: #FAFAFA
  Border Gray: #E0E0E0
  Mid Gray: #D0D0D0
  Text Gray: #666666
  Dark Gray: #333333
  Light Text Gray: #999999

Rating Badge Colors:
  A* Badge: #FF6B6B (red)
  A Badge: #4ECDC4 (teal)
  B Badge: #45B7D1 (blue)
  C Badge: #FFA07A (orange)

Error States:
  Error Background: #FEF2F2
  Error Border: #EF4444
  Error Text: #EF4444
```

---

## Typography Reference

```css
Font Family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif

Font Sizes:
  Headings (Sidebar): 14px, bold, #333333
  Labels: 12px, regular, #666666
  Body Text: 14px, regular, #555555
  Small Text: 12px, regular, #999999
  Mono (Code): 13px, monospace, #333333

Line Heights:
  Headings: 1.4
  Body: 1.6
  Input: 1.4
```

---

## Spacing Scale

```css
XS: 4px
SM: 8px
MD: 12px
LG: 16px
XL: 24px
2XL: 32px
3XL: 48px

Usage:
  Padding within sections: 16px (LG)
  Margin between sections: 24px (XL)
  Gap between items: 8px (SM) to 16px (LG)
  Outer padding: 32px (2XL)
```

---

## Implementation Checklist

### Phase 1: Layout Structure

- [ ] Create main layout with sidebar (300px fixed, left column)
- [ ] Create main content area with proper margin and padding
- [ ] Implement responsive breakpoint (hide sidebar on mobile)
- [ ] Test layout on multiple screen sizes

### Phase 2: Sidebar Components

- [ ] Year range filters (two inputs side-by-side)
- [ ] Field of Research accordion with checkboxes
- [ ] Journal ratings filter with checkboxes
- [ ] Selected journals list with remove buttons
- [ ] Proper scrolling and overflow handling

### Phase 3: Main Content - Header

- [ ] Year Low and Year High inputs
- [ ] Field selector dropdown
- [ ] Remove button (×) for header section

### Phase 4: Search Blocks

- [ ] Single unified container with borders
- [ ] Individual search blocks without internal separation
- [ ] Field, term, is exact, and remove button in one line
- [ ] Operators section below (collapsible)
- [ ] Error state styling with red border and message

### Phase 5: Action Buttons & Preview

- [ ] Add Another button
- [ ] Search button (primary color)
- [ ] Query preview panel with syntax highlighting
- [ ] Copy and view results buttons

### Phase 6: Advanced Features

- [ ] Advanced options toggle
- [ ] Hidden advanced filters (year, citations, language, document type)
- [ ] Smooth animations for expand/collapse

### Phase 7: Styling & Polish

- [ ] Apply color palette
- [ ] Fine-tune spacing and typography
- [ ] Add hover effects and transitions
- [ ] Test accessibility (keyboard navigation, screen readers)
- [ ] Test error states

---

## Notes

- All measurements are in pixels unless otherwise specified
- Use Tailwind CSS utility classes where possible
- Implement CSS custom properties for colors and spacing
- Ensure all interactive elements have clear focus states
- Test with keyboard navigation (Tab, Enter, Escape)
- Consider dark mode support in future iterations
- Performance: Lazy-load sidebar content if needed on mobile
