/**
 * Operator Validation Module
 * Handles validation of search block operator configurations
 *
 * Grouping Rules:
 * - Blocks connected with AND/OR operators chain together in the same parentheses group
 * - You cannot mix AND and OR in the same chain (e.g., "AND_NEXT" followed by "OR_PREV" is invalid)
 * - Empty blocks (no search term) break the chain - they start a new grouping
 * - Does Not Include (EXCLUDE) can only appear at the end of a chain
 */

import type {
  SearchBlockForValidation,
  ValidationResult,
  OperatorType,
  OperatorDirection,
} from "@/types/search";

/**
 * Validate a single search block against all blocks in the query
 */
export function validateSearchBlock(
  block: SearchBlockForValidation,
  blockIndex: number,
  allBlocks: SearchBlockForValidation[]
): ValidationResult {
  // Rule 1: Check if required fields are filled
  if (!block.fieldId || !block.term.trim()) {
    return {
      valid: false,
      message: "Please select a field and enter a search term.",
    };
  }

  // Rule 2: First block shouldn't have operator logic (except EXCLUDE)
  if (blockIndex === 0) {
    if (block.operator && block.operator !== "EXCLUDE") {
      return {
        valid: false,
        message: "First block cannot use AND/OR operators.",
      };
    }
  }

  // Rule 3: Cannot AND/OR with excluded block
  if (block.operator === "AND" || block.operator === "OR") {
    if (block.operatorDirection === "previous" && blockIndex > 0) {
      const previousBlock = allBlocks[blockIndex - 1];
      if (previousBlock && previousBlock.operator === "EXCLUDE") {
        return {
          valid: false,
          message: `Cannot ${block.operator} with previous block because it's excluded (NOT).`,
        };
      }
    }

    if (
      block.operatorDirection === "next" &&
      blockIndex < allBlocks.length - 1
    ) {
      const nextBlock = allBlocks[blockIndex + 1];
      if (nextBlock && nextBlock.operator === "EXCLUDE") {
        return {
          valid: false,
          message: `Cannot ${block.operator} with next block because it's excluded (NOT).`,
        };
      }
    }
  }

  // Rule 4: Validate operator chaining - cannot mix AND and OR in same chain
  // Split into backward and forward checks for complete coverage
  
  // Backward Check: If this block has "previous" direction, verify compatibility with previous block
  if (
    (block.operator === "AND" || block.operator === "OR") &&
    block.operatorDirection === "previous" &&
    blockIndex > 0
  ) {
    const previousBlock = allBlocks[blockIndex - 1];

    if (previousBlock && previousBlock.operator && previousBlock.operatorDirection === "next") {
      // Direct conflict: block's operator differs from previous block's operator
      // Example: AND_NEXT followed by OR_PREV (different operators)
      if (previousBlock.operator !== block.operator) {
        return {
          valid: false,
          message:
            `Invalid operator combination: Cannot use ${block.operator} with previous when the previous block uses ${previousBlock.operator} with next. Operators must match in a chain.`,
          suggestion: `Use "${previousBlock.operator} with previous" to continue the ${previousBlock.operator} chain.`,
        };
      }
    }
  }

  // Forward Check: If this block has "next" direction, verify compatibility with next block
  // NOTE: This check runs for all blocks including block 0 (fixes bug #1)
  if (
    (block.operator === "AND" || block.operator === "OR") &&
    block.operatorDirection === "next" &&
    blockIndex < allBlocks.length - 1
  ) {
    const nextBlock = allBlocks[blockIndex + 1];

    if (nextBlock && nextBlock.operator) {
      // Direct conflict: this block's operator differs from next block's operator  
      // Example: AND_NEXT followed by OR_PREV (different operators forming incompatible pair)
      if (block.operator === "AND" && nextBlock.operator === "OR" && nextBlock.operatorDirection === "previous") {
        return {
          valid: false,
          message:
            "Invalid operator combination: You selected AND with next, but the next block uses OR with previous. Operators must match in a chain.",
          suggestion: 'Change the next block operator to AND, or change this block to "OR with next".',
        };
      }
      if (block.operator === "OR" && nextBlock.operator === "AND" && nextBlock.operatorDirection === "previous") {
        return {
          valid: false,
          message:
            "Invalid operator combination: You selected OR with next, but the next block uses AND with previous. Operators must match in a chain.",
          suggestion: 'Change the next block operator to OR, or change this block to "AND with next".',
        };
      }
      // Allow: AND_NEXT → OR_NEXT (starts new chain, both are "next" so not a direct connection)
      // Allow: OR_NEXT → AND_NEXT (starts new chain, both are "next" so not a direct connection)
      // The next block will validate its own "previous" direction if set
    }
  }

  // Rule 5: EXCLUDE cannot have direction
  if (block.operator === "EXCLUDE" && block.operatorDirection) {
    return {
      valid: false,
      message: "Excluded (NOT) blocks do not use directional logic.",
    };
  }

  // Rule 6: Last block cannot use "with next"
  if (
    blockIndex === allBlocks.length - 1 &&
    block.operatorDirection === "next"
  ) {
    return {
      valid: false,
      message: 'Last block cannot use "with next" operator.',
    };
  }

  // Rule 7: First block cannot use "with previous"
  if (blockIndex === 0 && block.operatorDirection === "previous") {
    return {
      valid: false,
      message: 'First block cannot use "with previous" operator.',
    };
  }

  // All validations passed
  return { valid: true };
}

/**
 * Validate entire query structure
 */
export function validateAllBlocks(
  blocks: SearchBlockForValidation[]
): Map<string, ValidationResult> {
  const errors = new Map<string, ValidationResult>();

  blocks.forEach((block, index) => {
    const validation = validateSearchBlock(block, index, blocks);
    if (!validation.valid) {
      errors.set(block.id, validation);
    }
  });

  return errors;
}

/**
 * Get suggested operator for a block
 */
export function getSuggestedOperator(blockIndex: number): OperatorType | null {
  // First block: no operator needed
  if (blockIndex === 0) {
    return null;
  }

  // Default to AND for subsequent blocks
  return "AND";
}

/**
 * Get available directions for a block
 */
export function getAvailableDirections(
  blockIndex: number,
  totalBlocks: number
): OperatorDirection[] {
  const directions: OperatorDirection[] = [];

  if (blockIndex > 0) {
    directions.push("previous");
  }

  if (blockIndex < totalBlocks - 1) {
    directions.push("next");
  }

  return directions;
}
