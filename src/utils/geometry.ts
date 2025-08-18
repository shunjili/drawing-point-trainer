import { Point } from '../types/game';

export const calculateDistance = (point1: Point, point2: Point): number => {
  const dx = point1.x - point2.x;
  const dy = point1.y - point2.y;
  return Math.sqrt(dx * dx + dy * dy);
};

export const calculatePercentageDistance = (
  point1: Point,
  point2: Point,
  imageWidth: number,
  imageHeight: number
): number => {
  const distance = calculateDistance(point1, point2);
  const diagonal = Math.sqrt(imageWidth * imageWidth + imageHeight * imageHeight);
  return (distance / diagonal) * 100;
};

export const isWithinTolerance = (
  markedPoint: Point,
  targetPoint: Point,
  imageWidth: number,
  imageHeight: number,
  tolerancePercent: number
): boolean => {
  const percentageDistance = calculatePercentageDistance(
    markedPoint,
    targetPoint,
    imageWidth,
    imageHeight
  );
  return percentageDistance <= tolerancePercent;
};

export const pixelToPercent = (
  x: number,
  y: number,
  imageWidth: number,
  imageHeight: number
): { percentX: number; percentY: number } => {
  return {
    percentX: (x / imageWidth) * 100,
    percentY: (y / imageHeight) * 100
  };
};

export const percentToPixel = (
  percentX: number,
  percentY: number,
  imageWidth: number,
  imageHeight: number
): { x: number; y: number } => {
  return {
    x: (percentX / 100) * imageWidth,
    y: (percentY / 100) * imageHeight
  };
};