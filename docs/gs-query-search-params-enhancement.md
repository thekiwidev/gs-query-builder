# Enhanced Google Scholar Search Field Integration Plan

Based on the analysis of your current `SearchWithin.ts` file and the detailed Google Scholar documentation, here's how to incorporate the missing parameters:

## Missing Parameters Analysis

From the PDF documentation, I've identified these missing Google Scholar parameters that need to be added to your system:

### 1. Boolean Operators
- **AND** (explicit operator)
- **OR** (explicit operator) 
- **NOT** (currently you have exclusion checkbox, but need explicit field)

### 2. Proximity Search
- **AROUND** (proximity operator with distance)

### 3. Phrase Matching
- **Exact Phrase** (quotation marks)
- **Connected Terms** (hyphenated terms)

### 4. Field-Specific Operators
- **intext:** (for abstract/body text - different from your current abstract handling)

## Enhanced SearchWithin.ts Implementation

```typescript
/**
 * Enhanced Google Scholar Search Field Definitions
 * 
 * Includes all standard fields plus advanced Boolean and proximity operators
 */

export interface SearchFieldDefinition {
  id: string;
  label: string;
  gsOperator: string | null;
  mustQuote: boolean;
  notes: string;
  category: 'field' | 'boolean' | 'proximity' | 'phrase';
  requiresValue?: boolean; // Some operators might work differently
}

export const ENHANCED_GS_SEARCH_FIELDS: SearchFieldDefinition[] = [
  // === BOOLEAN OPERATORS ===
  {
    id: "and_operator",
    label: "AND (Combine Terms)",
    gsOperator: "AND",
    mustQuote: false,
    notes: "Explicit AND operator. Must be in CAPITAL letters. Example: 'machine AND learning'",
    category: "boolean"
  },
  {
    id: "or_operator", 
    label: "OR (Alternative Terms)",
    gsOperator: "OR",
    mustQuote: false,
    notes: "Explicit OR operator. Must be in CAPITAL letters. Example: '(AI OR artificial intelligence)'",
    category: "boolean"
  },
  {
    id: "not_operator",
    label: "NOT (Exclude Terms)",
    gsOperator: "-",
    mustQuote: false,
    notes: "Exclude terms using hyphen. No space after hyphen. Example: 'machine -learning' excludes 'learning'",
    category: "boolean"
  },

  // === PROXIMITY SEARCH ===
  {
    id: "around_operator",
    label: "Proximity (AROUND)",
    gsOperator: "AROUND",
    mustQuote: false,
    notes: "Proximity search with word distance. Must be CAPITAL. Example: 'climate AROUND (5) change'",
    category: "proximity"
  },

  // === PHRASE MATCHING ===  
  {
    id: "exact_phrase",
    label: "Exact Phrase",
    gsOperator: null,
    mustQuote: true, // Auto-wrap in quotes
    notes: "Exact phrase matching using quotation marks. Example: 'deep neural networks' becomes '\"deep neural networks\"'",
    category: "phrase"
  },
  {
    id: "connected_terms",
    label: "Connected Terms", 
    gsOperator: null,
    mustQuote: false,
    notes: "Strongly connected terms with hyphens. No spaces around hyphen. Example: 'technology-systems'",
    category: "phrase"
  },

  // === YOUR EXISTING FIELD-SPECIFIC SEARCHES ===
  {
    id: "all_fields",
    label: "All Fields",
    gsOperator: null,
    mustQuote: false,
    notes: "General full-text search across all document content",
    category: "field"
  },
  {
    id: "article_title",
    label: "Article Title", 
    gsOperator: "intitle:",
    mustQuote: true,
    notes: "Restricts search to document titles only. High precision. No space after colon.",
    category: "field"
  },
  {
    id: "author",
    label: "Author",
    gsOperator: "author:",
    mustQuote: true, 
    notes: "Searches for papers by specific authors. Multi-word names require quotes. No space after colon.",
    category: "field"
  },
  {
    id: "source_title",
    label: "Source Title (Journal/Conference)",
    gsOperator: "source:",
    mustQuote: true,
    notes: "Restricts to papers published in specific journals or conferences",
    category: "field"
  },
  {
    id: "abstract_intext",
    label: "Abstract (intext)",
    gsOperator: "intext:",
    mustQuote: true,
    notes: "Searches within article body text using intext: operator. More precise than general abstract search.",
    category: "field"
  },
  {
    id: "abstract_general",
    label: "Abstract (General)",
    gsOperator: null,
    mustQuote: true,
    notes: "Approximation: Uses exact phrase matching in full-text search. No dedicated abstract field in GS.",
    category: "field"
  },
  {
    id: "keywords",
    label: "Keywords", 
    gsOperator: null,
    mustQuote: true,
    notes: "Approximation: Uses exact phrase matching in full-text search. No dedicated keywords field in GS.",
    category: "field"
  },
  {
    id: "affiliation",
    label: "Affiliation",
    gsOperator: null, 
    mustQuote: true,
    notes: "Approximation: Searches institution name as exact phrase in full-text",
    category: "field"
  },
  {
    id: "issn",
    label: "ISSN",
    gsOperator: null,
    mustQuote: true,
    notes: "Critical: Not an indexed field in GS. Must use exact phrase matching for identifier strings.",
    category: "field"
  },
  {
    id: "doi",
    label: "DOI",
    gsOperator: null,
    mustQuote: true,
    notes: "Critical: Not an indexed field in GS. Must use exact phrase matching for identifier strings.", 
    category: "field"
  },
  {
    id: "orcid",
    label: "ORCID",
    gsOperator: null,
    mustQuote: true,
    notes: "Critical: Not an indexed field in GS. Must use exact phrase matching for identifier strings.",
    category: "field"
  }
];

// Helper function to get fields by category
export function getSearchFieldsByCategory(category: SearchFieldDefinition['category']) {
  return ENHANCED_GS_SEARCH_FIELDS.filter(field => field.category === category);
}

// Group fields for UI organization
export const FIELD_CATEGORIES = {
  boolean: 'Boolean Operators',
  proximity: 'Proximity Search', 
  phrase: 'Phrase Matching',
  field: 'Field-Specific Search'
};

export function getSearchFieldById(id: string): SearchFieldDefinition | undefined {
  return ENHANCED_GS_SEARCH_FIELDS.find((field) => field.id === id);
}

export function getAllSearchFieldIds(): string[] {
  return ENHANCED_GS_SEARCH_FIELDS.map((field) => field.id);
}
```

