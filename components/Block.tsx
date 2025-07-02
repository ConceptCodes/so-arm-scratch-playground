"use client";

import type React from "react";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { X, Plus } from "lucide-react";
import type { BlockDefinition, BlockInstance } from "@/lib/types";
import { BlockParameterEditor } from "./BlockParameterEditor";

interface BlockProps {
  definition: BlockDefinition;
  instance?: BlockInstance;
  isInPalette?: boolean;
  onParameterChange?: (
    parameterId: string,
    value: boolean | number | string
  ) => void;
  onRemove?: () => void;
  onAddChildBlock?: (parentId: string) => void;
  renderChildBlocks?: () => React.ReactNode;
  className?: string;
}

export function Block({
  definition,
  instance,
  isInPalette = false,
  onParameterChange,
  onRemove,
  onAddChildBlock,
  renderChildBlocks,
  className = "",
}: BlockProps) {
  const isControlBlock =
    definition.category === "control" &&
    (definition.id === "repeat" || definition.id === "if_condition");

  const getShapeStyles = () => {
    const baseStyles = "relative select-none transition-all duration-200";

    switch (definition.shape) {
      case "command":
        return `${baseStyles} rounded-lg`;
      case "reporter":
        return `${baseStyles} rounded-full px-4`;
      case "boolean":
        return `${baseStyles} rounded-lg`;
      case "hat":
        return `${baseStyles} rounded-t-lg`;
      case "cap":
        return `${baseStyles} rounded-b-lg`;
      default:
        return `${baseStyles} rounded-lg`;
    }
  };

  const renderConnectionPoints = () => {
    if (isInPalette) return null;

    return (
      <>
        {/* Top connection notch for command blocks (where other blocks connect above) */}
        {(definition.shape === "command" || definition.shape === "cap") && (
          <div
            className="absolute -top-2 left-4 w-6 h-4 bg-white/30 rounded-b-md border-2 border-white/50"
            style={{ clipPath: "polygon(20% 0%, 80% 0%, 100% 100%, 0% 100%)" }}
          />
        )}

        {/* Bottom connection tab for command blocks (connects to blocks below) */}
        {(definition.shape === "command" || definition.shape === "hat") &&
          !isControlBlock && (
            <div
              className="absolute -bottom-2 left-4 w-6 h-4 rounded-t-md border-2 border-current"
              style={{
                backgroundColor: definition.color,
                clipPath: "polygon(0% 0%, 100% 0%, 80% 100%, 20% 100%)",
              }}
            />
          )}
      </>
    );
  };

  const renderParameters = () => {
    if (!definition.parameters.length) return null;

    return (
      <div className="flex items-center gap-1 flex-wrap">
        {definition.parameters.map((param, index) => (
          <div key={param.name} className="flex items-center gap-1">
            {index > 0 && (
              <span className="text-gray-800 text-xs">{param.name}</span>
            )}
            {!isInPalette && instance && (
              <BlockParameterEditor
                parameter={param}
                value={instance.parameters[param.name]}
                onChange={(value) => onParameterChange?.(param.name, value)}
              />
            )}
            {isInPalette && (
              <span className="bg-white/20 px-2 py-1 rounded text-xs">
                {param.defaultValue?.toString() || param.name}
              </span>
            )}
          </div>
        ))}
      </div>
    );
  };

  const renderControlBlockStructure = () => {
    if (!isControlBlock || isInPalette) {
      return (
        <div className="p-3 text-white relative">
          {renderConnectionPoints()}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 flex-wrap flex-1 min-w-0">
              {definition.icon && (
                <span className="text-sm flex-shrink-0">{definition.icon}</span>
              )}
              <span className="font-medium text-sm flex-shrink-0">
                {definition.name}
              </span>
              {renderParameters()}
            </div>

            {!isInPalette && onRemove && (
              <Button
                size="sm"
                variant="ghost"
                onClick={(e) => {
                  e.stopPropagation();
                  onRemove();
                }}
                className="h-6 w-6 p-0 text-white hover:bg-white/20 flex-shrink-0 ml-2"
                title="Remove block"
              >
                <X className="h-3 w-3" />
              </Button>
            )}
          </div>
        </div>
      );
    }

    // Control block with child area
    return (
      <div className="text-white relative">
        {renderConnectionPoints()}

        {/* Header */}
        <div className="p-3 pb-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 flex-wrap flex-1 min-w-0">
              {definition.icon && (
                <span className="text-sm flex-shrink-0">{definition.icon}</span>
              )}
              <span className="font-medium text-sm flex-shrink-0">
                {definition.name}
              </span>
              {renderParameters()}
            </div>

            {onRemove && (
              <Button
                size="sm"
                variant="ghost"
                onClick={(e) => {
                  e.stopPropagation();
                  onRemove();
                }}
                className="h-6 w-6 p-0 text-white hover:bg-white/20 flex-shrink-0 ml-2"
                title="Remove block"
              >
                <X className="h-3 w-3" />
              </Button>
            )}
          </div>
        </div>

        {/* Child blocks area */}
        <div className="mx-3 mb-3">
          <div
            className="bg-black/10 rounded-lg border-2 border-dashed border-white/30 min-h-12"
            style={{ marginLeft: "20px" }}
          >
            {renderChildBlocks && renderChildBlocks()}

            {/* Add child block button */}
            {!renderChildBlocks && instance && onAddChildBlock && (
              <div className="p-3 flex items-center justify-center">
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => onAddChildBlock(instance.id)}
                  className="text-white/70 hover:text-white hover:bg-white/10 text-xs"
                >
                  <Plus className="h-3 w-3 mr-1" />
                  Add blocks here
                </Button>
              </div>
            )}
          </div>
        </div>

        {/* Bottom connection for control blocks */}
        <div
          className="absolute -bottom-2 left-4 w-6 h-4 rounded-t-md border-2 border-current"
          style={{
            backgroundColor: definition.color,
            clipPath: "polygon(0% 0%, 100% 0%, 80% 100%, 20% 100%)",
          }}
        />
      </div>
    );
  };

  return (
    <div className="flex items-start gap-2 w-full">
      <Card
        className={`
          ${getShapeStyles()}
          ${isInPalette ? "cursor-pointer hover:scale-105" : "cursor-default"}
          border-0 shadow-md w-full
          ${className}
        `}
        style={{
          backgroundColor: definition.color,
        }}
      >
        {renderControlBlockStructure()}
      </Card>
    </div>
  );
}
