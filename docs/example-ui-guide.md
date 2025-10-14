# Google Scholar Query Builder - Example UI Guide

This guide demonstrates how to set up the four example queries in the Google Scholar Query Builder interface.

## Example 1: Author "John Smith" AND title "machine learning"

![Example 1 Setup](https://placeholder-for-diagram-1.png)

### UI Configuration:

1. **Search Block 1:**
   - Field: "Author"
   - Term: "John Smith"
   - Operator: Default (AND)
2. **Search Block 2:**
   - Field: "Article Title"
   - Term: "machine learning"

### Expected Query Preview:

```
author:"John Smith" intitle:"machine learning"
```

### Explanation:

This query will find papers authored by "John Smith" that have "machine learning" in their title. The space between the terms represents an implicit AND relationship, meaning both conditions must be satisfied.

---

## Example 2: Title contains "neural networks" OR "deep learning"

![Example 2 Setup](https://placeholder-for-diagram-2.png)

### UI Configuration:

1. **Search Block 1:**
   - Field: "Article Title"
   - Term: "neural networks"
   - Operator: "OR next term"
2. **Search Block 2:**
   - Field: "Article Title"
   - Term: "deep learning"

### Expected Query Preview:

```
(intitle:"neural networks" OR intitle:"deep learning")
```

### Explanation:

This query will find papers that have either "neural networks" OR "deep learning" in their title. The parentheses group these terms together, and the explicit OR operator means either condition can be satisfied.

---

## Example 3: Papers about "blockchain" but exclude "cryptocurrency"

![Example 3 Setup](https://placeholder-for-diagram-3.png)

### UI Configuration:

1. **Search Block 1:**
   - Field: "All Fields"
   - Term: "blockchain"
   - Operator: Default (AND)
2. **Search Block 2:**
   - Field: "All Fields"
   - Term: "cryptocurrency"
   - Operator: "Exclude"

### Expected Query Preview:

```
blockchain -cryptocurrency
```

### Explanation:

This query will find papers that mention "blockchain" anywhere but exclude papers that mention "cryptocurrency". The minus sign (-) before "cryptocurrency" is the exclusion operator in Google Scholar.

---

## Example 4: Author "Johnson" in "Information Systems" field journals

![Example 4 Setup](https://placeholder-for-diagram-4.png)

### UI Configuration:

1. **Search Block 1:**

   - Field: "Author"
   - Term: "Johnson"

2. **Journal Selection:**
   - Field of Study: "Information Systems"
   - Selected Journals: (Multiple journals selected from dropdown)

### Expected Query Preview:

```
author:"Johnson" ("1234-5678" OR "8765-4321" OR "2468-1357")
```

### Explanation:

This query will find papers by author "Johnson" that were published in selected Information Systems journals. The journal ISSNs are grouped together with OR operators and parentheses, indicating the paper can be from any of the selected journals.

---

## Tips for Using the Query Builder

1. **Field Selection:** Choose the most specific field for your search term to improve precision
2. **Operator Selection:** Use the dropdown to select how terms relate to each other:
   - Default (blank): Implicit AND relationship
   - "OR next term": Creates an OR relationship with the next block
   - "Exclude": Adds a NOT relationship (minus sign)
3. **Journal Selection:** Use the journal selector to filter by specific publications
4. **Preview Panel:** Always check the preview panel to see the constructed query
5. **Parenthetical Grouping:** The system automatically adds parentheses for proper boolean logic

## Common Patterns

- **Finding specific phrases:** Use quotes for exact matching in the All Fields option
- **Author variations:** Try different name formats (e.g., "J Smith" and "John Smith")
- **Citation exclusion:** Use the global filter option to exclude citation-only results
- **Date restrictions:** Use the year range filters for time-specific searches
