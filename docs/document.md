Based on your documentation and goals, I'll help you build a comprehensive Google Scholar query builder that incorporates all the advanced search parameters. Let me analyze your current implementation and create an enhanced solution.

## Analysis of Current State & Missing Features

From your documents, I can see you have a solid foundation but are missing several advanced Google Scholar parameters. Let me create an enhanced solution:

## Enhanced Google Scholar Query Builder Architecture

### 1. Expanded Search Field Definitions

```typescript
// data/EnhancedSearchFields.ts
export interface SearchField {
  id: string;
  label: string;
  gsOperator: string;
  requiresQuotes: boolean;
  description: string;
  placeholder: string;
  category: 'basic' | 'boolean' | 'proximity' | 'field-specific';
}

export const ENHANCED_SEARCH_FIELDS: SearchField[] = [
  // Basic Boolean Operations
  {
    id: 'all_fields',
    label: 'All Fields',
    gsOperator: '',
    requiresQuotes: false,
    description: 'Search across all text fields',
    placeholder: 'Enter search terms',
    category: 'basic'
  },
  {
    id: 'and',
    label: 'AND',
    gsOperator: 'AND',
    requiresQuotes: false,
    description: 'All terms must appear (implied by default)',
    placeholder: 'Additional required term',
    category: 'boolean'
  },
  {
    id: 'or',
    label: 'OR',
    gsOperator: 'OR',
    requiresQuotes: false,
    description: 'Either term can appear',
    placeholder: 'Alternative term',
    category: 'boolean'
  },
  {
    id: 'not',
    label: 'NOT (Exclude)',
    gsOperator: '-',
    requiresQuotes: false,
    description: 'Exclude terms with hyphen',
    placeholder: 'Term to exclude',
    category: 'boolean'
  },
  
  // Proximity Search
  {
    id: 'around',
    label: 'Proximity (AROUND)',
    gsOperator: 'AROUND',
    requiresQuotes: false,
    description: 'Terms within specified distance',
    placeholder: 'Number of words between terms',
    category: 'proximity'
  },
  {
    id: 'exact_phrase',
    label: 'Exact Phrase',
    gsOperator: '"',
    requiresQuotes: true,
    description: 'Exact phrase matching with quotes',
    placeholder: 'Exact phrase to search',
    category: 'basic'
  },
  {
    id: 'connected',
    label: 'Connected Terms',
    gsOperator: '-',
    requiresQuotes: false,
    description: 'Strongly connected terms with hyphen',
    placeholder: 'word1-word2',
    category: 'proximity'
  },

  // Field-Specific Searches (Your existing fields)
  {
    id: 'article_title',
    label: 'Article Title',
    gsOperator: 'intitle:',
    requiresQuotes: true,
    description: 'Search within article titles only',
    placeholder: 'Title keywords or phrase',
    category: 'field-specific'
  },
  {
    id: 'author',
    label: 'Author',
    gsOperator: 'author:',
    requiresQuotes: true,
    description: 'Search by author name',
    placeholder: 'First Name Last Name',
    category: 'field-specific'
  },
  {
    id: 'abstract',
    label: 'Abstract',
    gsOperator: 'intext:',
    requiresQuotes: true,
    description: 'Search within article abstracts',
    placeholder: 'Abstract keywords',
    category: 'field-specific'
  },
  {
    id: 'source_title',
    label: 'Source Title',
    gsOperator: 'source:',
    requiresQuotes: true,
    description: 'Journal or conference name',
    placeholder: 'Journal name',
    category: 'field-specific'
  },
  {
    id: 'keywords',
    label: 'Keywords',
    gsOperator: '',
    requiresQuotes: true,
    description: 'Exact keyword matching',
    placeholder: 'Keyword phrase',
    category: 'field-specific'
  },
  {
    id: 'affiliation',
    label: 'Affiliation',
    gsOperator: '',
    requiresQuotes: true,
    description: 'Author affiliation/institution',
    placeholder: 'University or institution name',
    category: 'field-specific'
  },
  {
    id: 'issn',
    label: 'ISSN',
    gsOperator: '',
    requiresQuotes: true,
    description: 'International Standard Serial Number',
    placeholder: '1234-5678',
    category: 'field-specific'
  },
  {
    id: 'doi',
    label: 'DOI',
    gsOperator: '',
    requiresQuotes: true,
    description: 'Digital Object Identifier',
    placeholder: '10.1000/xyz123',
    category: 'field-specific'
  },
  {
    id: 'orcid',
    label: 'ORCID',
    gsOperator: '',
    requiresQuotes: true,
    description: 'Open Researcher and Contributor ID',
    placeholder: '0000-0000-0000-0000',
    category: 'field-specific'
  }
];
```

