# Help Page Integration Architecture

## Navigation Flow Diagram

```
┌─────────────────────────────────────────────────────────────────────┐
│                         User's Browser                               │
├─────────────────────────────────────────────────────────────────────┤
│                                                                       │
│  Query Builder Page (/)                                              │
│  ┌──────────────────────────────────────────────────────────────┐   │
│  │ Header                                                        │   │
│  │  Google Scholar Query Builder    [Help] ◄───┐              │   │
│  │  Create advanced searches...                │              │   │
│  │                                              │ Click        │   │
│  │ Search Blocks                               │              │   │
│  │ [Block 1] [Block 2] [Block 3]               │              │   │
│  │                                              │              │   │
│  │ Query Preview                                │              │   │
│  │ ...                                          │              │   │
│  └──────────────────────────────────────────────┼──────────────┘   │
│                                                  │                  │
│                            ┌─────────────────────┘                  │
│                            │                                        │
│                            ▼                                        │
│  Help Page (/how-to-use)                                            │
│  ┌──────────────────────────────────────────────────────────────┐   │
│  │ Header                                                        │   │
│  │  X  How to Use Query Builder                                 │   │
│  │     Comprehensive guide to mastering academic research...    │   │
│  │                                                              │   │
│  │ Contents        │  Main Content                             │   │
│  │ • Getting Started        • 🚀 Getting Started              │   │
│  │ • Search Blocks          • 📝 Search Blocks                │   │
│  │ • Operators              • 🔗 Operators                    │   │
│  │ • Is Exact               • ✓ Is Exact                      │   │
│  │ • Journals               • 📚 Journals                     │   │
│  │ • Filters                • 🔍 Filters                      │   │
│  │ • Examples               • 💡 Examples                     │   │
│  │ • Tips & Tricks          • ⚡ Tips & Tricks               │   │
│  │ • Common Issues          • 🆘 Common Issues               │   │
│  │                          (Scrollable Content)               │   │
│  │                                                              │   │
│  │ [Back Button] ◄─────────────────────────────────────────┐  │   │
│  └─────────────────────────────────────────────────────────┼──┘   │
│                                                             │        │
│                      Back/Browser Back Button              │        │
│                             │◄──────────────────────────────        │
│                             │                                       │
│                             ▼                                       │
│                    Returns to Query Builder                         │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘

URL: http://yoursite.com/
                ↓ [Click Help]
URL: http://yoursite.com/how-to-use
                ↓ [Click Back]
URL: http://yoursite.com/
```

## Component Architecture

```
Next.js App Router
│
├── app/
│   ├── page.tsx (main)
│   │   └── <QueryBuilder />
│   │       └── [Help Button: router.push("/how-to-use")]
│   │
│   └── how-to-use/
│       └── page.tsx
│           └── <HowToUsePage showCloseButton={true} />
│               └── [Back Button: router.back()]
│
└── components/
    ├── QueryBuilder.tsx
    │   └── imports useRouter for navigation
    │
    └── help/
        ├── HowToUsePage.tsx (744 lines)
        │   ├── Sticky TOC Navigation
        │   ├── Content Sections (9 topics)
        │   └── Interactive Elements
        │
        └── index.ts (exports)
```

## Help Page Component Structure

```
HowToUsePage Component
│
├── Props
│   └── showCloseButton?: boolean
│
├── State
│   ├── activeSection: string
│   └── router: NextRouter
│
├── Layout
│   ├── Header
│   │   ├── Title & Description
│   │   └── Close Button (conditional)
│   │
│   └── Main Content Grid
│       ├── Left Column (25%)
│       │   └── Table of Contents (Sticky)
│       │       ├── Getting Started
│       │       ├── Search Blocks
│       │       ├── Operators
│       │       ├── Is Exact
│       │       ├── Journals
│       │       ├── Filters
│       │       ├── Examples
│       │       ├── Tips & Tricks
│       │       └── Common Issues
│       │
│       └── Right Column (75%)
│           └── Content Sections
│               ├── CollapsibleSection (reusable)
│               │   ├── Title
│               │   ├── Toggle Button
│               │   └── Content (expandable)
│               │
│               ├── Text Content
│               ├── Lists
│               ├── Code Examples
│               ├── Tables
│               ├── Color-coded Boxes
│               │   ├── Green (✅ DO)
│               │   ├── Red (❌ DON'T)
│               │   ├── Blue (ℹ️ INFO)
│               │   └── Orange (⚠️ WARNING)
│               │
│               └── Footer
│                   ├── Last Updated
│                   └── Happy Researching!
```

