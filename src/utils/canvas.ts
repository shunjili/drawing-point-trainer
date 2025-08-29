
export const drawSuccessDot = (
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  size: number = 8,
  opacity: number = 1,
  color: string = '#00aa00'
): void => {
  ctx.save();
  ctx.globalAlpha = opacity;
  
  // Draw white outline for high contrast
  ctx.fillStyle = '#ffffff';
  ctx.beginPath();
  ctx.arc(x, y, size + 2, 0, 2 * Math.PI);
  ctx.fill();
  
  // Draw colored dot on top
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.arc(x, y, size, 0, 2 * Math.PI);
  ctx.fill();
  
  ctx.restore();
};

export const drawCheckmark = (
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  size: number = 15,
  color: string = '#00ff00'
): void => {
  ctx.save();
  ctx.strokeStyle = color;
  ctx.lineWidth = 3;
  ctx.lineCap = 'round';
  ctx.beginPath();
  ctx.moveTo(x - size * 0.5, y);
  ctx.lineTo(x - size * 0.1, y + size * 0.4);
  ctx.lineTo(x + size * 0.5, y - size * 0.4);
  ctx.stroke();
  ctx.restore();
};

export const drawDot = (
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  size: number = 8,
  color: string = '#ff0000'
): void => {
  ctx.save();
  
  // Draw white outline for high contrast
  ctx.fillStyle = '#ffffff';
  ctx.beginPath();
  ctx.arc(x, y, size + 2, 0, 2 * Math.PI);
  ctx.fill();
  
  // Draw colored dot on top
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.arc(x, y, size, 0, 2 * Math.PI);
  ctx.fill();
  
  ctx.restore();
};

export const clearCanvas = (
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number
): void => {
  ctx.clearRect(0, 0, width, height);
};

export const drawImage = (
  ctx: CanvasRenderingContext2D,
  image: HTMLImageElement,
  x: number = 0,
  y: number = 0,
  width?: number,
  height?: number
): void => {
  if (width && height) {
    ctx.drawImage(image, x, y, width, height);
  } else {
    ctx.drawImage(image, x, y);
  }
};

export const getCanvasCoordinates = (
  canvas: HTMLCanvasElement,
  clientX: number,
  clientY: number
): { x: number; y: number } => {
  const rect = canvas.getBoundingClientRect();
  const scaleX = canvas.width / rect.width;
  const scaleY = canvas.height / rect.height;
  
  return {
    x: (clientX - rect.left) * scaleX,
    y: (clientY - rect.top) * scaleY
  };
};