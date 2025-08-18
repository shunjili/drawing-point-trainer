import React, { useRef, useEffect, useState } from 'react';
import { Point, ImageData } from '../types/game';
import { drawCrosshair, drawX, clearCanvas, getCanvasCoordinates } from '../utils/canvas';

interface GameCanvasProps {
  imageData: ImageData;
  markedPoints: Point[];
  onPointMark: (x: number, y: number) => boolean;
  maxWidth?: number;
  maxHeight?: number;
}

export const GameCanvas: React.FC<GameCanvasProps> = ({
  imageData,
  markedPoints,
  onPointMark,
  maxWidth = Math.floor(window.innerWidth * 0.4),
  maxHeight = 5000
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [scale, setScale] = useState({ x: 1, y: 1 });
  const [showFailAnimation, setShowFailAnimation] = useState<{ x: number; y: number } | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !imageData) return;

    const aspectRatio = imageData.width / imageData.height;
    const screenMaxWidth = Math.floor(window.innerWidth * 0.4);
    let displayWidth = Math.max(800, imageData.width);
    if (displayWidth > screenMaxWidth) displayWidth = screenMaxWidth;
    let displayHeight = displayWidth / aspectRatio;

    if (displayHeight > maxHeight) {
      displayHeight = maxHeight;
      displayWidth = displayHeight * aspectRatio;
      displayWidth = Math.max(800, displayWidth);
    }

    canvas.width = displayWidth;
    canvas.height = displayHeight;
    
    setScale({
      x: displayWidth / imageData.width,
      y: displayHeight / imageData.height
    });
  }, [imageData, maxWidth, maxHeight]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    clearCanvas(ctx, canvas.width, canvas.height);

    ctx.fillStyle = '#f8f8f8';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    markedPoints.forEach(point => {
      const x = point.x * scale.x;
      const y = point.y * scale.y;
      drawCrosshair(ctx, x, y, 12, 1, '#00aa00');
    });

    if (showFailAnimation) {
      const x = showFailAnimation.x * scale.x;
      const y = showFailAnimation.y * scale.y;
      drawX(ctx, x, y);
    }
  }, [markedPoints, scale, showFailAnimation]);

  const handleCanvasClick = (event: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas || !imageData) return;

    const coords = getCanvasCoordinates(canvas, event.clientX, event.clientY);
    const originalX = coords.x / scale.x;
    const originalY = coords.y / scale.y;

    const success = onPointMark(originalX, originalY);
    
    if (!success) {
      setShowFailAnimation({ x: originalX, y: originalY });
      setTimeout(() => setShowFailAnimation(null), 500);
    }
  };

  return (
    <div>
      <canvas
        ref={canvasRef}
        onClick={handleCanvasClick}
        style={{ 
          border: '1px solid #ccc', 
          display: 'block',
          cursor: 'crosshair',
          backgroundColor: '#f8f8f8'
        }}
      />
      <p>Click to mark the selected point</p>
    </div>
  );
};