## Data Flow

```
User Action: Click Help Button
│
└─► QueryBuilder Component
    │
    ├─ onClick={} handler triggered
    │
    ├─ router.push("/how-to-use")
    │
    └─► Next.js Navigation
        │
        ├─ Match route: /how-to-use
        │
        ├─ Load app/how-to-use/page.tsx
        │
        ├─ Render HowToUsePage component
        │   with showCloseButton={true}
        │
        └─► Display Help Page
            │
            ├─ TOC active section tracking
            ├─ Collapsible sections state
            ├─ Smooth scroll navigation
            │
            └─ User can read, navigate, or click Back

User Action: Click Back Button
│
└─► HowToUsePage Component
    │
    ├─ onClick={} handler triggered
    │
    ├─ router.back()
    │
    └─► Browser Navigation
        │
        ├─ Pop from history stack
        │
        └─► Return to Query Builder (/)
```

## URL Routing

```
/                          Query Builder
                           ├─ header with [Help] button
                           ├─ search blocks
                           ├─ filters sidebar
                           └─ action buttons

/how-to-use               Help Documentation Page
                          ├─ header with [Back] button
                          ├─ TOC navigation
                          └─ content sections
```

## Button Interactions

### Help Button (Query Builder)

```
Location: Header, top-right
State: Always visible
Style: Outline variant
Icon: Help circle SVG
Text: "Help"
Action: onClick={() => router.push("/how-to-use")}
Result: Navigate to help page
```

### Back Button (Help Page)

```
Location: Header, top-right
State: Visible only if showCloseButton={true}
Style: Icon button
Icon: X close SVG
Action: onClick={() => router.back()}
Result: Navigate back to previous page
```

## Browser History Integration

```
Browser History Stack:

Entry 1: / (Query Builder)
         ↓ [Click Help]
Entry 2: /how-to-use (Help Page)
         ↓ [Click Back]
Entry 1: / (Query Builder) ← User returns here
```

## Responsive Design Strategy

### Desktop (> 1024px)

```
┌─────────────────────────────────────────┐
│ Header (full width)                     │
├─────────────────┬───────────────────────┤
│ TOC (25%)       │ Content (75%)         │
│ (sticky)        │ (scrollable)          │
│                 │                       │
│ • Item 1        │ Section heading       │
│ • Item 2        │ Lorem ipsum...        │
│ • Item 3        │ (collapsible content) │
│                 │                       │
└─────────────────┴───────────────────────┘
```

### Tablet (768px - 1024px)

```
┌─────────────────────────────────┐
│ Header                          │
├─────────────┬───────────────────┤
│ TOC (20%)   │ Content (80%)     │
│             │                   │
│ (reduced)   │ (adjusted)        │
│             │                   │
└─────────────┴───────────────────┘
```

### Mobile (< 768px)

```
┌───────────────────────┐
│ Header                │
├───────────────────────┤
│ Contents              │
│ • Item 1              │
│ • Item 2              │
│ • Item 3              │
│ • Item 4              │
│ • Item 5              │
│                       │
│ 🚀 Getting Started    │
│                       │
│ Lorem ipsum content   │
│ (scrollable)          │
│                       │
└───────────────────────┘
```

## SEO & Metadata

```tsx
// Page Metadata (Next.js)
export const metadata = {
  title: "How to Use Query Builder",
  description: "Comprehensive guide to mastering academic research searches",
};

// Generated HTML
<head>
  <title>How to Use Query Builder</title>
  <meta
    name="description"
    content="Comprehensive guide to mastering academic research searches"
  />
</head>;
```

## Security & Performance

```
✅ Benefits
├─ URL-based navigation (no state pollution)
├─ Server-side rendering support
├─ Code splitting (help page separate bundle)
├─ Lighthouse-friendly (good performance)
├─ Accessibility compliant
└─ No external API calls

⚡ Performance
├─ Help page loads independently
├─ Doesn't block Query Builder
├─ Can be lazy-loaded
├─ Caching-friendly
└─ Minimal JS bundle impact
```

## Summary

The help page system provides intuitive navigation with:

- ✅ Direct link access from Query Builder
- ✅ Browser history support
- ✅ Deep linkable URLs
- ✅ SEO optimization
- ✅ Responsive design
- ✅ Clean separation of concerns
