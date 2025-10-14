# Google Scholar Query Builder - Example Test Guide

This guide provides step-by-step instructions for testing the four specific example queries requested.

## Example 1: Author "John Smith" AND title "machine learning"

### UI Setup:

1. Open the Google Scholar Query Builder application
2. Add first search block:
   - Field dropdown: Select "Author"
   - Term input: Enter "John Smith"
   - Operator: Leave as default (AND)
3. Click "+ Add Term" button
4. Add second search block:
   - Field dropdown: Select "Article Title"
   - Term input: Enter "machine learning"
   - Operator: Leave as default (NONE)

### Expected Results:

- Query Preview: `author:"John Smith" intitle:"machine learning"`
- The space between terms represents an implicit AND relationship
- Both terms should be properly quoted according to field requirements
- URL should contain the encoded query

### Testing Validation:

- Check that both terms appear in the query preview
- Verify the proper field operators are applied (`author:` and `intitle:`)
- Confirm quotes are added correctly to the multi-word author name and title term
- Click "Search Google Scholar" and verify you're redirected to Google Scholar with the correct query

---

## Example 2: Title contains "neural networks" OR "deep learning"

### UI Setup:

1. Open the Google Scholar Query Builder application
2. Add first search block:
   - Field dropdown: Select "Article Title"
   - Term input: Enter "neural networks"
   - Operator: Select "OR next term"
3. Click "+ Add Term" button
4. Add second search block:
   - Field dropdown: Select "Article Title"
   - Term input: Enter "deep learning"
   - Operator: Leave as default (NONE)

### Expected Results:

- Query Preview: `(intitle:"neural networks" OR intitle:"deep learning")`
- The terms should be grouped with parentheses
- Both terms should use the `intitle:` operator
- The explicit OR operator should be included between the terms
- URL should contain the encoded query

### Testing Validation:

- Check that parentheses are placed correctly around the OR expression
- Verify the OR operator is explicitly included
- Confirm both terms use the correct field operator
- Click "Search Google Scholar" and verify you're redirected to Google Scholar with the correct query

---

## Example 3: Papers about "blockchain" but exclude "cryptocurrency"

### UI Setup:

1. Open the Google Scholar Query Builder application
2. Add first search block:
   - Field dropdown: Select "All Fields"
   - Term input: Enter "blockchain"
   - Operator: Leave as default (NONE)
3. Click "+ Add Term" button
4. Add second search block:
   - Field dropdown: Select "All Fields"
   - Term input: Enter "cryptocurrency"
   - Operator: Select "Exclude" (NOT)

### Expected Results:

- Query Preview: `blockchain -cryptocurrency`
- The second term should be prefixed with a minus sign for exclusion
- URL should contain the encoded query

### Testing Validation:

- Check that the exclusion operator (minus sign) is correctly applied
- Verify that no quotes are added to single-word terms in the general search
- Click "Search Google Scholar" and verify you're redirected to Google Scholar with the correct query

---

## Example 4: Author "Johnson" in "Information Systems" field journals

### UI Setup:

1. Open the Google Scholar Query Builder application
2. Add first search block:
   - Field dropdown: Select "Author"
   - Term input: Enter "Johnson"
   - Operator: Leave as default (NONE)
3. Open the Journal Selection panel
4. Select Field of Study: "Information Systems"
5. Select multiple journals from the list (at least 2-3)

### Expected Results:

- Query Preview: `author:"Johnson" ("1234-5678" OR "8765-4321" OR "2468-1357")`
  (with actual ISSN numbers from selected journals)
- The journals should be grouped with parentheses
- Multiple journals should be connected with OR operators
- URL should contain the encoded query

### Testing Validation:

- Verify author search works correctly
- Check that journal ISSNs are formatted correctly with quotes
- Ensure multiple journals are combined with OR operators
- Verify parentheses are correctly placed around the journal group
- Confirm the author and journal group are combined with an implicit AND
- Click "Search Google Scholar" and verify you're redirected to Google Scholar with the correct query

---

## Testing Checklist

| Example | Query Formation | Parentheses | Operators | Field Prefixes | Quoting | URL Encoding |
| ------- | --------------- | ----------- | --------- | -------------- | ------- | ------------ |
| #1      | □               | □           | □         | □              | □       | □            |
| #2      | □               | □           | □         | □              | □       | □            |
| #3      | □               | □           | □         | □              | □       | □            |
| #4      | □               | □           | □         | □              | □       | □            |

Additional validation:

- □ Copy the URL and paste into a new browser tab to verify it works
- □ Try modifying terms and verify query updates correctly
- □ Test adding more blocks to each example
- □ Verify that field-specific formatting is applied consistently

Once all tests have been completed and are passing, the implementation can be considered successful.
