"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import { Wifi, WifiOff, AlertTriangle } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

import RobotLoader from "@/components/RobotLoader";
import { JointDetails } from "@/components/RobotScene";

import { useRobotControl } from "@/hooks/useRobotControl";
import { robotConfigMap } from "@/lib/robotConfig";
import { registerRobotBlocks } from "@/components/blocks/robotBlocks";

const BlocklyWorkspace = dynamic(
  () => import("react-blockly").then((mod) => mod.BlocklyWorkspace),
  { ssr: false }
);

export default function Home() {
  const [jointDetails, _] = useState<JointDetails[]>([]);
  const [xml, setXml] = useState("");
  const [workspace, setWorkspace] = useState<any>(null);
  const [activeTab, setActiveTab] = useState("blocks");
  const [generatedCode, setGeneratedCode] = useState("");

  // const handleExecuteProgram = (blocks: Block[]) => {
  //   // TODO: Implement block execution logic using robotControl
  //   // For now, do nothing
  // };

  // const handleOnboardingComplete= () => {
  //   setShowOnboarding(false);
  // };

  const config = robotConfigMap["so-arm101"];
  const { urdfInitJointAngles } = config;

  const { connectRobot, isConnected, disconnectRobot } = useRobotControl(
    jointDetails,
    urdfInitJointAngles
  );

  useEffect(() => {
    registerRobotBlocks();
  }, []);

  // Generate code from workspace when switching to code tab
  useEffect(() => {
    if (activeTab === "code" && workspace) {
      // @ts-ignore
      const code = window.Blockly?.JavaScript?.workspaceToCode(workspace) || "";
      setGeneratedCode(code);
    }
  }, [activeTab, workspace]);

  // Optionally, define a toolbox for your blocks
  const toolbox = {
    kind: "flyoutToolbox",
    contents: [
      { kind: "block", type: "move_joint" },
      { kind: "block", type: "open_gripper" },
      { kind: "block", type: "close_gripper" },
      { kind: "block", type: "wait_seconds" },
      { kind: "block", type: "repeat_times" },
    ],
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-4">
              <h1 className="text-2xl font-bold text-gray-900">
                🤖 SO-ARM Scratch
              </h1>
              <span className="text-sm text-gray-500">
                Program your robot with blocks!
              </span>
            </div>

            <div className="flex items-center space-x-4">
              {/* Connection Status */}
              <Badge
                variant={isConnected ? "default" : "secondary"}
                className="flex items-center space-x-2"
              >
                {isConnected ? <Wifi size={16} /> : <WifiOff size={16} />}
                <span>{isConnected ? "Connected" : "Disconnected"}</span>
              </Badge>

              {/* Connection Button */}
              <Button
                onClick={isConnected ? disconnectRobot : connectRobot}
                variant={isConnected ? "destructive" : "default"}
              >
                {isConnected ? "Disconnect" : "Connect Robot"}
              </Button>

              {/* Emergency Stop (not implemented in hook, so disable) */}
              <Button
                disabled
                variant="destructive"
                className="flex items-center space-x-2"
              >
                <AlertTriangle size={16} />
                <span>STOP</span>
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 h-[calc(100vh-140px)] flex flex-col">
        <Tabs
          value={activeTab}
          onValueChange={setActiveTab}
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
          <TabsContent value="blocks" className="flex-1 min-h-0">
            <div className="h-full w-full flex flex-col">
              <Card className="flex-1 flex flex-col overflow-hidden">
                <CardContent className="flex-1 p-0 flex flex-col overflow-hidden">
                  <BlocklyWorkspace
                    toolboxConfiguration={toolbox}
                    initialXml={xml}
                    className="h-full w-full"
                    workspaceConfiguration={{
                      grid: {
                        spacing: 20,
                        length: 3,
                        colour: "#ccc",
                        snap: true,
                      },
                      zoom: {
                        controls: true,
                        wheel: true,
                        startScale: 0.9,
                        maxScale: 2,
                        minScale: 0.3,
                        scaleSpeed: 1.2,
                      },
                    }}
                    onXmlChange={setXml}
                    onWorkspaceChange={setWorkspace}
                  />
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          <TabsContent value="robot" className="flex-1 min-h-0">
            <div className="h-full w-full flex flex-col">
              <Card className="flex-1 flex flex-col overflow-hidden">
                <CardContent className="flex-1 p-0 flex flex-col overflow-hidden">
                  <RobotLoader robotName="so-arm101" />
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>

        {/* Tips for Kids */}
      </main>
    </div>
  );
}
