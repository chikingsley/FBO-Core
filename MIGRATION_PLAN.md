# FBO-Core Migration Plan

## Overview
This document outlines the plan to enhance FBO-Core with The Spirit's advanced rendering techniques while maintaining and expanding our unique audio-reactive and behavioral systems.

## 1. Core Rendering System Upgrade

### 1.1 Multi-Pass Rendering Pipeline
**Reference Files:**
- `Untitled/src/glsl/particlesDepth.frag`
- `Untitled/src/glsl/particlesDistance.frag`
- `Untitled/src/glsl/particlesMotion.vert`

**Implementation Steps:**
1. Create new shader passes:
   ```
   src/Experience/Shaders/
   ├── Core/
   │   ├── depth.frag
   │   ├── distance.frag
   │   ├── motion.vert
   │   └── shadow.frag
   ```
2. Implement FBO ping-pong system for multiple passes
3. Add uniform support for shadow mapping and motion blur

### 1.2 Particle System Enhancement
**Reference Files:**
- `Untitled/src/glsl/triangles.vert`
- `Untitled/src/glsl/position.frag`

**Implementation Steps:**
1. Add triangle-based particle support:
   ```
   src/Experience/Shaders/Particles/
   ├── triangles.vert
   ├── triangles.frag
   └── triangleAttributes.js  // For handling triangle-specific attributes
   ```
2. Implement dual particle system (points + triangles)
3. Add particle type switching based on audio intensity

## 2. Advanced Visual Effects

### 2.1 Shape Morphing System
**New Components:**
```
src/Experience/Systems/
├── Morphing/
│   ├── shapeDefinitions.js
│   ├── morphTransition.frag
│   └── morphController.js
```

**Features:**
- Base shape definitions (sphere, cube, custom)
- Smooth transition between shapes
- Audio-reactive morphing speed
- Force field influence on morphing

### 2.2 Comet System
**Reference Files:**
- `Untitled/src/glsl/position.frag` (for curl noise)

**New Implementation:**
```
src/Experience/Systems/
├── Comets/
│   ├── cometSimulation.frag
│   ├── cometRender.vert
│   ├── cometRender.frag
│   └── cometController.js
```

**Features:**
- Main comet with particle trail
- Secondary mini-comets
- Mouse/audio-reactive behavior
- Curl noise-based motion

### 2.3 Wraith Evolution System
**New Components:**
```
src/Experience/Systems/
├── Wraith/
│   ├── wraithStates.js
│   ├── wraithSimulation.frag
│   ├── wraithRender.frag
│   └── stateController.js
```

**Features:**
- Multiple emotional states (calm, angry, split)
- Color transitions (base → red → black)
- Particle splitting behavior
- Audio-reactive intensity

## 3. Behavioral Systems

### 3.1 AI State Machine
```
src/Experience/AI/
├── states/
│   ├── baseState.js
│   ├── aggressiveState.js
│   ├── calmState.js
│   └── splitState.js
├── transitions/
│   ├── transitionManager.js
│   └── stateBlender.js
└── behaviors/
    ├── particleBehavior.js
    ├── audioBehavior.js
    └── userInteractionBehavior.js
```

### 3.2 Audio Reaction System
**Enhanced Implementation:**
```
src/Experience/Audio/
├── analyzers/
│   ├── musicAnalyzer.js
│   ├── voiceAnalyzer.js
│   └── environmentAnalyzer.js
├── reactions/
│   ├── particleReaction.js
│   ├── colorReaction.js
│   └── shapeReaction.js
└── modes/
    ├── fullReactive.js
    └── ambientReactive.js
```

## 4. Implementation Phases

### Phase 1: Core Rendering
1. Implement multi-pass rendering system
2. Add triangle particle support
3. Set up basic shadow and motion blur

### Phase 2: Visual Effects
1. Implement shape morphing system
2. Add comet system
3. Develop wraith evolution system

### Phase 3: Behavioral Systems
1. Create AI state machine
2. Enhance audio reaction system
3. Implement state transitions

### Phase 4: Integration
1. Combine all systems
2. Add user controls
3. Optimize performance

## 5. Technical Considerations

### 5.1 Shader Uniforms
```glsl
// Core uniforms
uniform float time;
uniform float audioIntensity;
uniform vec3 mousePosition;
uniform float stateBlend;

// Audio uniforms
uniform float bassIntensity;
uniform float midIntensity;
uniform float trebleIntensity;
uniform float voiceIntensity;

// Behavior uniforms
uniform float aggressionLevel;
uniform float calmLevel;
uniform float splitFactor;
```

### 5.2 Performance Optimizations
1. Use instanced rendering for particles
2. Implement LOD system for particle counts
3. Optimize shader complexity based on device capability
4. Use texture compression for position data

## 6. Controls and Interaction

### 6.1 User Interface
```
src/components/ui/
├── AudioControls/
│   ├── ModeSelector.jsx
│   └── SensitivityControls.jsx
├── BehaviorControls/
│   ├── StateSelector.jsx
│   └── IntensitySlider.jsx
└── EffectControls/
    ├── CometController.jsx
    └── MorphingControls.jsx
```

### 6.2 Interaction Modes
1. **Automatic Mode**
   - AI-driven behavior
   - Music-reactive transitions
   - Ambient movement

2. **Interactive Mode**
   - Mouse-following comets
   - Voice-reactive particles
   - User-triggered state changes

## 7. Future Considerations
1. WebGPU support for better performance
2. VR/AR integration
3. Multi-user interaction
4. Custom shape importing
5. Real-time behavior training

This migration plan provides a structured approach to combining The Spirit's advanced rendering techniques with our existing systems while adding new features and capabilities.
