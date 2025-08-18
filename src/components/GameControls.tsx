import React from 'react';
import { GameState, GameConfig, GameStats } from '../types/game';

interface GameControlsProps {
  gameState: GameState;
  config: GameConfig;
  stats: GameStats;
  pointsMarked: number;
  totalPoints: number;
  canUndo: boolean;
  onUndo: () => void;
  onStartGame: () => void;
  onNewRound: () => void;
  onNewImage: () => void;
  onConfigChange: (config: GameConfig) => void;
}

export const GameControls: React.FC<GameControlsProps> = ({
  gameState,
  config,
  stats,
  pointsMarked,
  totalPoints,
  canUndo,
  onUndo,
  onStartGame,
  onNewRound,
  onNewImage,
  onConfigChange
}) => {
  const handleConfigChange = (field: keyof GameConfig, value: number) => {
    onConfigChange({ ...config, [field]: value });
  };

  if (gameState === GameState.IMAGE_LOADING) {
    return null;
  }

  return (
    <div style={{ padding: '20px', borderLeft: '1px solid #ccc' }}>
      <h3>Game Controls</h3>
      
      {gameState === GameState.SETUP_MARKING && (
        <div>
          <p>Points marked: {pointsMarked}/{totalPoints}</p>
          <button onClick={onUndo} disabled={!canUndo}>
            Undo Last Point
          </button>
          <button 
            onClick={onStartGame} 
            disabled={pointsMarked < totalPoints}
            style={{ marginLeft: '10px' }}
          >
            Start Game
          </button>
        </div>
      )}

      {gameState === GameState.GAME_PLAYING && (
        <div>
          <p>Successful marks: {stats.successfulMarks}</p>
          <p>Failed attempts: {stats.failedAttempts}/{config.maxFailedAttempts}</p>
          <p>Accuracy: {stats.accuracy.toFixed(1)}%</p>
          <p>Select a point on the reference image to mark it</p>
        </div>
      )}

      {gameState === GameState.RESULTS && (
        <div>
          <h3>Results</h3>
          <p>Status: {stats.completed ? 'Completed!' : 'Failed'}</p>
          <p>Successful marks: {stats.successfulMarks}/{totalPoints}</p>
          <p>Failed attempts: {stats.failedAttempts}</p>
          <p>Final accuracy: {stats.accuracy.toFixed(1)}%</p>
          
          <div style={{ marginTop: '20px' }}>
            <button onClick={onNewRound} style={{ marginRight: '10px' }}>
              New Round (Same Image)
            </button>
            <button onClick={onNewImage}>
              New Image
            </button>
          </div>
        </div>
      )}

      <div style={{ marginTop: '30px', borderTop: '1px solid #eee', paddingTop: '20px' }}>
        <h4>Configuration</h4>
        
        <div style={{ marginBottom: '10px' }}>
          <label>
            Points: 
            <input
              type="number"
              min="3"
              max="20"
              value={config.pointCount}
              onChange={(e) => handleConfigChange('pointCount', Number(e.target.value))}
              style={{ width: '60px', marginLeft: '10px' }}
              disabled={gameState === GameState.GAME_PLAYING}
            />
          </label>
        </div>

        <div style={{ marginBottom: '10px' }}>
          <label>
            Tolerance %: 
            <input
              type="number"
              min="1"
              max="10"
              step="0.5"
              value={config.tolerancePercent}
              onChange={(e) => handleConfigChange('tolerancePercent', Number(e.target.value))}
              style={{ width: '60px', marginLeft: '10px' }}
              disabled={gameState === GameState.GAME_PLAYING}
            />
          </label>
        </div>

        <div style={{ marginBottom: '10px' }}>
          <label>
            Max Failed Attempts: 
            <input
              type="number"
              min="5"
              max="50"
              value={config.maxFailedAttempts}
              onChange={(e) => handleConfigChange('maxFailedAttempts', Number(e.target.value))}
              style={{ width: '60px', marginLeft: '10px' }}
              disabled={gameState === GameState.GAME_PLAYING}
            />
          </label>
        </div>
      </div>
    </div>
  );
};

export default GameControls;