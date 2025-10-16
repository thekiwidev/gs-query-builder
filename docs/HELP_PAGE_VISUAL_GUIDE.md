# In-App Help Page - Visual Guide

## Layout Structure

```
┌─────────────────────────────────────────────────────────────────────────┐
│  X  How to Use Query Builder                                            │
│     Comprehensive guide to mastering academic research searches          │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                           │
│  ┌──────────────────────┐  ┌──────────────────────────────────────────┐ │
│  │  CONTENTS            │  │ 🚀 Getting Started                        │ │
│  │                      │  │                                           │ │
│  │ • Getting Started    │  │ ┌─ Three-Step Process ─────────────────┐ │ │
│  │ • Search Blocks   ◄──┼──┼─ 1. Add Search Terms                  │ │ │
│  │ • Operators         │  │ 2. Configure Filters                  │ │ │
│  │ • Is Exact          │  │ 3. Search                             │ │ │
│  │ • Journals          │  │ └───────────────────────────────────────┘ │ │
│  │ • Filters           │  │                                           │ │
│  │ • Examples          │  │ The Query Builder helps you create...     │ │
│  │ • Tips & Tricks     │  │                                           │ │
│  │ • Common Issues     │  │ 📝 Understanding Search Blocks           │ │
│  │                      │  │                                           │ │
│  │ [Active Section]    │  │ ▶ What is a Search Block?                │ │
│  │  highlighted in     │  │ ▶ Adding Search Blocks                   │ │
│  │  blue              │  │ ▶ Best Practices                         │ │
│  │                      │  │                                           │ │
│  └──────────────────────┘  │ ✅ DO:                                   │ │
│                            │ • Use specific field selections          │ │
│    Sticky on scroll        │ • One concept per search block          │ │
│                            │                                           │ │
│                            │ 🔗 Working with Operators                │ │
│                            │                                           │ │
│                            │ ▶ AND Operator                           │ │
│                            │ ▶ OR Operator                            │ │
│                            │ ▶ EXCLUDE Operator (NOT)                 │ │
│                            │                                           │ │
│                            │ [... more content below, scroll to read]│ │
│                            │                                           │ │
│  └──────────────────────────────────────────────────────────────────────┘ │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

## Modal Behavior

### Opening the Help Page

1. User clicks **Help** button in QueryBuilder header (top-right)
2. Modal overlay (semi-transparent black background) appears
3. White content panel slides up with smooth transition
4. Close button (X) available in top-right corner

### Navigating Content

- **Click TOC item** → Smooth scroll to that section
- **Click section title** → Collapse/expand that section (▼/▶)
- **Scroll down** → Browse all content, TOC stays sticky
- **Click Close** → Modal dismisses and returns to QueryBuilder

### Content Sections

```
1. GETTING STARTED
   └─ Three-step process overview

