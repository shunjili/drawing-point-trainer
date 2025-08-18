# Drawing Point Training App - Technical Specification

## Project Overview
A React-based web application that helps drawing artists train their observation skills by identifying and marking key points on images with precision.

## Core Game Mechanics

### Game Flow
1. **Setup Phase**: User marks 10 reference points on uploaded image
2. **Game Phase**: User attempts to recreate those points on blank canvas
3. **Results Phase**: Display accuracy results and options to continue

### Scoring System
- **Distance Calculation**: Based on percentage of image dimensions
- **Tolerance**: Default 3% (configurable)
- **Success Criteria**: Point marked within tolerance threshold
- **Failure Tracking**: Counter for failed attempts

## Technical Architecture

### Technology Stack
- **Framework**: React with TypeScript
- **Rendering**: HTML5 Canvas API
- **Storage**: Client-side only (in-memory)
- **Build Tool**: Create React App

### Core Components

#### 1. App Component
- Main application container
- Game state management
- Component orchestration

#### 2. ImageLoader Component
- File upload interface (JPEG/PNG)
- Web URL input
- Image validation and loading

#### 3. ReferenceImage Component
- Display uploaded image
- Handle point marking during setup
- Show reference points during game phase
- Point selection for game phase

#### 4. GameCanvas Component
- Blank canvas for user marking
- Point marking detection
- Visual feedback rendering

#### 5. GameControls Component
- Configuration panel
- Game navigation buttons
- Status displays (remaining points, failed attempts)

#### 6. ResultsScreen Component
- Accuracy statistics
- Game completion status
- Navigation options (retry/new image)

### State Management

#### Game States
```typescript
enum GameState {
  IMAGE_LOADING = 'image_loading',
  SETUP_MARKING = 'setup_marking', 
  GAME_PLAYING = 'game_playing',
  RESULTS = 'results'
}
```

#### Point Data Structure
```typescript
interface Point {
  id: string;
  x: number; // pixel coordinates
  y: number; // pixel coordinates
  percentX: number; // percentage of image width
  percentY: number; // percentage of image height
  isMarked: boolean;
  isActive: boolean; // currently selected for marking
}
```

#### Game Configuration
```typescript
interface GameConfig {
  pointCount: number; // default: 10
  tolerancePercent: number; // default: 3
  maxFailedAttempts: number; // configurable
}
```

## User Interface Specifications

### Setup Phase UI
- Reference image display area
- Point counter: "Points remaining: X/10"
- Undo button (only for last marked point)
- Start game button (enabled when all points marked)

### Game Phase UI
- **Left Panel**: Reference image with:
  - All marked points as crosshairs (50% opacity)
  - Active point with pulsing animation
  - Hover effects on unmarked points
  - Tooltips: "Click to mark this point first"
- **Right Panel**: Blank canvas with:
  - Successfully marked points as green checkmarks
  - Failed attempt indicators (brief red X)
- **Status Bar**: 
  - Failed attempts counter
  - Current point indicator
  - Progress indicator

### Results Phase UI
- Accuracy percentage
- Total failed attempts
- Success rate per point
- Two action buttons:
  - "New Round" (same image)
  - "New Image" (restart with different image)

## Visual Design Specifications

### Point Visualization
- **Setup Phase**: Crosshairs, 50% opacity, numbered
- **Game Reference**: Crosshairs, 50% opacity
- **Active Point**: Pulsing animation (scale 1.0 to 1.3, 1s cycle)
- **Success Markers**: Green checkmarks on canvas
- **Failure Indicators**: Red X, 500ms display duration

### Animations
- Point pulsing: CSS/Canvas animation
- Success checkmark: Brief scale-in animation
- Failure X: Fade-in then fade-out
- Hover effects: Subtle highlight/glow

### Layout
- **Primary**: Side-by-side (50/50 split)
- **Responsive**: Maintain aspect ratios
- **Architecture**: Component-based for easy layout switching

## Implementation Phases

### Phase 1: Core Setup
1. React project initialization
2. Basic component structure
3. Image loading functionality
4. Canvas setup

### Phase 2: Point Marking System
1. Reference image point marking
2. Canvas interaction handling
3. Point data management
4. Undo functionality

### Phase 3: Game Logic
1. Point selection system
2. Distance calculation
3. Tolerance checking
4. Success/failure feedback

### Phase 4: User Interface
1. Visual feedback system
2. Animations and transitions
3. Status displays
4. Results screen

### Phase 5: Configuration & Polish
1. Settings panel
2. Difficulty options
3. Performance optimization
4. User experience refinements

## File Structure
```
src/
├── components/
│   ├── ImageLoader/
│   ├── ReferenceImage/
│   ├── GameCanvas/
│   ├── GameControls/
│   ├── ResultsScreen/
│   └── ConfigPanel/
├── hooks/
│   ├── useGameState.ts
│   ├── useImageLoader.ts
│   └── usePointMarking.ts
├── types/
│   └── game.ts
├── utils/
│   ├── geometry.ts
│   └── canvas.ts
└── App.tsx
```

## Success Criteria
- Smooth point marking experience
- Accurate distance calculations
- Responsive visual feedback
- Configurable difficulty settings
- Client-side only operation
- Desktop/tablet optimized interface