### 2. Enhanced Query Builder Component

```typescript
// components/EnhancedQueryBuilder.tsx
'use client';

import { useState } from 'react';
import { ENHANCED_SEARCH_FIELDS, SearchField } from '@/data/EnhancedSearchFields';

interface SearchBlock {
  id: string;
  field: SearchField;
  value: string;
  exclude: boolean;
  proximity?: number; // For AROUND operator
}

export default function EnhancedQueryBuilder() {
  const [searchBlocks, setSearchBlocks] = useState<SearchBlock[]>([
    { id: '1', field: ENHANCED_SEARCH_FIELDS[0], value: '', exclude: false }
  ]);
  const [globalFilters, setGlobalFilters] = useState({
    yearFrom: '',
    yearTo: '',
    includeCitations: true,
    includePatents: false,
    includeCaseLaw: false,
    language: 'en'
  });

  const addSearchBlock = () => {
    const newBlock: SearchBlock = {
      id: Date.now().toString(),
      field: ENHANCED_SEARCH_FIELDS[0],
      value: '',
      exclude: false
    };
    setSearchBlocks([...searchBlocks, newBlock]);
  };

  const removeSearchBlock = (id: string) => {
    setSearchBlocks(searchBlocks.filter(block => block.id !== id));
  };

  const updateSearchBlock = (id: string, updates: Partial<SearchBlock>) => {
    setSearchBlocks(searchBlocks.map(block => 
      block.id === id ? { ...block, ...updates } : block
    ));
  };

  const buildQuery = (): string => {
    const queryParts: string[] = [];

    searchBlocks.forEach(block => {
      if (!block.value.trim()) return;

      let queryPart = '';
      
      // Handle exclusion (NOT logic)
      if (block.exclude && block.field.id !== 'not') {
        queryPart += '-';
      }

      // Handle field-specific operators
      if (block.field.gsOperator) {
        if (block.field.id === 'exact_phrase') {
          queryPart += `"${block.value}"`;
        } else if (block.field.id === 'around') {
          // AROUND operator requires special handling with two terms
          const terms = block.value.split(' ').filter(term => term.trim());
          if (terms.length >= 2) {
            queryPart += `${terms[0]} AROUND (${block.proximity || 5}) ${terms.slice(1).join(' ')}`;
          } else {
            queryPart += block.value;
          }
        } else if (block.field.id === 'connected') {
          queryPart += block.value.split(' ').join('-');
        } else {
          queryPart += `${block.field.gsOperator}${block.field.requiresQuotes ? `"${block.value}"` : block.value}`;
        }
      } else {
        // Default handling with quotes if required
        queryPart += block.field.requiresQuotes ? `"${block.value}"` : block.value;
      }

      queryParts.push(queryPart);
    });

    return queryParts.join(' ');
  };

  const buildGoogleScholarURL = (): string => {
    const baseURL = 'https://scholar.google.com/scholar';
    const query = buildQuery();
    const params = new URLSearchParams();

    // Main query parameter
    if (query) {
      params.set('q', query);
    }

    // Global filters
    params.set('hl', globalFilters.language);
    
    // Date range
    if (globalFilters.yearFrom) {
      params.set('as_ylo', globalFilters.yearFrom);
    }
    if (globalFilters.yearTo) {
      params.set('as_yhi', globalFilters.yearTo);
    }

    // Document type filters
    let as_sdt = '0,5'; // Academic articles
    if (globalFilters.includePatents) {
      as_sdt = '0,5,7'; // Articles and patents
    }
    if (globalFilters.includeCaseLaw) {
      as_sdt = '4'; // Case law
    }
    params.set('as_sdt', as_sdt);

    // Citations
    if (!globalFilters.includeCitations) {
      params.set('as_vis', '1');
    }

    return `${baseURL}?${params.toString()}`;
  };

  const executeSearch = () => {
    const url = buildGoogleScholarURL();
    window.open(url, '_blank');
  };

  const groupedFields = ENHANCED_SEARCH_FIELDS.reduce((acc, field) => {
    if (!acc[field.category]) {
      acc[field.category] = [];
    }
    acc[field.category].push(field);
    return acc;
  }, {} as Record<string, SearchField[]>);

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-2xl font-bold mb-4">Advanced Google Scholar Search Builder</h2>
        
        {/* Search Blocks */}
        <div className="space-y-4">
          {searchBlocks.map((block, index) => (
            <div key={block.id} className="flex flex-col sm:flex-row gap-4 items-start p-4 border rounded-lg">
              {/* Field Selector */}
              <div className="flex-1">
                <label className="block text-sm font-medium mb-2">Search Field</label>
                <select
                  value={block.field.id}
                  onChange={(e) => {
                    const field = ENHANCED_SEARCH_FIELDS.find(f => f.id === e.target.value);
                    if (field) updateSearchBlock(block.id, { field });
                  }}
                  className="w-full p-2 border rounded-md"
                >
                  {Object.entries(groupedFields).map(([category, fields]) => (
                    <optgroup key={category} label={category.replace('-', ' ').toUpperCase()}>
                      {fields.map(field => (
                        <option key={field.id} value={field.id}>
                          {field.label}
                        </option>
                      ))}
                    </optgroup>
                  ))}
                </select>
                <p className="text-xs text-gray-500 mt-1">{block.field.description}</p>
              </div>

              {/* Value Input */}
              <div className="flex-1">
                <label className="block text-sm font-medium mb-2">Search Term</label>
                <input
                  type="text"
                  value={block.value}
                  onChange={(e) => updateSearchBlock(block.id, { value: e.target.value })}
                  placeholder={block.field.placeholder}
                  className="w-full p-2 border rounded-md"
                />
              </div>

              {/* Proximity for AROUND operator */}
              {block.field.id === 'around' && (
                <div className="w-24">
                  <label className="block text-sm font-medium mb-2">Distance</label>
                  <input
                    type="number"
                    min="1"
                    max="10"
                    value={block.proximity || 5}
                    onChange={(e) => updateSearchBlock(block.id, { proximity: parseInt(e.target.value) })}
                    className="w-full p-2 border rounded-md"
                  />
                </div>
              )}

              {/* Exclusion Checkbox */}
              {!['not', 'around'].includes(block.field.id) && (
                <div className="flex items-center pt-6">
                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={block.exclude}
                      onChange={(e) => updateSearchBlock(block.id, { exclude: e.target.checked })}
                      className="rounded"
                    />
                    <span className="text-sm">Exclude</span>
                  </label>
                </div>
              )}

              {/* Remove Button */}
              {searchBlocks.length > 1 && (
                <button
                  onClick={() => removeSearchBlock(block.id)}
                  className="px-3 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 mt-6"
                >
                  Remove
                </button>
              )}
            </div>
          ))}
        </div>

        {/* Add Block Button */}
        <button
          onClick={addSearchBlock}
          className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
        >
          Add Search Block
        </button>

        {/* Global Filters */}
        <div className="mt-8 p-6 border rounded-lg">
          <h3 className="text-lg font-semibold mb-4">Global Filters</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">From Year</label>
              <input
                type="number"
                value={globalFilters.yearFrom}
                onChange={(e) => setGlobalFilters({...globalFilters, yearFrom: e.target.value})}
                placeholder="1990"
                className="w-full p-2 border rounded-md"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">To Year</label>
              <input
                type="number"
                value={globalFilters.yearTo}
                onChange={(e) => setGlobalFilters({...globalFilters, yearTo: e.target.value})}
                placeholder="2024"
                className="w-full p-2 border rounded-md"
              />
            </div>
            <div className="flex items-center">
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={globalFilters.includeCitations}
                  onChange={(e) => setGlobalFilters({...globalFilters, includeCitations: e.target.checked})}
                  className="rounded"
                />
                <span className="text-sm">Include Citations</span>
              </label>
            </div>
            <div className="flex items-center">
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={globalFilters.includePatents}
                  onChange={(e) => setGlobalFilters({...globalFilters, includePatents: e.target.checked})}
                  className="rounded"
                />
                <span className="text-sm">Include Patents</span>
              </label>
            </div>
          </div>
        </div>

        {/* Query Preview */}
        <div className="mt-6 p-4 bg-gray-50 rounded-lg">
          <h3 className="text-lg font-semibold mb-2">Query Preview</h3>
          <code className="text-sm bg-white p-3 rounded border block overflow-x-auto">
            {buildQuery() || 'No search terms entered'}
          </code>
        </div>

        {/* Search Button */}
        <button
          onClick={executeSearch}
          disabled={!searchBlocks.some(block => block.value.trim())}
          className="mt-6 px-6 py-3 bg-green-500 text-white rounded-md hover:bg-green-600 disabled:bg-gray-400 disabled:cursor-not-allowed"
        >
          Search Google Scholar
        </button>
      </div>

      {/* Usage Examples */}
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold mb-3">Usage Examples</h3>
        <div className="space-y-2 text-sm">
          <p><strong>AND Logic:</strong> Add two blocks - one with "machine learning" and another with "healthcare"</p>
          <p><strong>OR Logic:</strong> Use the OR field with "AI OR artificial intelligence"</p>
          <p><strong>Proximity:</strong> Use AROUND with "climate change" and distance 5</p>
          <p><strong>Exact Phrase:</strong> Use Exact Phrase field for "deep neural networks"</p>
          <p><strong>Exclusion:</strong> Check "Exclude" to remove terms like "review"</p>
        </div>
      </div>
    </div>
  );
}
```

