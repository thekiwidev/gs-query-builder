# Google Scholar Query Translator (GS-Search-Kit)

A Next.js application that translates structured search inputs (similar to Scopus/advanced search interfaces) into valid Google Scholar URLs. This tool allows users to create complex, multi-field searches and automatically redirects to Google Scholar with the properly formatted query.

## Features

- **Multi-Field Search Blocks**: Support for 10+ search fields including Article Title, Author, Source Title, Abstract, Keywords, ISSN, DOI, etc.
- **Advanced Query Logic**: Implicit AND logic between blocks, with support for exclusion (NOT) operations
- **Field-Specific Handling**: Automatic quoting and operator application based on Google Scholar syntax
- **Real-Time Preview**: See how your search blocks will be translated before submitting
- **Responsive UI**: Clean, modern interface built with Tailwind CSS
- **Production Ready**: Input validation, URL encoding, and error handling

## Architecture

The application follows the Query Translation Module (QTM) architecture:

- **Data Layer** (`/data/SearchWithin.ts`): Field definitions and Google Scholar operator mappings
- **Configuration** (`/config/GSConfig.ts`): Base URLs and mandatory parameters
- **QTM Core** (`/lib/qtm.ts`): Query synthesis and URL generation logic
- **UI Components** (`/components/`): React components for search interface

## Getting Started

### Prerequisites

- [Bun](https://bun.sh/) runtime
- Node.js 18+ (for compatibility)

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd gs-search-kit

# Install dependencies
bun install

# Start development server
bun run dev
```

Open [http://localhost:3000](http://localhost:3000) to access the application.

### Usage

1. **Choose a Search Field**: Select from dropdown (e.g., "Article Title", "Author", "All Fields")
2. **Enter Search Term**: Type your search query
3. **Set Exclusion** (Optional): Check "Exclude" for NOT logic
4. **Add More Blocks**: Click "Add Search Block" for complex queries
5. **Search**: Click "Search Google Scholar" to open results in new tab

### Example Queries

- **Title + Author**: `intitle:"machine learning" author:"John Smith"`
- **ISSN Lookup**: `"1234-5678"` (exact phrase matching)
- **Exclusion**: `"artificial intelligence" -source:"IEEE"`

## Field Mappings

| Field         | Google Scholar Operator | Notes                       |
| ------------- | ----------------------- | --------------------------- |
| All Fields    | (none)                  | General full-text search    |
| Article Title | `intitle:`              | Title-specific search       |
| Author        | `author:`               | Author name search          |
| Source Title  | `source:`               | Journal/conference search   |
| Abstract      | (none)                  | Exact phrase in full-text\* |
| Keywords      | (none)                  | Exact phrase in full-text\* |
| ISSN/DOI      | (none)                  | Exact phrase matching\*     |

\*Fields marked with asterisk use approximation methods since Google Scholar doesn't have dedicated indexed fields.

## Development

### Project Structure

```
gs-search-kit/
├── app/                 # Next.js app router
├── components/          # React UI components
├── config/             # Configuration files
├── data/               # Field definitions
├── docs/               # Documentation
└── lib/                # Core QTM logic
```

### Scripts

```bash
bun run dev         # Start development server
bun run build       # Build for production
bun run start       # Start production server
bun run lint        # Run ESLint
```

### Contributing

1. Follow the TypeScript interfaces defined in the data layer
2. Update `CHANGELOG.md` for any changes to QTM logic or field mappings
3. Maintain defensive programming practices with input validation
4. Test URL generation with various field combinations

## Technical Notes

- **URL Encoding**: Uses `encodeURIComponent()` for proper special character handling
- **Query Logic**: Space-separated blocks create implicit AND operations
- **Validation**: Maximum URL length validation (2048 characters)
- **Type Safety**: Full TypeScript coverage with strict type checking

## License

MIT License - see LICENSE file for details.
