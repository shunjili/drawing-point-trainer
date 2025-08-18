import React from 'react';
import './App.css';
import { useGameState } from './hooks/useGameState';
import { ImageLoader } from './components/ImageLoader';
import { ReferenceImage } from './components/ReferenceImage';
import { GameCanvas } from './components/GameCanvas';
import { GameControls } from './components/GameControls';
import { GameState } from './types/game';

function App() {
  const {
    gameState,
    imageData,
    referencePoints,
    markedPoints,
    config,
    stats,
    loadImage,
    addReferencePoint,
    undoLastReferencePoint,
    startGame,
    selectActivePoint,
    markPoint,
    resetGame,
    newImage,
    setConfig
  } = useGameState();

  return (
    <div className="App">
      <header style={{ padding: '20px', borderBottom: '1px solid #ccc' }}>
        <h1>Drawing Point Training</h1>
      </header>

      <main style={{ display: 'flex', minHeight: 'calc(100vh - 80px)' }}>
        {gameState === GameState.IMAGE_LOADING && (
          <div style={{ flex: 1 }}>
            <ImageLoader onImageLoad={loadImage} />
          </div>
        )}

        {(gameState === GameState.SETUP_MARKING || gameState === GameState.GAME_PLAYING) && imageData && (
          <>
            <div style={{ flex: 1, padding: '20px' }}>
              <h3>Reference Image</h3>
              <ReferenceImage
                imageData={imageData}
                points={referencePoints}
                gameState={gameState}
                onPointAdd={gameState === GameState.SETUP_MARKING ? addReferencePoint : undefined}
                onPointSelect={gameState === GameState.GAME_PLAYING ? selectActivePoint : undefined}
              />
            </div>

            {gameState === GameState.GAME_PLAYING && (
              <div style={{ flex: 1, padding: '20px' }}>
                <h3>Your Canvas</h3>
                <GameCanvas
                  imageData={imageData}
                  markedPoints={markedPoints}
                  onPointMark={markPoint}
                />
              </div>
            )}

            <div style={{ width: '300px' }}>
              <GameControls
                gameState={gameState}
                config={config}
                stats={stats}
                pointsMarked={referencePoints.length}
                totalPoints={config.pointCount}
                canUndo={referencePoints.length > 0}
                onUndo={undoLastReferencePoint}
                onStartGame={startGame}
                onNewRound={resetGame}
                onNewImage={newImage}
                onConfigChange={setConfig}
              />
            </div>
          </>
        )}

        {gameState === GameState.RESULTS && (
          <div style={{ flex: 1 }}>
            <GameControls
              gameState={gameState}
              config={config}
              stats={stats}
              pointsMarked={referencePoints.length}
              totalPoints={config.pointCount}
              canUndo={false}
              onUndo={undoLastReferencePoint}
              onStartGame={startGame}
              onNewRound={resetGame}
              onNewImage={newImage}
              onConfigChange={setConfig}
            />
          </div>
        )}
      </main>
    </div>
  );
}

export default App;
