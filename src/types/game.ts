export enum GameState {
  IMAGE_LOADING = 'image_loading',
  SETUP_MARKING = 'setup_marking',
  GAME_PLAYING = 'game_playing',
  RESULTS = 'results'
}

export interface Point {
  id: string;
  x: number;
  y: number;
  percentX: number;
  percentY: number;
  isMarked: boolean;
  isActive: boolean;
}

export interface GameConfig {
  pointCount: number;
  tolerancePercent: number;
  maxFailedAttempts: number;
}

export interface GameStats {
  successfulMarks: number;
  failedAttempts: number;
  accuracy: number;
  completed: boolean;
  failed: boolean;
}

export interface ImageData {
  src: string;
  width: number;
  height: number;
  element: HTMLImageElement;
}