2. SEARCH BLOCKS
   ├─ What is a Search Block?
   ├─ Adding Search Blocks
   └─ Best Practices (✅ DO / ❌ DON'T)

3. OPERATORS
   ├─ AND Operator (blue highlight)
   ├─ OR Operator (green highlight)
   ├─ EXCLUDE Operator (orange highlight)
   └─ Operator Rules

4. IS EXACT
   ├─ Regular Search (Is Exact OFF)
   ├─ Exact Match (Is Exact ON)
   └─ Real-World Comparison (table)

5. JOURNAL FILTERING
   ├─ Journal Ratings (A*, A, B, C)
   ├─ How to Filter
   └─ Journal Statistics

6. ADVANCED FILTERS
   ├─ Year Range Filter
   └─ Field of Research Filter

7. REAL-WORLD EXAMPLES
   ├─ Example 1: Recent Papers by Top Authors
   ├─ Example 2: Comprehensive Topic Survey
   └─ Example 3: Author Citation Search

8. TIPS & TRICKS
   ├─ Speed Up Your Search
   ├─ Refine Results Iteratively
   └─ Debug Failed Searches

9. COMMON ISSUES & SOLUTIONS
   ├─ Issue: Red Error on Operator
   ├─ Issue: No Results Found
   ├─ Issue: Too Many Results
   └─ Best Practices Summary
```

## Color Coding

### Section Headers

- 🚀 Yellow/Blue border - Getting started
- 📝 Blue border - Search blocks
- 🔗 Green/Blue border - Operators
- ✓ Blue border - Is Exact feature
- 📚 Red/Green/Blue borders - Journal ratings
- 🔍 Blue border - Advanced filters
- 💡 Blue border - Examples
- ⚡ Yellow/Orange borders - Tips & Tricks
- 🆘 Red/Orange borders - Common issues

### Content Boxes

```
✅ DO (Green box)
   • Recommendation 1
   • Recommendation 2

❌ DON'T (Red box)
   • Anti-pattern 1
   • Anti-pattern 2

⚠️ Warning (Orange/Yellow box)
   Important note or caution

📊 Example (Gray box)
   Code example or configuration

💡 Tip (Blue box)
   Helpful hint
```

## Keyboard Navigation

- **Tab** - Navigate through interactive elements
- **Enter/Space** - Toggle section collapse/expand
- **Click** - Navigate to section
- **Escape** (future) - Close modal

## Responsive Behavior

### Desktop (>1024px)

- TOC on left (25% width)
- Content on right (75% width)
- Both scroll independently
- TOC sticky on vertical scroll

### Tablet (768px - 1024px)

- Reduced padding/spacing
- TOC still visible on left
- Content area adjusted

### Mobile (< 768px)

- Full-width single column
- TOC visible but may require scroll
- Content full width
- Touch-friendly button sizes

## Integration Point in QueryBuilder

```tsx
// QueryBuilder Header
┌─────────────────────────────────────────────────────────┐
│ Google Scholar Query Builder    [Help] ◄─── Click here  │
│ Create advanced searches...                              │
└─────────────────────────────────────────────────────────┘

// When clicked, shows:
┌─────────────────────────────────────────────────────────┐
│ X  How to Use Query Builder                              │
│    (Full help page modal overlay)                        │
└─────────────────────────────────────────────────────────┘
```

## Example Section: Operators

```
🔗 Working with Operators

▼ AND Operator

  Meaning: Papers must contain BOTH search terms

  Use AND to narrow your results by adding more requirements.

  Example: [Author] "John Smith" AND [Title] "machine learning"
  returns papers where John Smith is the author AND the title
  contains "machine learning"


▶ OR Operator

  [Click to expand...]


▶ EXCLUDE Operator (NOT)

  [Click to expand...]


▼ Operator Rules

  ⚠️ Cannot use AND/OR after EXCLUDE - Keep EXCLUDE blocks at the end
  ⚠️ First block cannot use "with previous" - It has no previous block
  ⚠️ Last block cannot use "with next" - It has no next block

  The system prevents invalid combinations and shows helpful error
  messages.
```

## Example Section: Journal Ratings

```
📚 Journal Filtering

▼ Journal Ratings

  ┌─ A* (Tier 1) - 193 journals ─────────────────┐
  │ Top-tier, highly selective journals           │
  │ (Nature, Science, PNAS)                       │
  └───────────────────────────────────────────────┘

  ┌─ A (Tier 2) - 623 journals ──────────────────┐
  │ High quality, rigorous peer review            │
  └───────────────────────────────────────────────┘

  ┌─ B (Tier 3) - 800 journals ──────────────────┐
  │ Good quality, solid peer review               │
  └───────────────────────────────────────────────┘

  ┌─ C (Tier 4) - 894 journals ──────────────────┐
  │ Established journals, peer reviewed           │
  └───────────────────────────────────────────────┘
```

## Real-World Example

```
💡 Example 1: Find Recent Papers by Top Authors

Goal:
Find papers on deep learning by Yann LeCun published in top
journals after 2020

Configuration:
┌──────────────────────────────────────────────────────────┐
│ Block 1: [Article Title] "deep learning"                 │
│ Operator: AND                                            │
│ Block 2: [Author] "Yann LeCun" (Is Exact ON)            │
│ Filters: A* journals, From: 2020                         │
└──────────────────────────────────────────────────────────┘

This query finds papers with "deep learning" in the title by
Yann LeCun published in A* journals in 2020 or later.
```

## Mobile View (Simplified)

```
┌─────────────────────────────────┐
│ X  How to Use Query Builder      │
├─────────────────────────────────┤
│ Contents:                        │
│ • Getting Started               │
│ • Search Blocks                 │
│ • Operators                     │
│ • Is Exact                      │
│ • Journals                      │
│ • Filters                       │
│ • Examples                      │
│ • Tips & Tricks                 │
│ • Common Issues                 │
│                                 │
│ 🚀 Getting Started              │
│                                 │
│ Three-Step Process              │
│ 1. Add Search Terms             │
│ 2. Configure Filters            │
│ 3. Search                       │
│                                 │
│ [Scroll for more content]       │
│                                 │
└─────────────────────────────────┘
```

## Accessibility Features

- ✅ Semantic HTML (sections, headings, lists)
- ✅ High contrast text (gray-900 on white)
- ✅ Clear heading hierarchy (h1 > h2 > h3)
- ✅ Alt text patterns for icons (title attributes)
- ✅ Keyboard navigable (tab through buttons)
- ✅ Focus indicators on interactive elements
- ✅ Color not sole means of conveying information (text labels)
- ✅ Readable font sizes (14px min)
- ✅ Proper link semantics
