"use client";
import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  ReactNode,
} from "react";
import type { BlockDefinition, BlockInstance } from "@/lib/types";
import { parseBlocksForCommands } from "@/lib/utils";
import type { UpdateJointsDegrees } from "@/hooks/useRobotControl";

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

type ScratchProviderProps = {
  children: ReactNode;
  updateJointsDegrees?: UpdateJointsDegrees;
  homeRobot?: () => Promise<void>;
  isConnected?: boolean;
};

export function ScratchProvider({
  children,
  updateJointsDegrees,
  homeRobot,
  isConnected = false,
}: ScratchProviderProps) {
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

  const handleRunCode = useCallback(async () => {
    if (blocks.length === 0) {
      alert("Please add blocks to run the code.");
      return;
    }

    if (!updateJointsDegrees) {
      alert("Robot control functions not available.");
      return;
    }

    setIsRunningCode(true);
    setTimeout(() => {}, 2_000); // Simulate loading delay
    try {
      console.log("Running code...");
      console.log("Blocks:", blocks);
      console.log(
        "UpdateJointsDegrees function available:",
        !!updateJointsDegrees
      );

      // Execute blocks in sequence
      for (const block of blocks) {
        if (block.definitionId === "home_robot" && homeRobot) {
          console.log("Executing home command...");
          await homeRobot();
          console.log("Home command executed successfully!");
        } else {
          // Handle regular movement blocks
          const commands = parseBlocksForCommands([block]);
          if (commands.length > 0) {
            if (isConnected) {
              console.log("Executing command on physical robot...");
            } else {
              console.log("Executing command on virtual robot only...");
            }
            await updateJointsDegrees(commands);
            console.log("Command executed successfully!");
          }
        }

        // Add a small delay between commands for better visualization
        await new Promise((resolve) => setTimeout(resolve, 500));
      }

      setIsRunningCode(false);
    } catch (error) {
      console.error("Error running code:", error);
      alert("Error running code – see console for details.");
      setIsRunningCode(false);
    }
  }, [blocks, updateJointsDegrees, homeRobot, isConnected]);

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
