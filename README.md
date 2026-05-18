# Scholarle Query Builder

A Next.js application for building structured academic search queries and opening them in Google Scholar.

The app provides a visual query builder, block-level operators, and side filters (year range, field of research, journal ratings, and journal ISSN selection) that feed into a Query Translation Module (QTM) to generate Google Scholar URLs.

## What the app currently does

- Lets users create multiple query blocks with:
  - **Field** selection
  - **Search term**
  - **Operator** selection (`NONE`, `AND_NEXT`, `AND_PREV`, `OR_NEXT`, `OR_PREV`, `EXCLUDE`)
  - **Exact phrase** toggle (`isExact`)
- Builds a Google Scholar query string with:
  - Field operators (for supported fields)
  - Exclusion via `-`
  - Parenthetical grouping for linked operator chains
  - URL encoding through `encodeURIComponent`
- Supports sidebar filters:
  - **Year range** (`as_ylo`, `as_yhi`)
  - **Journal filtering by ISSN(s)** from CSV-backed journal data
  - **Journal rating filtering** (`A*`, `A`, `B`, `C`) for journal selection UI
  - **Field of research** filtering for journal availability UI
- Opens the generated URL in a **new browser tab**.

## Active search fields (current implementation)

Defined in `/home/runner/work/gs-query-builder/gs-query-builder/data/SearchWithin.ts`:

- `all_fields` → no explicit GS operator
- `article_title` → `intitle:`
- `author` → `author:`
- `abstract` → `intext:`
- `site_search` → `site:`
- `filetype_search` → `filetype:`

> Note: additional fields exist as commented code but are not active in the current UI list.

## Query translation module (QTM)

Implemented in `/home/runner/work/gs-query-builder/gs-query-builder/lib/qtm.ts`.

Main responsibilities:

- Validate/clean input blocks
- Synthesize each block based on field/operator/exact settings
- Group connected blocks into parentheses using forward/backward operator chain logic
- Append journal ISSN expressions to the main query
- Build final Google Scholar URL with mandatory/default parameters and optional filters
- Warn when URL length exceeds `2048`

### URL base and mandatory config

From `/home/runner/work/gs-query-builder/gs-query-builder/config/GSConfig.ts`:

- `BASE_URL = https://scholar.google.com/scholar?`
- `DEFAULT_HL = en`
- `DEFAULT_AS_SDT = 0%2C5`
- `MAX_URL_LENGTH = 2048`

## Routes

- `/` → Query Builder
- `/about` → About page
- `/how-to-use` → Help/guide page
- `/feedback` → Feedback page (includes external Google Form link)

## UI and layout behavior

- Main layout uses a **left sidebar** for filters and a **content area** for query blocks.
- Sidebar is:
  - Resizable (desktop)
  - Collapsible
  - Mobile-aware
  - Width persisted in `localStorage`

## Journal data and filtering

- Journal source file: `/home/runner/work/gs-query-builder/gs-query-builder/public/data/journals.csv`
- Loader/parser: `/home/runner/work/gs-query-builder/gs-query-builder/lib/journalLoader.ts`
- Types and validation rules: `/home/runner/work/gs-query-builder/gs-query-builder/types/journal.ts`

The journal selector filters journals by selected field codes and ratings, then allows ISSN selection. Selected ISSNs are appended to the final query.

## Tech stack

- **Framework:** Next.js 15 (App Router)
- **Language:** TypeScript
- **UI:** React 19 + Tailwind CSS
- **UI primitives:** Radix UI components
- **Icons:** lucide-react
- **Analytics:** @vercel/analytics

## Project structure (key paths)

```text
gs-query-builder/
├── app/                      # Next.js routes
├── components/               # UI and feature components
├── config/GSConfig.ts        # Google Scholar config constants
├── data/SearchWithin.ts      # Active search fields
├── lib/qtm.ts                # Query Translation Module
├── lib/journalLoader.ts      # Journal CSV load/parse/validation
├── types/                    # Shared TypeScript types
├── public/data/journals.csv  # Journal dataset
├── test/query/               # Query-related test files
├── docs/                     # Extended project docs
└── README.md
```

## Development

### Prerequisites

- Node.js 18+
- npm (or Bun if preferred in your environment)

### Install

```bash
npm install
```

If peer dependency resolution fails in your environment, retry with:

```bash
npm install --legacy-peer-deps
```

### Run

```bash
npm run dev
```

### Build

```bash
npm run build
```

### Lint

```bash
npm run lint
```

## Scripts

From `package.json`:

- `dev` → `next dev --turbopack`
- `build` → `next build --turbopack`
- `start` → `next start`
- `lint` → `eslint`

## Testing status in this repository

- Query-related test files exist under `/home/runner/work/gs-query-builder/gs-query-builder/test/query/`.
- There is currently **no `test` script** defined in `package.json`.

## Important implementation notes

- Search submission currently uses `window.open(result.url, "_blank")` (new tab behavior).
- Field-of-research selections are used to filter available journals in the sidebar.
- Journal ISSN selections are appended into the query and impact the generated URL.
- The app keeps backward compatibility paths for legacy boolean operator fields in QTM.

## Documentation

Additional documentation is available in `/home/runner/work/gs-query-builder/gs-query-builder/docs/`.

## Changelog

Project change history is maintained in `/home/runner/work/gs-query-builder/gs-query-builder/CHANGELOG.md`.
