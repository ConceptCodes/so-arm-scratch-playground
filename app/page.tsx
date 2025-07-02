"use client";

import { Wifi, WifiOff, AlertTriangle } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

import RobotLoader from "@/components/RobotLoader";

import { useRobotControl } from "@/hooks/useRobotControl";
import { useState } from "react";
import { JointDetails } from "@/components/RobotScene";
import { robotConfigMap } from "@/lib/robotConfig";

export default function Home() {
  const [jointDetails, setJointDetails] = useState<JointDetails[]>([]);

  // const handleExecuteProgram = (blocks: Block[]) => {
  //   // TODO: Implement block execution logic using robotControl
  //   // For now, do nothing
  // };

  // const handleOnboardingComplete = () => {
  //   setShowOnboarding(false);
  // };

  const config = robotConfigMap["so-arm101"];
  const { urdfInitJointAngles } = config;

  const { connectRobot, isConnected, disconnectRobot } = useRobotControl(
    jointDetails,
    urdfInitJointAngles
  );

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
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="h-[calc(100vh-140px)] flex">
          {/* Programming Interface (fixed width) */}
          <div className="w-80 mr-4">
            <Card className="h-full">
             
            </Card>
          </div>
          {/* 3D Robot Scene + Controls (flexible) */}
          <div className="flex-1">
            <RobotLoader robotName="so-arm101" />
          </div>
        </div>

        {/* Tips for Kids */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle className="text-lg text-gray-900">
              🎯 How to Use
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0 w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold">
                  1
                </div>
                <div>
                  <h4 className="font-medium text-gray-900">
                    Connect Your Robot
                  </h4>
                  <p className="text-sm text-gray-600">
                    Click &quot;Connect Robot&quot; and select your SO-ARM101
                    from the list
                  </p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0 w-8 h-8 bg-green-100 rounded-full flex items-center justify-center text-green-600 font-bold">
                  2
                </div>
                <div>
                  <h4 className="font-medium text-gray-900">
                    Build Your Program
                  </h4>
                  <p className="text-sm text-gray-600">
                    Drag and drop blocks from the left panel to create your
                    robot program
                  </p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0 w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center text-purple-600 font-bold">
                  3
                </div>
                <div>
                  <h4 className="font-medium text-gray-900">Run & Watch</h4>
                  <p className="text-sm text-gray-600">
                    Press &quot;Run Program&quot; and watch your robot move on
                    the right!
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
