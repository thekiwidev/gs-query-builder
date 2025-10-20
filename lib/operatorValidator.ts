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
  // Check if this block's operator is compatible with the chain it's joining
  if (
    (block.operator === "AND_PREV" ||
      block.operator === "OR_PREV" ||
      block.operator === "AND_NEXT" ||
      block.operator === "OR_NEXT") &&
    blockIndex > 0
  ) {
    const previousBlock = allBlocks[blockIndex - 1];

    if (previousBlock && previousBlock.operator) {
      // If previous block connects forward (NEXT), verify this block connects backward with same operator type
      if (previousBlock.operator === "AND_NEXT") {
        if (block.operator === "OR_PREV" || block.operator === "OR_NEXT") {
          return {
            valid: false,
            message:
              "Invalid operator combination: Cannot use OR operators when previous block uses AND. You must maintain consistent operators within a chain.",
            suggestion:
              'Use "AND with previous" or "AND with next" to continue the AND chain.',
          };
        }
      } else if (previousBlock.operator === "OR_NEXT") {
        if (block.operator === "AND_PREV" || block.operator === "AND_NEXT") {
          return {
            valid: false,
            message:
              "Invalid operator combination: Cannot use AND operators when previous block uses OR. You must maintain consistent operators within a chain.",
            suggestion:
              'Use "OR with previous" or "OR with next" to continue the OR chain.',
          };
        }
      }

      // Also check if this block has a forward connection (NEXT) but next block has incompatible operator
      if (
        (block.operator === "AND_NEXT" || block.operator === "OR_NEXT") &&
        blockIndex < allBlocks.length - 1
      ) {
        const nextBlock = allBlocks[blockIndex + 1];
        if (nextBlock && nextBlock.operator) {
          if (block.operator === "AND_NEXT") {
            if (
              nextBlock.operator === "OR_PREV" ||
              nextBlock.operator === "OR_NEXT"
            ) {
              return {
                valid: false,
                message:
                  "Invalid operator combination: You selected AND but the next block uses OR. Blocks in the same chain must use the same operator type.",
                suggestion:
                  "Change this block's operator or the next block's operator to maintain consistency.",
              };
            }
          } else if (block.operator === "OR_NEXT") {
            if (
              nextBlock.operator === "AND_PREV" ||
              nextBlock.operator === "AND_NEXT"
            ) {
              return {
                valid: false,
                message:
                  "Invalid operator combination: You selected OR but the next block uses AND. Blocks in the same chain must use the same operator type.",
                suggestion:
                  "Change this block's operator or the next block's operator to maintain consistency.",
              };
            }
          }
        }
      }
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
