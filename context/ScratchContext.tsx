"use client";
import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  ReactNode,
} from "react";
import type { BlockDefinition, BlockInstance } from "@/lib/types";

// Context type
type ScratchContextType = {
  blocks: BlockInstance[];
  setBlocks: React.Dispatch<React.SetStateAction<BlockInstance[]>>;
  generatedCode: string;
  isRunningCode: boolean;
  setGeneratedCode: React.Dispatch<React.SetStateAction<string>>;
  handleBlockClick: (definition: BlockDefinition) => void;
  handleAddChildBlock: (parentId: string, definition: BlockDefinition) => void;
  handleBlockUpdate: (
    id: string,
    param: string,
    value: boolean | number | string
  ) => void;
  handleBlockRemove: (id: string) => void;
  handleRunCode: () => void;
  handleClear: () => void;
};

const ScratchContext = createContext<ScratchContextType | undefined>(undefined);

export function useScratch() {
  const ctx = useContext(ScratchContext);
  if (!ctx) throw new Error("useScratch must be used within a ScratchProvider");
  return ctx;
}

export function ScratchProvider({ children }: { children: ReactNode }) {
  const [blocks, setBlocks] = useState<BlockInstance[]>([]);
  const [generatedCode, setGeneratedCode] = useState("");
  const [isRunningCode, setIsRunningCode] = useState(false);

  const handleBlockClick = useCallback((definition: BlockDefinition) => {
    const newBlock: BlockInstance = {
      id: `block_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      definitionId: definition.id,
      x: 0,
      y: 0,
      parameters: definition.parameters.reduce<
        Record<string, boolean | number | string>
      >((acc, p) => {
        acc[p.name] = p.defaultValue;
        return acc;
      }, {}),
      children: [],
      isSnapped: false,
    };
    setBlocks((prev) => [...prev, newBlock]);
  }, []);

  const handleAddChildBlock = useCallback(
    (parentId: string, definition: BlockDefinition) => {
      const newChild: BlockInstance = {
        id: `block_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        definitionId: definition.id,
        x: 0,
        y: 0,
        parameters: definition.parameters.reduce<
          Record<string, boolean | number | string>
        >((acc, p) => {
          acc[p.name] = p.defaultValue;
          return acc;
        }, {}),
        children: [],
        parentId,
        isSnapped: false,
      };
      setBlocks((prev) => [...prev, newChild]);
    },
    []
  );

  const handleBlockUpdate = useCallback(
    (id: string, param: string, value: boolean | number | string) => {
      setBlocks((prev) =>
        prev.map((b) =>
          b.id === id
            ? { ...b, parameters: { ...b.parameters, [param]: value } }
            : b
        )
      );
    },
    []
  );

  const handleBlockRemove = useCallback((id: string) => {
    setBlocks((prev) => prev.filter((b) => b.id !== id && b.parentId !== id));
  }, []);

  const handleClear = () => {
    setBlocks([]);
    setGeneratedCode("");
  };

  const handleRunCode = useCallback(() => {
    if (blocks.length === 0) {
      alert("Please add blocks to run the code.");
      return;
    }
    setIsRunningCode(true);
    try {
      // Simulate running code
      console.log("Running code...");
      // Here you would send commands to the robot arm based on the blocks
      setTimeout(() => {
        console.log("Code execution completed.");
        setIsRunningCode(false);
      }, 2000); // Simulate async operation
    } catch (error) {
      console.error("Error running code:", error);
      alert("Error running code – see console for details.");
      setIsRunningCode(false);
    }
  }, [blocks]);

  return (
    <ScratchContext.Provider
      value={{
        blocks,
        setBlocks,
        generatedCode,
        setGeneratedCode,
        handleBlockClick,
        handleAddChildBlock,
        handleBlockUpdate,
        handleBlockRemove,
        handleRunCode,
        handleClear,
        isRunningCode,
      }}
    >
      {children}
    </ScratchContext.Provider>
  );
}
