import {
  AlertTriangle,
  Loader2,
  Play,
  RotateCcw,
  Wifi,
  WifiOff,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

import { useScratch } from "@/context/ScratchContext";

type HeaderProps = {
  isConnected: boolean;
  connectRobot: () => void;
  disconnectRobot: () => void;
  emergencyStop: () => void;
};

export const Header = ({
  isConnected,
  connectRobot,
  disconnectRobot,
  emergencyStop,
}: HeaderProps) => {
  const { blocks, handleClear, handleRunCode, isRunningCode } = useScratch();

  return (
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

            <Button
              disabled={!isConnected || !isRunningCode}
              variant="destructive"
              className="flex items-center space-x-2"
              onClick={emergencyStop}
            >
              <AlertTriangle size={16} />
              <span>STOP</span>
            </Button>
            <Button onClick={handleClear} variant="outline" disabled={!blocks.length}>
              <RotateCcw className="h-4 w-4 mr-1" />
              Clear
            </Button>
            <Button
              onClick={handleRunCode}
              disabled={!blocks.length || isRunningCode}
            >
              {isRunningCode ? (
                <span className="animate-spin">
                  <Loader2 className="h-4 w-4 mr-1" />
                </span>
              ) : (
                <Play className="h-4 w-4 mr-1" />
              )}
              Run
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};
