type CameraSettings = {
  position: [number, number, number];
  fov: number;
};

type CompoundMovement = {
  name: string;
  // keys: string[]; // keys that trigger this movement
  primaryJoint: number; // the joint controlled by the key
  // Optional formula for calculating deltaPrimary, can use primary, dependent, etc.
  primaryFormula?: string;
  dependents: {
    joint: number;
    // The formula is used to calculate the delta for the dependent joint (deltaDependent)
    // It can use variables: primary, dependent, deltaPrimary
    // deltaPrimary itself can depend on primary and dependent angles
    // Example: "deltaPrimary * 0.8 + primary * 0.1 - dependent * 0.05"
    formula: string;
  }[];
};

// Define combined robot configuration type
export type RobotConfig = {
  urdfUrl: string;
  camera: CameraSettings;
  orbitTarget: [number, number, number];
  keyboardControlMap?: {
    [key: string]: string[];
  };
  jointNameIdMap?: {
    [key: string]: number;
  };
  urdfInitJointAngles?: {
    [key: string]: number;
  };
  compoundMovements?: CompoundMovement[];
};

// Define configuration map per slug
export const robotConfigMap: { [key: string]: RobotConfig } = {
  "so-arm101": {
    urdfUrl: "/assets/urdf/so101.urdf",
    camera: { position: [-30, 10, 30], fov: 12 },
    orbitTarget: [1, 2, 0],
    // keyboardControlMap: {
    //   1: ["1", "q"],
    //   2: ["2", "w"],
    //   3: ["3", "e"],
    //   4: ["4", "r"],
    //   5: ["5", "t"],
    //   6: ["6", "y"],
    // },
    // map between joint names in URDF and servo IDs
    jointNameIdMap: {
      Rotation: 1,
      Pitch: 2,
      Elbow: 3,
      Wrist_Pitch: 4,
      Wrist_Roll: 5,
      Jaw: 6,
    },
    urdfInitJointAngles: {
      Rotation: 180,
      Pitch: 90,
      Elbow: 360,
      Wrist_Pitch: 180,
      Wrist_Roll: 180,
      Jaw: 180,
    },
    compoundMovements: [
      // Jaw compound movements
      {
        name: "Jaw down & up",
        // keys: ["8", "i"],
        primaryJoint: 2,
        primaryFormula: "primary < 100 ? 1 : -1", // Example: sign depends on primary and dependent
        dependents: [
          {
            joint: 3,
            formula: "primary < 100 ? -1.9 * deltaPrimary : 0.4 * deltaPrimary",
            // formula: "- deltaPrimary * (0.13 * Math.sin(primary * (Math.PI / 180)) + 0.13 * Math.sin((primary-dependent) * (Math.PI / 180)))/(0.13 * Math.sin((primary - dependent) * (Math.PI / 180)))",
          },
          {
            joint: 4,
            formula:
              "primary < 100 ? (primary < 10 ? 0 : 0.51 * deltaPrimary) : -0.4 * deltaPrimary",
          },
        ],
      },
      {
        name: "Jaw backward & forward",
        // keys: ["o", "u"],
        primaryJoint: 2,
        primaryFormula: "1",
        dependents: [
          {
            joint: 3,
            formula: "-0.9* deltaPrimary",
          },
        ],
      },
    ],
  },
};
