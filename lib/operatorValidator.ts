/**
 * Operator Validation Module
 * Handles validation of search block operator configurations
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

  // Rule 4: EXCLUDE cannot have direction
  if (block.operator === "EXCLUDE" && block.operatorDirection) {
    return {
      valid: false,
      message: "Excluded (NOT) blocks do not use directional logic.",
    };
  }

  // Rule 5: Last block cannot use "with next"
  if (
    blockIndex === allBlocks.length - 1 &&
    block.operatorDirection === "next"
  ) {
    return {
      valid: false,
      message: 'Last block cannot use "with next" operator.',
    };
  }

  // Rule 6: First block cannot use "with previous"
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
