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
    <div>
      <h3>Game Controls</h3>
      
      {gameState === GameState.SETUP_MARKING && (
        <div className="controls-section">
          <p>Points marked: {pointsMarked}/{totalPoints}</p>
          <button onClick={onUndo} disabled={!canUndo} className="button-secondary">
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
        <div className="stats-grid">
          <div className="stat-item">
            <div className="stat-value">{stats.successfulMarks}</div>
            <div className="stat-label">Successful</div>
          </div>
          <div className="stat-item">
            <div className="stat-value">{stats.failedAttempts}/{config.maxFailedAttempts}</div>
            <div className="stat-label">Failed</div>
          </div>
          <div className="stat-item">
            <div className="stat-value">{stats.accuracy.toFixed(1)}%</div>
            <div className="stat-label">Accuracy</div>
          </div>
          <div className="stat-item">
            <div className="stat-value">📍</div>
            <div className="stat-label">Select Point</div>
          </div>
        </div>
      )}

      {gameState === GameState.RESULTS && (
        <div>
          <h3>Results</h3>
          <div className="stats-grid">
            <div className="stat-item">
              <div className="stat-value">{stats.completed ? '✓' : '✗'}</div>
              <div className="stat-label">{stats.completed ? 'Completed' : 'Failed'}</div>
            </div>
            <div className="stat-item">
              <div className="stat-value">{stats.successfulMarks}/{totalPoints}</div>
              <div className="stat-label">Success Rate</div>
            </div>
            <div className="stat-item">
              <div className="stat-value">{stats.failedAttempts}</div>
              <div className="stat-label">Failed Attempts</div>
            </div>
            <div className="stat-item">
              <div className="stat-value">{stats.accuracy.toFixed(1)}%</div>
              <div className="stat-label">Final Accuracy</div>
            </div>
          </div>
          
          <div className="controls-section">
            <button onClick={onNewRound} className="button-secondary" style={{ marginRight: '10px' }}>
              New Round (Same Image)
            </button>
            <button onClick={onNewImage}>
              New Image
            </button>
          </div>
        </div>
      )}

      {gameState !== GameState.GAME_PLAYING && (
        <div className="controls-section">
          <h4>Configuration</h4>
          
          <div className="config-grid">
            <div className="config-item">
              <label>Points:</label>
              <input
                type="number"
                min="3"
                max="20"
                value={config.pointCount}
                onChange={(e) => handleConfigChange('pointCount', Number(e.target.value))}
              />
            </div>

            <div className="config-item">
              <label>Tolerance %:</label>
              <input
                type="number"
                min="1"
                max="10"
                step="0.5"
                value={config.tolerancePercent}
                onChange={(e) => handleConfigChange('tolerancePercent', Number(e.target.value))}
              />
            </div>

            <div className="config-item">
              <label>Max Failed Attempts:</label>
              <input
                type="number"
                min="5"
                max="50"
                value={config.maxFailedAttempts}
                onChange={(e) => handleConfigChange('maxFailedAttempts', Number(e.target.value))}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GameControls;