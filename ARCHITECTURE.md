# SO-ARM Scratch - Technical Architecture

## Overview

The SO-ARM Scratch programming interface is a comprehensive web-based application that allows children to program the SO-ARM101 robot using a visual block-based programming language similar to MIT's Scratch. The system combines 3D visualization, intuitive drag-and-drop programming, and real-time robot control.

## System Architecture

### Frontend Components

#### 1. Main Application (`app/page.tsx`)
- **Purpose**: Main application container and state management
- **Key Features**:
  - Manages robot connection status
  - Coordinates between 3D visualization and programming interface
  - Handles program execution
  - Provides help system and examples

#### 2. 3D Robot Scene (`components/RobotScene.tsx`)
- **Purpose**: 3D visualization of the robot
- **Technology**: React Three Fiber, Three.js, React Three Drei
- **Features**:
  - Loads URDF robot models
  - Fallback to simplified robot representation
  - Interactive camera controls
  - Real-time animation during program execution
  - Environment lighting and grid

#### 3. Visual Programming Interface (`components/ScratchProgramming.tsx`)
- **Purpose**: Block-based programming environment
- **Features**:
  - Drag-and-drop block interface
  - Block palette with different command types
  - Program execution controls
  - Parameter editing panel
  - Import/export functionality

#### 4. Robot Controller (`components/RobotController.tsx`)
- **Purpose**: Communication with physical robot
- **Technology**: Web Serial API
- **Features**:
  - Serial port connection management
  - Command protocol implementation
  - Program execution engine
  - Emergency stop functionality
  - Real-time robot animation

#### 5. Educational Components
- **Help System** (`components/Help.tsx`): Interactive help and tutorials
- **Example Programs** (`components/ExamplePrograms.tsx`): Pre-built example programs
- **Onboarding** (`components/Onboarding.tsx`): First-time user tutorial
- **Simple Robot** (`components/SimpleRobot.tsx`): 3D fallback robot model

### Technology Stack

#### Core Framework
- **Next.js 15**: React-based full-stack framework
- **React 19**: Component-based UI library
- **TypeScript**: Type-safe JavaScript
- **Tailwind CSS**: Utility-first CSS framework

#### 3D Graphics
- **Three.js**: 3D graphics library
- **React Three Fiber**: React bindings for Three.js
- **React Three Drei**: Additional Three.js helpers
- **URDF Loader**: Robot model loading (optional)

#### Robot Communication
- **Web Serial API**: Direct browser-to-robot communication
- **Feetech.js**: Servo motor control library

#### Build Tools
- **Bun**: Fast JavaScript runtime and package manager
- **Turbopack**: Fast bundler for development

## Data Flow

### 1. Program Creation
```
User Input → Block Addition → Program Array → State Update → UI Refresh
```

### 2. Program Execution
```
Program Array → Command Translation → Serial Communication → Robot Movement
                ↓
3D Animation ← Command Interpretation ← Real-time Feedback
```

### 3. Robot Visualization
```
URDF File → 3D Model Loading → Scene Rendering → Animation Updates
    ↓
Fallback → Simple Robot Model → Basic Visualization
```

## Block Programming System

### Block Types

#### 1. Move Joint Block
- **Purpose**: Control individual robot joints
- **Parameters**: Joint number (1-6), Target angle (0-180°)
- **Command**: `MOVE_JOINT <joint> <angle>`

#### 2. Rotate Base Block
- **Purpose**: Rotate the entire robot base
- **Parameters**: Rotation angle (-180° to 180°)
- **Command**: `ROTATE_BASE <angle>`

#### 3. Wait Block
- **Purpose**: Add delays between movements
- **Parameters**: Duration in seconds
- **Implementation**: JavaScript setTimeout

#### 4. Repeat Block
- **Purpose**: Loop sequences of commands
- **Parameters**: Number of iterations
- **Implementation**: Program flow control

### Block Execution Engine

The execution engine processes blocks sequentially:

1. **Parse Block**: Extract type and parameters
2. **Generate Command**: Convert to robot protocol
3. **Send Command**: Transmit via Serial API
4. **Animate 3D**: Update visualization
5. **Wait for Completion**: Ensure timing
6. **Next Block**: Continue to next instruction

## Communication Protocol

### Serial Configuration
- **Baud Rate**: 115200
- **Data Bits**: 8
- **Stop Bits**: 1
- **Parity**: None

### Command Format
```
MOVE_JOINT <joint_number> <angle>\n
ROTATE_BASE <angle>\n
STOP\n
```

### Error Handling
- Connection failure detection
- Command timeout management
- Emergency stop implementation
- Graceful degradation

## File Structure

```
so-arm-scratch/
├── app/
│   ├── page.tsx              # Main application
│   ├── layout.tsx            # App layout
│   └── globals.css           # Global styles
├── components/
│   ├── RobotScene.tsx        # 3D visualization
│   ├── SimpleRobot.tsx       # Fallback robot model
│   ├── ScratchProgramming.tsx # Block programming
│   ├── RobotController.tsx   # Robot communication
│   ├── ExamplePrograms.tsx   # Example programs
│   ├── Help.tsx              # Help system
│   └── Onboarding.tsx        # User tutorial
├── public/
│   ├── so101.urdf            # Robot model
│   ├── assets/               # Robot meshes
│   ├── examples/             # Example programs
│   └── instructions_for_kids.md
├── lib/
│   └── utils.ts              # Utility functions
└── README.md
```

## Safety Features

### Software Safety
- **Emergency Stop**: Immediate program termination
- **Connection Monitoring**: Real-time status checking
- **Parameter Validation**: Input range checking
- **Execution Timeouts**: Prevent infinite operations

### Educational Safety
- **Guided Tutorial**: Step-by-step introduction
- **Example Programs**: Safe, tested sequences
- **Help System**: Comprehensive documentation
- **Visual Feedback**: Clear status indicators

## Extensibility

### Adding New Block Types
1. Define block in `BLOCK_TYPES` constant
2. Add execution logic in `executeBlock` function
3. Implement 3D animation in `animateRobotForBlock`
4. Update UI components as needed

### Supporting Different Robots
1. Replace URDF file with new robot model
2. Update communication protocol
3. Modify joint configuration
4. Adjust 3D animation mappings

### Deployment Considerations

#### Browser Requirements
- Chrome 89+ or Edge 89+ (for Web Serial API)
- WebGL support for 3D graphics
- Modern JavaScript features

#### Robot Requirements
- USB/Serial connection capability
- Compatible command protocol
- Appropriate safety mechanisms

#### Security Considerations
- HTTPS required for Web Serial API
- User permission for device access
- Safe command validation
- Rate limiting for robot commands

## Performance Optimizations

### 3D Rendering
- Efficient Three.js scene management
- LOD (Level of Detail) for complex models
- Optimized animation loops
- Resource cleanup

### Programming Interface
- Virtual scrolling for large programs
- Debounced parameter updates
- Optimized drag-and-drop
- Efficient state management

### Communication
- Command queuing system
- Connection pooling
- Error recovery mechanisms
- Bandwidth optimization

This architecture provides a robust, extensible, and educational platform for robot programming that grows with the user's skills while maintaining safety and ease of use.
