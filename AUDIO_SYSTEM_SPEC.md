# Enhanced Audio Reaction System Specification

## 1. Audio Analysis System

### 1.1 Audio Sources
```javascript
class AudioSystem {
    constructor() {
        this.sources = {
            music: new AudioSource(),
            voice: new AudioSource(),
            ambient: new AudioSource()
        }
        this.currentMode = 'music' // music | voice | hybrid
    }
}
```

### 1.2 Frequency Analysis
```javascript
class FrequencyAnalyzer {
    constructor() {
        this.bands = {
            sub: [20, 60],     // Sub-bass
            bass: [60, 250],   // Bass
            low: [250, 500],   // Low mids
            mid: [500, 2000],  // Mids
            high: [2000, 4000], // High mids
            presence: [4000, 6000], // Presence
            brilliance: [6000, 20000] // Brilliance
        }
        
        this.smoothing = {
            music: 0.8,  // Slower smoothing for music
            voice: 0.3   // Faster response for voice
        }
    }
}
```

## 2. Particle Behavior Mapping

### 2.1 Music Mode Behaviors
```javascript
const musicBehaviors = {
    bass: {
        scale: [1.0, 2.5],
        speed: [0.5, 1.5],
        emission: [10, 50],
        color: {
            hue: [0.1, 0.3],
            saturation: [0.8, 1.0]
        }
    },
    mids: {
        rotation: [-Math.PI/4, Math.PI/4],
        dispersion: [0.1, 0.8],
        turbulence: [0.2, 0.6]
    },
    highs: {
        brightness: [0.5, 1.0],
        sparkle: [0, 1.0],
        velocity: [1.0, 2.0]
    }
}
```

### 2.2 Voice Mode Behaviors
```javascript
const voiceBehaviors = {
    amplitude: {
        scale: [0.8, 1.5],
        emission: [5, 25],
        color: {
            hue: [0.5, 0.7],
            saturation: [0.6, 0.9]
        }
    },
    frequency: {
        shape: ['sphere', 'spiral', 'fountain'],
        dispersion: [0.05, 0.4],
        turbulence: [0.1, 0.3]
    }
}
```

## 3. State-Based Reactions

### 3.1 Emotional States
```javascript
const emotionalStates = {
    calm: {
        colorRange: ['#2E5BFF', '#31CAFF'],
        movementSpeed: 0.5,
        particleSize: 0.8,
        emissionRate: 0.6
    },
    energetic: {
        colorRange: ['#FF3F3F', '#FFB13F'],
        movementSpeed: 1.5,
        particleSize: 1.2,
        emissionRate: 1.2
    },
    ethereal: {
        colorRange: ['#9D3FFF', '#FF3FD5'],
        movementSpeed: 0.7,
        particleSize: 1.0,
        emissionRate: 0.8
    }
}
```

### 3.2 Transition System
```javascript
class StateTransition {
    constructor() {
        this.blendFactors = {
            color: 0,
            movement: 0,
            size: 0,
            emission: 0
        }
        this.transitionSpeed = 0.05
    }

    blend(currentState, targetState, factor) {
        // Smooth interpolation between states
    }
}
```

## 4. Shader Integration

### 4.1 Audio Uniforms
```glsl
uniform struct AudioData {
    float bassIntensity;
    float midIntensity;
    float highIntensity;
    float amplitude;
    float frequency;
    vec2 waveform[128];
} uAudio;

uniform struct StateData {
    vec3 baseColor;
    vec3 targetColor;
    float blendFactor;
    float emotionalState;
    float transitionProgress;
} uState;
```

### 4.2 Behavior Functions
```glsl
vec3 calculatePosition(vec3 basePos, AudioData audio, StateData state) {
    // Position modification based on audio and state
    vec3 audioOffset = /* audio reactive movement */;
    vec3 stateOffset = /* state-based movement */;
    return basePos + mix(audioOffset, stateOffset, state.blendFactor);
}

vec3 calculateColor(vec3 baseColor, AudioData audio, StateData state) {
    // Color modification based on audio and state
    vec3 audioColor = /* frequency-based color */;
    vec3 stateColor = /* emotional state color */;
    return mix(audioColor, stateColor, state.blendFactor);
}
```

## 5. Performance Optimizations

### 5.1 Audio Processing
```javascript
class AudioOptimizer {
    constructor() {
        this.analysisInterval = 1000 / 60  // 60fps analysis
        this.downsampleFactor = 2          // Reduce sample rate
        this.smoothingBufferSize = 8       // Rolling average buffer
    }

    processFrame(audioData) {
        // Efficient audio processing
        // Downsampling for performance
        // Smooth transitions
    }
}
```

### 5.2 State Management
```javascript
class StateManager {
    constructor() {
        this.updatePriority = {
            position: 1,    // Update every frame
            color: 2,       // Update every 2 frames
            emission: 3,    // Update every 3 frames
            transition: 1   // Update every frame
        }
    }
}
```

## 6. Implementation Phases

### Phase 1: Audio Analysis
1. Set up multi-source audio input
2. Implement frequency analysis
3. Add voice detection
4. Create smooth transitions

### Phase 2: Behavior System
1. Implement basic behaviors
2. Add state management
3. Create transition system
4. Test different modes

### Phase 3: Shader Integration
1. Add audio uniforms
2. Implement behavior functions
3. Create state blending
4. Optimize performance

### Phase 4: UI Controls
1. Add mode switching
2. Create sensitivity controls
3. Implement state selection
4. Add visualization debug mode

## 7. Testing Strategy

### 7.1 Audio Response Tests
- Frequency response accuracy
- Transition smoothness
- Mode switching reliability
- Performance under load

### 7.2 Visual Verification
- Color transitions
- Movement patterns
- Particle behavior
- State blending

### 7.3 Performance Metrics
- Audio processing overhead
- Shader performance
- Memory usage
- Frame rate stability
