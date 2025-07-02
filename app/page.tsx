"use client";

import { useEffect, useState } from "react";

import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

import RobotLoader from "@/components/RobotLoader";
import { JointDetails } from "@/components/RobotScene";
import { Header } from "@/components/Header";
import { BlockPalette } from "@/components/BlockPalette";
import { Workspace } from "@/components/Workspace";

import { useRobotControl } from "@/hooks/useRobotControl";
import { robotConfigMap } from "@/lib/robotConfig";
import { registry } from "@/lib/blockRegistry";
import { useScratch } from "@/context/ScratchContext";

import "@/data/defaultBlocks";

export default function Home() {
  const [jointDetails, _] = useState<JointDetails[]>([]);
  const [activeTab, setActiveTab] = useState<"blocks" | "robot">("blocks");
  const {
    blocks,
    handleBlockClick,
    handleBlockUpdate,
    handleBlockRemove,
    handleAddChildBlock,
  } = useScratch();

  const config = robotConfigMap["so-arm101"];
  const { urdfInitJointAngles } = config;

  const { connectRobot, isConnected, disconnectRobot, emergencyStop } =
    useRobotControl(jointDetails, urdfInitJointAngles);

  const { isRunningCode } = useScratch();

  useEffect(() => {
    if (isRunningCode) {
      setActiveTab("robot");
    }
  }, [isRunningCode]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <Header
        isConnected={isConnected}
        connectRobot={connectRobot}
        disconnectRobot={disconnectRobot}
        emergencyStop={emergencyStop}
      />
      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 h-[calc(100vh-140px)] flex">
        <Tabs
          value={activeTab}
          onValueChange={(value: string) =>
            setActiveTab(value as "blocks" | "robot")
          }
          className="flex-1 flex flex-col overflow-hidden"
        >
          <TabsList className="w-full flex mb-2">
            <TabsTrigger value="blocks" className="flex-1">
              Blocks
            </TabsTrigger>
            <TabsTrigger value="robot" className="flex-1">
              Robot
            </TabsTrigger>
          </TabsList>
          <TabsContent value="blocks" className="flex-1 min-h-0 flex">
            <BlockPalette
              categories={registry.getAllCategories()}
              blocks={registry.getAllBlocks()}
              onBlockClick={handleBlockClick}
            />
            <Workspace
              blocks={blocks}
              onBlockUpdate={handleBlockUpdate}
              onBlockRemove={handleBlockRemove}
              onAddChildBlock={handleAddChildBlock}
            />
          </TabsContent>
          <TabsContent value="robot" className="flex-1 min-h-0">
            <RobotLoader robotName="so-arm101" />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
