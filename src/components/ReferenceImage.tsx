import React, { useRef, useEffect, useState } from 'react';
import { Point, ImageData, GameState } from '../types/game';
import { drawCrosshair, drawImage, getCanvasCoordinates } from '../utils/canvas';

interface ReferenceImageProps {
  imageData: ImageData;
  points: Point[];
  gameState: GameState;
  onPointAdd?: (x: number, y: number) => void;
  onPointSelect?: (pointId: string) => void;
  maxWidth?: number;
  maxHeight?: number;
}

export const ReferenceImage: React.FC<ReferenceImageProps> = ({
  imageData,
  points,
  gameState,
  onPointAdd,
  onPointSelect,
  maxWidth = Math.floor(window.innerWidth * 0.4),
  maxHeight = 5000
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [scale, setScale] = useState({ x: 1, y: 1 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !imageData) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const aspectRatio = imageData.width / imageData.height;
    let displayWidth: number;
    let displayHeight: number;
    
    if (gameState === GameState.GAME_PLAYING) {
      // During game, make reference image smaller (50% of canvas size)
      const screenMaxWidth = Math.floor(window.innerWidth * 0.2);
      displayWidth = Math.max(400, imageData.width * 0.5);
      if (displayWidth > screenMaxWidth) displayWidth = screenMaxWidth;
      displayHeight = displayWidth / aspectRatio;

      if (displayHeight > maxHeight * 0.6) {
        displayHeight = maxHeight * 0.6;
        displayWidth = displayHeight * aspectRatio;
        displayWidth = Math.max(400, displayWidth);
      }
    } else {
      // During setup, use larger size for comfortable marking
      const screenMaxWidth = Math.floor(window.innerWidth * 0.4);
      displayWidth = Math.max(1000, imageData.width);
      if (displayWidth > screenMaxWidth) displayWidth = screenMaxWidth;
      displayHeight = displayWidth / aspectRatio;

      if (displayHeight > maxHeight) {
        displayHeight = maxHeight;
        displayWidth = displayHeight * aspectRatio;
        displayWidth = Math.max(1000, displayWidth);
      }
    }
    
    canvas.width = displayWidth;
    canvas.height = displayHeight;
    
    setScale({
      x: displayWidth / imageData.width,
      y: displayHeight / imageData.height
    });

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      drawImage(ctx, imageData.element, 0, 0, displayWidth, displayHeight);
      
      points.forEach(point => {
        const x = point.x * (displayWidth / imageData.width);
        const y = point.y * (displayHeight / imageData.height);
        const opacity = gameState === GameState.SETUP_MARKING ? 0.5 : 0.7;
        const isPulsing = point.isActive;
        
        let color = '#000000';
        if (point.isMarked) {
          color = '#00aa00';
        } else if (isPulsing) {
          color = '#ff6600';
        }
        
        if (isPulsing) {
          const time = Date.now() / 1000;
          const pulseScale = 1 + 0.3 * Math.sin(time * 4);
          drawCrosshair(ctx, x, y, 10 * pulseScale, opacity, color);
        } else {
          drawCrosshair(ctx, x, y, 10, opacity, color);
        }
      });
    };

    draw();

    let animationId: number;
    if (points.some(p => p.isActive)) {
      const animate = () => {
        draw();
        animationId = requestAnimationFrame(animate);
      };
      animationId = requestAnimationFrame(animate);
    }

    return () => {
      if (animationId) {
        cancelAnimationFrame(animationId);
      }
    };
  }, [imageData, points, gameState, maxWidth, maxHeight]);

  const handleCanvasClick = (event: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas || !imageData) return;

    const coords = getCanvasCoordinates(canvas, event.clientX, event.clientY);
    const originalX = coords.x / scale.x;
    const originalY = coords.y / scale.y;

    if (gameState === GameState.SETUP_MARKING && onPointAdd) {
      onPointAdd(originalX, originalY);
    } else if (gameState === GameState.GAME_PLAYING && onPointSelect) {
      const clickedPoint = points.find(point => {
        if (point.isMarked) return false;
        const distance = Math.sqrt(
          Math.pow((point.x * scale.x) - coords.x, 2) + 
          Math.pow((point.y * scale.y) - coords.y, 2)
        );
        return distance <= 20;
      });
      
      if (clickedPoint) {
        onPointSelect(clickedPoint.id);
      }
    }
  };

  const handleMouseMove = (event: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas || gameState !== GameState.GAME_PLAYING) return;

    const coords = getCanvasCoordinates(canvas, event.clientX, event.clientY);
    const hoveredPoint = points.find(point => {
      if (point.isMarked) return false;
      const distance = Math.sqrt(
        Math.pow((point.x * scale.x) - coords.x, 2) + 
        Math.pow((point.y * scale.y) - coords.y, 2)
      );
      return distance <= 20;
    });

    canvas.style.cursor = hoveredPoint ? 'pointer' : 'default';
    canvas.title = hoveredPoint ? 'Click to mark this point first' : '';
  };

  return (
    <div>
      <canvas
        ref={canvasRef}
        onClick={handleCanvasClick}
        onMouseMove={handleMouseMove}
        style={{ border: '1px solid #ccc', display: 'block' }}
      />
      {gameState === GameState.SETUP_MARKING && (
        <p>Points marked: {points.length}/{imageData ? Math.min(points.length + (points.length < 10 ? 1 : 0), 10) : 0}</p>
      )}
    </div>
  );
};