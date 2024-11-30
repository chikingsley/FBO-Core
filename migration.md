# FBO-Core Architecture

## Current Status
Currently transitioning from a monolithic structure to a feature-based architecture.

## Target Architecture
```
src/
├── ai/                          # AI-related features
│   ├── core/
│   │   ├── llm/                # Language model integration
│   │   └── utils/
│   ├── speech/                 # Voice-related features
│   └── vision/                 # Video/Image analysis
│
├── communication/              # Real-time communication
│   ├── video/
│   ├── voice/
│   └── rtc/                   
│
├── editor/                    # Document editing features
│   ├── wysiwyg/
│   └── collaboration/         
│
├── experience/               # 3D engine
│   ├── core/
│   │   ├── Experience.js
│   │   └── utils/
│   ├── world/
│   │   ├── components/
│   │   ├── shaders/
│   │   └── utils/
│   └── media/
│       ├── resources.js
│       └── sound.js
│
├── lib/                     # Shared utilities
└── components/             # Shared UI components
```

## Migration Plan

### Phase 1: Experience Module Restructuring
1. Create new directory structure for Experience
   - Create `experience/core/utils`
   - Create `experience/world/utils`
   - Create `experience/media`
   ```bash
   mkdir -p src/experience/{core/utils,world/utils,media}
   ```
   
2. Move and test core utilities (one at a time)
   - Move Debug.js → core/utils/
   - Move Sizes.js → core/utils/
   - Move Time.js → core/utils/
   - Test after each move
   
3. Move and test media utilities
   - Move Resources.js → media/
   - Move Sound.js → media/
   - Test media functionality

4. Move and test world-specific files
   - Move FBO.js → world/utils/
   - Move shaders to world/shaders/
   - Test world rendering

### Phase 2: Component Extraction
1. Create component structure
   ```bash
   mkdir -p src/components/{ui,media}
   ```

2. Extract UI components from Page.js
   - Move stats display logic
   - Move input log display
   - Move API docs button
   - Test each component individually

### Phase 3: Library Setup
1. Create lib structure
   ```bash
   mkdir -p src/lib/{api,hooks,utils}
   ```

2. Extract shared utilities
   - Identify shared logic
   - Move to appropriate lib subdirectory
   - Update imports
   - Test functionality

### Phase 4: New Feature Preparation
1. Create base directories for future features
   ```bash
   mkdir -p src/{ai,communication,editor}
   ```

2. Add placeholder README.md in each directory
   - Document intended purpose
   - List planned features
   - Note integration points

## Testing Checkpoints

After each step:
1. Run the application
2. Verify 3D rendering works
3. Check all UI components function
4. Verify performance metrics
5. Test all user interactions

## Notes
- Each phase should be a separate PR
- Test thoroughly between moves
- Update imports immediately after moving files
- Keep original files until new structure is verified
- Document any issues in GitHub issues

## Future Considerations
- AI integration points
- Real-time collaboration features
- Document editing capabilities
- Video/voice chat integration