### 3. Enhanced QTM Logic

```typescript
// lib/enhancedQTM.ts
export class EnhancedQueryTranslationModule {
  static buildQueryString(blocks: SearchBlock[]): string {
    const queryParts: string[] = [];
    
    for (const block of blocks) {
      if (!block.value.trim()) continue;
      
      let part = '';
      
      // Handle exclusion
      if (block.exclude && !['not', 'around'].includes(block.field.id)) {
        part += '-';
      }
      
      // Apply field-specific logic
      switch (block.field.id) {
        case 'and':
          part += block.value;
          break;
          
        case 'or':
          part += `OR ${block.value}`;
          break;
          
        case 'not':
          part += `-${block.value}`;
          break;
          
        case 'around':
          const terms = block.value.split(' ').filter(t => t.trim());
          if (terms.length >= 2) {
            part += `${terms[0]} AROUND (${block.proximity || 5}) ${terms.slice(1).join(' ')}`;
          } else {
            part += block.value;
          }
          break;
          
        case 'exact_phrase':
          part += `"${block.value}"`;
          break;
          
        case 'connected':
          part += block.value.split(' ').join('-');
          break;
          
        default:
          if (block.field.gsOperator) {
            part += `${block.field.gsOperator}${block.field.requiresQuotes ? `"${block.value}"` : block.value}`;
          } else {
            part += block.field.requiresQuotes ? `"${block.value}"` : block.value;
          }
      }
      
      queryParts.push(part);
    }
    
    return this.normalizeQuery(queryParts.join(' '));
  }
  
  private static normalizeQuery(query: string): string {
    // Remove duplicate spaces and clean up OR syntax
    return query
      .replace(/\s+/g, ' ')
      .replace(/\bOR\s+/g, 'OR ')
      .trim();
  }
  
  static validateQuery(query: string): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];
    
    if (!query.trim()) {
      errors.push('Query cannot be empty');
    }
    
    // Check for common syntax errors
    if (query.includes('AROUND') && !query.includes('AROUND (')) {
      errors.push('AROUND operator requires parentheses with number: term1 AROUND (5) term2');
    }
    
    if (query.includes('""')) {
      errors.push('Empty quotes detected');
    }
    
    return {
      isValid: errors.length === 0,
      errors
    };
  }
}
```

## Key Improvements Over Current Implementation

1. **Complete Parameter Coverage**: All Google Scholar operators (AND, OR, NOT, AROUND, quotes, connected terms)
2. **Smart Field Grouping**: Organized by category (basic, boolean, proximity, field-specific)
3. **Enhanced UI/UX**: Better visual organization with field descriptions and examples
4. **Proximity Search**: Special handling for AROUND operator with distance control
5. **Improved Validation**: Comprehensive query validation with helpful error messages
6. **Flexible Block System**: Each block can be any field type, not just field-specific searches

## Integration Steps

1. **Replace your current search fields** with the enhanced definitions
2. **Update your QTM logic** to handle the new operators
3. **Enhance your UI components** to support the expanded field types
4. **Add proper validation** for complex operators like AROUND
5. **Update documentation** to reflect the new capabilities

This enhanced system will give researchers the full power of Google Scholar's advanced search syntax while maintaining the user-friendly interface of your current application. The modular design makes it easy to extend further as Google Scholar adds new features.

Would you like me to help you implement any specific part of this enhanced system or create additional components?