## Enhanced QTM Logic for New Operators

```typescript
// lib/enhancedQTM.ts
export function buildEnhancedQueryString(blocks: SearchBlock[]): string {
  const queryParts: string[] = [];

  blocks.forEach(block => {
    if (!block.value.trim()) return;

    const field = getSearchFieldById(block.fieldId);
    if (!field) return;

    let queryPart = '';
    const value = block.value.trim();

    // Handle exclusion for non-NOT operators
    if (block.exclude && field.id !== 'not_operator') {
      queryPart += '-';
    }

    // Special handling for different operator types
    switch (field.category) {
      case 'boolean':
        queryPart = handleBooleanOperator(field, value, block.exclude);
        break;
      
      case 'proximity':
        queryPart = handleProximityOperator(field, value, block.proximityDistance);
        break;
      
      case 'phrase':
        queryPart = handlePhraseOperator(field, value);
        break;
      
      case 'field':
      default:
        queryPart = handleFieldOperator(field, value, block.exclude);
        break;
    }

    if (queryPart) {
      queryParts.push(queryPart);
    }
  });

  return queryParts.join(' ');
}

function handleBooleanOperator(field: SearchFieldDefinition, value: string, exclude: boolean): string {
  switch (field.id) {
    case 'and_operator':
      return exclude ? `-${value}` : value; // AND is implicit, so just use the term
      
    case 'or_operator':
      return exclude ? `-${value}` : `OR ${value}`;
      
    case 'not_operator':
      return `-${value}`; // Explicit NOT operator
      
    default:
      return value;
  }
}

function handleProximityOperator(field: SearchFieldDefinition, value: string, distance: number = 5): string {
  if (field.id === 'around_operator') {
    // AROUND operator requires two terms separated by the operator
    const terms = value.split(' ').filter(term => term.trim());
    if (terms.length >= 2) {
      return `${terms[0]} AROUND (${distance}) ${terms.slice(1).join(' ')}`;
    }
    return value; // Fallback if not enough terms
  }
  return value;
}

function handlePhraseOperator(field: SearchFieldDefinition, value: string): string {
  switch (field.id) {
    case 'exact_phrase':
      return `"${value}"`; // Auto-wrap in quotes
      
    case 'connected_terms':
      return value.split(' ').join('-'); // Replace spaces with hyphens
      
    default:
      return field.mustQuote ? `"${value}"` : value;
  }
}

function handleFieldOperator(field: SearchFieldDefinition, value: string, exclude: boolean): string {
  let part = '';
  
  if (exclude) {
    part += '-';
  }
  
  if (field.gsOperator) {
    part += field.gsOperator;
  }
  
  part += field.mustQuote ? `"${value}"` : value;
  
  return part;
}
```

## UI Integration Recommendations

### 1. Enhanced Search Block Component
```typescript
interface EnhancedSearchBlockProps {
  block: SearchBlock;
  onUpdate: (updates: Partial<SearchBlock>) => void;
  onRemove: () => void;
}

// Add special inputs for different operator types:
// - Number input for AROUND distance
// - Checkbox for exclusion (disabled for NOT operator)
// - Field grouping in dropdown by category
```

### 2. Category-Based Field Organization
Group fields in the dropdown by category for better user experience:
- **Boolean Operators**: AND, OR, NOT
- **Proximity Search**: AROUND  
- **Phrase Matching**: Exact Phrase, Connected Terms
- **Field-Specific**: All your existing fields

### 3. Validation Rules
- **CAPITAL letters** required for: AND, OR, AROUND
- **No space after colon** for: intitle:, author:, source:, intext:
- **Quotes required** for multi-word values in field-specific searches
- **No spaces around hyphen** for connected terms and NOT operator

## Migration Strategy

1. **Phase 1**: Add new fields to `SearchWithin.ts` without breaking existing functionality
2. **Phase 2**: Update QTM logic to handle new operator types  
3. **Phase 3**: Enhance UI to support special inputs (proximity distance, etc.)
4. **Phase 4**: Update documentation and user guidance

This enhanced implementation will give your users access to Google Scholar's full search capabilities while maintaining backward compatibility with your current system.