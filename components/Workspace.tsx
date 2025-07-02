"use client";

import { useState } from "react";
import { Plus } from "lucide-react";

import type { BlockInstance, BlockDefinition } from "@/lib/types";
import { Block } from "./Block";
import { ChildBlockSelector } from "./ChildBlockSelector";
import { registry } from "@/lib/blockRegistry";
import { Button } from "@/components/ui/button";

interface WorkspaceProps {
  blocks: BlockInstance[];
  onBlockUpdate: (blockId: string, parameterId: string, value: any) => void;
  onBlockRemove: (blockId: string) => void;
  onAddChildBlock: (parentId: string, definition: BlockDefinition) => void;
}

export function Workspace({
  blocks,
  onBlockUpdate,
  onBlockRemove,
  onAddChildBlock,
}: WorkspaceProps) {
  const [showChildBlockSelector, setShowChildBlockSelector] = useState<{
    parentId: string;
    parentName: string;
  } | null>(null);

  const handleAddChildBlockClick = (parentId: string) => {
    const parentBlock = blocks.find((b) => b.id === parentId);
    const parentDefinition = parentBlock
      ? registry.getBlock(parentBlock.definitionId)
      : null;
    const parentName = parentDefinition?.name || "Block";

    setShowChildBlockSelector({ parentId, parentName });
  };

  const handleChildBlockSelect = (definition: BlockDefinition) => {
    if (showChildBlockSelector) {
      onAddChildBlock(showChildBlockSelector.parentId, definition);
      setShowChildBlockSelector(null);
    }
  };

  const renderChildBlocks = (parentId: string) => {
    const childBlocks = blocks.filter((block) => block.parentId === parentId);

    if (childBlocks.length === 0) {
      return (
        <div className="p-3 flex items-center justify-center">
          <Button
            size="sm"
            variant="ghost"
            onClick={() => handleAddChildBlockClick(parentId)}
            className="text-white/70 hover:text-white hover:bg-white/10 text-xs"
          >
            <Plus className="h-3 w-3 mr-1" />
            Add blocks here
          </Button>
        </div>
      );
    }

    return (
      <div className="p-2 space-y-1">
        {childBlocks.map((childBlock) => {
          const definition = registry.getBlock(childBlock.definitionId);
          if (!definition) return null;

          return (
            <Block
              key={childBlock.id}
              definition={definition}
              instance={childBlock}
              onParameterChange={(parameterId, value) =>
                onBlockUpdate(childBlock.id, parameterId, value)
              }
              onRemove={() => onBlockRemove(childBlock.id)}
              onAddChildBlock={handleAddChildBlockClick}
              renderChildBlocks={
                definition.category === "control"
                  ? () => renderChildBlocks(childBlock.id)
                  : undefined
              }
            />
          );
        })}

        {/* Add more blocks button */}
        <div className="flex justify-center pt-2">
          <Button
            size="sm"
            variant="ghost"
            onClick={() => handleAddChildBlockClick(parentId)}
            className="text-white/50 hover:text-white/70 hover:bg-white/5 text-xs"
          >
            <Plus className="h-3 w-3 mr-1" />
            Add more
          </Button>
        </div>
      </div>
    );
  };

  // Get only top-level blocks (no parent)
  const topLevelBlocks = blocks.filter((block) => !block.parentId);

  return (
    <>
      <div className="flex-1 bg-white relative overflow-auto min-h-full">
        {/* Grid background */}
        <div
          className="absolute inset-0 opacity-5"
          style={{
            backgroundImage: `
              linear-gradient(rgba(0,0,0,0.1) 1px, transparent 1px),
              linear-gradient(90deg, rgba(0,0,0,0.1) 1px, transparent 1px)
            `,
            backgroundSize: "20px 20px",
          }}
        />

        {/* Empty state */}
        {topLevelBlocks.length === 0 && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center text-gray-400">
              <div className="text-6xl mb-4">🧩</div>
              <h3 className="text-xl font-medium mb-2">Start Building</h3>
              <p>Click blocks in the palette to add them here</p>
            </div>
          </div>
        )}

        {/* Blocks - stacked vertically without width constraints */}
        <div className="p-8">
          <div className="flex flex-col gap-1 w-full">
            {topLevelBlocks.map((blockInstance) => {
              const definition = registry.getBlock(blockInstance.definitionId);
              if (!definition) return null;

              const isControlBlock =
                definition.category === "control" &&
                (definition.id === "repeat" ||
                  definition.id === "if_condition");

              return (
                <div key={blockInstance.id} className="relative w-full">
                  <Block
                    definition={definition}
                    instance={blockInstance}
                    onParameterChange={(parameterId, value) =>
                      onBlockUpdate(blockInstance.id, parameterId, value)
                    }
                    onRemove={() => onBlockRemove(blockInstance.id)}
                    onAddChildBlock={handleAddChildBlockClick}
                    renderChildBlocks={
                      isControlBlock
                        ? () => renderChildBlocks(blockInstance.id)
                        : undefined
                    }
                  />
                </div>
              );
            })}
          </div>

          {/* Visual connection line for multiple blocks */}
          {topLevelBlocks.length > 1 && (
            <div
              className="absolute left-12 top-8 w-0.5 bg-gray-300 opacity-50"
              style={{ height: `${topLevelBlocks.length * 80}px` }}
            />
          )}
        </div>
      </div>

      {/* Child Block Selector Modal */}
      {showChildBlockSelector && (
        <ChildBlockSelector
          categories={registry.getAllCategories()}
          blocks={registry.getAllBlocks()}
          onBlockSelect={handleChildBlockSelect}
          onClose={() => setShowChildBlockSelector(null)}
          parentBlockName={showChildBlockSelector.parentName}
        />
      )}
    </>
  );
}
