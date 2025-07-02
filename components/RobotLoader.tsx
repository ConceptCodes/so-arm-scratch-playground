"use client";

import { useEffect, useState, Suspense } from "react";
import * as THREE from "three";
import { Canvas } from "@react-three/fiber";
import { Html, useProgress } from "@react-three/drei";

import { JointDetails, RobotScene } from "./RobotScene";

import { useRobotControl } from "@/hooks/useRobotControl";
import { robotConfigMap } from "@/lib/robotConfig";

type RobotLoaderProps = {
  robotName: string;
};

function Loader() {
  const { progress } = useProgress();
  return (
    <Html center className="text-4xl text-white">
      {progress} % loaded
    </Html>
  );
}

export default function RobotLoader({ robotName }: RobotLoaderProps) {
  const [jointDetails, setJointDetails] = useState<JointDetails[]>([]);
  const config = robotConfigMap[robotName];

  if (!config) {
    throw new Error(`Robot configuration for "${robotName}" not found.`);
  }

  const { urdfUrl, orbitTarget, camera, urdfInitJointAngles } = config;

  const { jointStates, setJointDetails: updateJointDetails } = useRobotControl(
    jointDetails,
    urdfInitJointAngles
  );

  useEffect(() => {
    updateJointDetails(jointDetails);
  }, [jointDetails, updateJointDetails]);

  return (
    <>
      <Canvas
        shadows
        camera={{
          position: camera.position,
          fov: camera.fov,
        }}
        onCreated={({ scene }) => {
          scene.background = new THREE.Color(0x263238);
        }}
      >
        <Suspense fallback={<Loader />}>
          <RobotScene
            robotName={robotName}
            urdfUrl={urdfUrl}
            orbitTarget={orbitTarget}
            setJointDetails={setJointDetails}
            jointStates={jointStates}
          />
        </Suspense>
      </Canvas>
    </>
  );
}
