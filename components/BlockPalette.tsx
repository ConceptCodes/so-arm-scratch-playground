"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { useState, useRef, useCallback, useEffect } from "react";

import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";
import { Block } from "./Block";

import type { BlockDefinition, BlockCategory } from "@/lib/types";

interface BlockPaletteProps {
  categories: BlockCategory[];
  blocks: BlockDefinition[];
  onBlockClick: (definition: BlockDefinition) => void;
}

export function BlockPalette({
  categories,
  blocks,
  onBlockClick,
}: BlockPaletteProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [width, setWidth] = useState(320);
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const getBlocksByCategory = (categoryId: string) => {
    return blocks.filter((block) => block.category === categoryId);
  };

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      if (!isDragging || !containerRef.current) return;

      const containerRect = containerRef.current.getBoundingClientRect();
      const newWidth = e.clientX - containerRect.left;

      // Constrain width between 200px and 500px (reduced max width)
      const constrainedWidth = Math.max(200, Math.min(500, newWidth));
      setWidth(constrainedWidth);
    },
    [isDragging]
  );

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  useEffect(() => {
    if (isDragging) {
      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
      document.body.style.cursor = "col-resize";
      document.body.style.userSelect = "none";

      return () => {
        document.removeEventListener("mousemove", handleMouseMove);
        document.removeEventListener("mouseup", handleMouseUp);
        document.body.style.cursor = "";
        document.body.style.userSelect = "";
      };
    }
  }, [isDragging, handleMouseMove, handleMouseUp]);

  if (isCollapsed) {
    return (
      <div className="w-12 bg-gray-50 border-r border-gray-200 flex flex-col">
        <div className="p-2 border-b border-gray-200">
          <button
            onClick={() => setIsCollapsed(false)}
            className="w-full h-8 p-0 flex items-center justify-center"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>

        <div className="flex-1 flex flex-col gap-2 p-2">
          {categories.map((category) => (
            <div
              key={category.id}
              className="w-8 h-8 rounded flex items-center justify-center text-sm cursor-pointer hover:bg-gray-200"
              style={{ backgroundColor: category.color + "20" }}
              title={category.name}
            >
              {category.icon}
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className="bg-gray-50 border-r border-gray-200 flex flex-col min-w-0 relative h-full"
      style={{ width: `${width}px`, maxWidth: "500px" }}
    >
      <div className="p-4 border-b border-gray-200 flex items-center justify-between">
        <div className="min-w-0 flex-1">
          <h2 className="text-lg font-semibold text-gray-800 truncate">
            Block Palette
          </h2>
          <p className="text-sm text-gray-600 truncate">
            Click blocks to add them to workspace
          </p>
        </div>
        <button
          onClick={() => setIsCollapsed(true)}
          className="ml-2 flex-shrink-0 flex items-center justify-center"
        >
          <ChevronLeft className="h-4 w-4" />
        </button>
      </div>

      <ScrollArea className="flex-1 h-full overflow-y-auto">
        <div className="p-4 space-y-6">
          {categories.map((category) => {
            const categoryBlocks = getBlocksByCategory(category.id);
            if (categoryBlocks.length === 0) return null;

            return (
              <Accordion
                key={category.id}
                type="single"
                collapsible
                defaultValue={category.id}
              >
                <AccordionItem value={category.id}>
                  <AccordionTrigger>
                    <div className="flex items-center gap-2">
                      <span className="text-lg flex-shrink-0">
                        {category.icon}
                      </span>
                      <h3 className="font-medium text-gray-700 truncate">
                        {category.name}
                      </h3>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="space-y-2">
                      {categoryBlocks.map((block) => (
                        <div
                          key={block.id}
                          onClick={() => onBlockClick(block)}
                          className="cursor-pointer hover:scale-105 transition-transform"
                        >
                          <Block definition={block} isInPalette={true} />
                        </div>
                      ))}
                    </div>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            );
          })}
        </div>
      </ScrollArea>

      <div
        className={`absolute top-0 right-0 w-1 h-full bg-gray-200 hover:bg-gray-300 cursor-col-resize flex-shrink-0 ${
          isDragging ? "bg-blue-400" : ""
        }`}
        onMouseDown={handleMouseDown}
      >
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-1 h-8 bg-gray-400 rounded-full opacity-0 hover:opacity-100 transition-opacity" />
      </div>
    </div>
  );
}
