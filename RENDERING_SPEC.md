# Advanced Rendering System Integration Spec

## Current System Analysis
Our current `Page.js` implements:
- Single FBO pass for particle simulation
- Point-based particle rendering
- Basic audio reactivity
- Simple position updates

## 1. Multi-Pass Rendering Pipeline

### 1.1 New FBO Structure
```
simulation → position → depth → shadow → motion → final render
```

### 1.2 Required New Shader Files
```
src/Experience/Shaders/
├── Core/
│   ├── depth.vert
│   ├── depth.frag        # Depth calculation for shadows
│   ├── shadow.vert
│   ├── shadow.frag       # Shadow mapping
│   ├── motion.vert
│   ├── motion.frag       # Motion blur calculation
│   └── final.frag        # Final composition
├── Particles/
│   ├── triangles.vert    # Triangle particle vertices
│   ├── triangles.frag    # Triangle particle rendering
│   └── attributes.js     # Triangle attributes handler
```

### 1.3 New Uniform Variables
```glsl
// Core uniforms
uniform mat4 shadowMatrix;
uniform float shadowBias;
uniform float motionStrength;
uniform float depthScale;

// Audio uniforms extension
uniform float bassImpact;
uniform float trebleImpact;
uniform float midImpact;
```

### 1.4 FBO Chain Setup
```javascript
class RenderChain {
    constructor() {
        this.positionFBO = new FBO(...)
        this.depthFBO = new FBO(...)
        this.shadowFBO = new FBO(...)
        this.motionFBO = new FBO(...)
    }

    update() {
        // 1. Update positions
        // 2. Calculate depth
        // 3. Generate shadows
        // 4. Apply motion blur
        // 5. Final render
    }
}
```

## 2. Triangle Particle System

### 2.1 Geometry Setup
```javascript
class TriangleParticles {
    constructor() {
        this.geometry = new THREE.BufferGeometry()
        this.attributes = {
            position: Float32Array,
            uv: Float32Array,
            offset: Float32Array,
            rotation: Float32Array,
            scale: Float32Array
        }
    }
}
```

### 2.2 Required Attributes
```javascript
{
    position: [x, y, z],       // Triangle center
    offset: [dx, dy],          // Vertex offset
    rotation: [angle],         // Individual rotation
    scale: [sx, sy],          // Size scaling
    velocity: [vx, vy, vz],   // Movement vector
    age: [time],              // Particle lifetime
    type: [0-1]               // Particle behavior type
}
```

### 2.3 Particle Types
1. **Audio Reactive**
   - Scale with bass
   - Rotate with mids
   - Color shift with treble

2. **Ambient**
   - Smooth size pulsing
   - Gentle rotation
   - Subtle color shifts

3. **Interactive**
   - Mouse following
   - Click reaction
   - Proximity effects

## 3. Integration Steps

### Phase 1: FBO Chain Setup
1. Create new FBO classes
2. Implement render targets
3. Set up ping-pong buffers
4. Add uniform handling

### Phase 2: Triangle System
1. Create triangle geometry
2. Add attribute handlers
3. Implement instancing
4. Set up type system

### Phase 3: Shader Integration
1. Port depth calculation
2. Add shadow mapping
3. Implement motion blur
4. Create final composition

### Phase 4: Audio Integration
1. Extend audio analyzer
2. Add new uniform handlers
3. Implement per-type reactions

## 4. Performance Considerations

### 4.1 Optimization Techniques
- Use `THREE.InstancedBufferGeometry`
- Implement frustum culling
- Add LOD system
- Optimize texture formats

### 4.2 Memory Management
- Reuse buffer geometries
- Implement object pooling
- Manage texture disposal
- Control FBO sizes

## 5. Next Steps

1. **Immediate Actions**
   - Create FBO chain structure
   - Set up basic triangle geometry
   - Implement first pass (depth)

2. **Testing Strategy**
   - Visual debug mode
   - Performance monitoring
   - Audio response testing

3. **Dependencies**
   - Three.js BufferGeometryUtils
   - Custom FBO implementation
   - Audio analyzer extension
