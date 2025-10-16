"use client";

import React from "react";
import { SearchBlockComponentPhase2 } from "@/components/search/SearchBlockComponentPhase2";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import type { SearchBlock, SearchField } from "@/types/search";

interface SearchBlocksContainerProps {
  blocks: SearchBlock[];
  fields: SearchField[];
  onBlockChange: (index: number, block: SearchBlock) => void;
  onBlockRemove: (index: number) => void;
  onAddBlock: () => void;
}

export function SearchBlocksContainerUnified({
  blocks,
  fields,
  onBlockChange,
  onBlockRemove,
  onAddBlock,
}: SearchBlocksContainerProps) {
  return (
    <div className="space-y-4">
      <div className="border border-gray-200 rounded-lg bg-white overflow-hidden shadow-sm">
        {blocks.length === 0 ? (
          <div className="p-12 text-center">
            <p className="text-gray-500 mb-4">
              No search blocks yet. Add one to get started.
            </p>
            <Button onClick={onAddBlock} variant="outline" size="sm">
              <Plus className="w-4 h-4 mr-2" />
              Add Search Block
            </Button>
          </div>
        ) : (
          blocks.map((block, index) => (
            <div
              key={block.id}
              className={index > 0 ? "border-t border-gray-100" : ""}
            >
              <div className="p-4 hover:bg-gray-50 transition-colors">
                <SearchBlockComponentPhase2
                  block={block}
                  blockIndex={index}
                  totalBlocks={blocks.length}
                  fields={fields}
                  onBlockChange={(updated: SearchBlock) =>
                    onBlockChange(index, updated)
                  }
                  onBlockRemove={() => onBlockRemove(index)}
                />
              </div>
            </div>
          ))
        )}
      </div>

      {blocks.length > 0 && (
        <Button
          onClick={onAddBlock}
          variant="outline"
          size="sm"
          className="w-full"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Another Search
        </Button>
      )}
    </div>
  );
}
