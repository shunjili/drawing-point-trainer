import { useState, useCallback } from 'react';
import { GameState, Point, GameConfig, GameStats, ImageData } from '../types/game';

const DEFAULT_CONFIG: GameConfig = {
  pointCount: 10,
  tolerancePercent: 3,
  maxFailedAttempts: 40
};

export const useGameState = () => {
  const [gameState, setGameState] = useState<GameState>(GameState.IMAGE_LOADING);
  const [imageData, setImageData] = useState<ImageData | null>(null);
  const [referencePoints, setReferencePoints] = useState<Point[]>([]);
  const [markedPoints, setMarkedPoints] = useState<Point[]>([]);
  const [activePointId, setActivePointId] = useState<string | null>(null);
  const [config, setConfig] = useState<GameConfig>(DEFAULT_CONFIG);
  const [stats, setStats] = useState<GameStats>({
    successfulMarks: 0,
    failedAttempts: 0,
    accuracy: 0,
    completed: false,
    failed: false
  });

  const loadImage = useCallback((src: string): Promise<ImageData> => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => {
        const imageData: ImageData = {
          src,
          width: img.width,
          height: img.height,
          element: img
        };
        setImageData(imageData);
        setGameState(GameState.SETUP_MARKING);
        resolve(imageData);
      };
      img.onerror = reject;
      img.src = src;
    });
  }, []);

  const addReferencePoint = useCallback((x: number, y: number) => {
    if (!imageData || referencePoints.length >= config.pointCount) return;

    const point: Point = {
      id: `ref-${referencePoints.length}`,
      x,
      y,
      percentX: (x / imageData.width) * 100,
      percentY: (y / imageData.height) * 100,
      isMarked: false,
      isActive: false
    };

    setReferencePoints(prev => [...prev, point]);
  }, [imageData, referencePoints.length, config.pointCount]);

  const undoLastReferencePoint = useCallback(() => {
    setReferencePoints(prev => prev.slice(0, -1));
  }, []);

  const startGame = useCallback(() => {
    if (referencePoints.length === config.pointCount) {
      setGameState(GameState.GAME_PLAYING);
      setMarkedPoints([]);
      setStats({
        successfulMarks: 0,
        failedAttempts: 0,
        accuracy: 0,
        completed: false,
        failed: false
      });
      
      // Auto-select the first unmarked point
      const firstUnmarkedPoint = referencePoints.find(p => !p.isMarked);
      if (firstUnmarkedPoint) {
        setActivePointId(firstUnmarkedPoint.id);
        setReferencePoints(prev => 
          prev.map(point => ({ ...point, isActive: point.id === firstUnmarkedPoint.id }))
        );
      }
    }
  }, [referencePoints, config.pointCount]);

  const selectActivePoint = useCallback((pointId: string) => {
    setActivePointId(pointId);
    setReferencePoints(prev => 
      prev.map(point => ({ ...point, isActive: point.id === pointId }))
    );
  }, []);

  const markPoint = useCallback((x: number, y: number): boolean => {
    if (!activePointId || !imageData) return false;

    const targetPoint = referencePoints.find(p => p.id === activePointId);
    if (!targetPoint) return false;

    const markedPoint: Point = {
      id: `marked-${markedPoints.length}`,
      x,
      y,
      percentX: (x / imageData.width) * 100,
      percentY: (y / imageData.height) * 100,
      isMarked: true,
      isActive: false
    };

    const distance = Math.sqrt(
      Math.pow(markedPoint.x - targetPoint.x, 2) + 
      Math.pow(markedPoint.y - targetPoint.y, 2)
    );
    const diagonal = Math.sqrt(imageData.width ** 2 + imageData.height ** 2);
    const percentageDistance = (distance / diagonal) * 100;
    
    const isSuccess = percentageDistance <= config.tolerancePercent;

    if (isSuccess) {
      setMarkedPoints(prev => [...prev, markedPoint]);
      setReferencePoints(prev => 
        prev.map(point => 
          point.id === activePointId ? { ...point, isMarked: true, isActive: false } : point
        )
      );
      setActivePointId(null);
      setStats(prev => ({
        ...prev,
        successfulMarks: prev.successfulMarks + 1,
        accuracy: ((prev.successfulMarks + 1) / (prev.successfulMarks + 1 + prev.failedAttempts)) * 100
      }));

      const remainingPoints = referencePoints.filter(p => !p.isMarked && p.id !== activePointId);
      if (remainingPoints.length === 0) {
        setStats(prev => ({ ...prev, completed: true }));
        setGameState(GameState.RESULTS);
      } else {
        // Auto-advance to next unmarked point
        const nextPoint = remainingPoints[0];
        setActivePointId(nextPoint.id);
        setReferencePoints(prev => 
          prev.map(point => ({ ...point, isActive: point.id === nextPoint.id }))
        );
      }
    } else {
      const newFailedAttempts = stats.failedAttempts + 1;
      setStats(prev => ({
        ...prev,
        failedAttempts: newFailedAttempts,
        accuracy: prev.successfulMarks / (prev.successfulMarks + newFailedAttempts) * 100,
        failed: newFailedAttempts >= config.maxFailedAttempts
      }));

      if (newFailedAttempts >= config.maxFailedAttempts) {
        setGameState(GameState.RESULTS);
      }
    }

    return isSuccess;
  }, [activePointId, imageData, referencePoints, markedPoints.length, config, stats]);

  const resetGame = useCallback(() => {
    setReferencePoints([]);
    setMarkedPoints([]);
    setActivePointId(null);
    setStats({
      successfulMarks: 0,
      failedAttempts: 0,
      accuracy: 0,
      completed: false,
      failed: false
    });
    setGameState(GameState.SETUP_MARKING);
  }, []);

  const newImage = useCallback(() => {
    setImageData(null);
    setReferencePoints([]);
    setMarkedPoints([]);
    setActivePointId(null);
    setStats({
      successfulMarks: 0,
      failedAttempts: 0,
      accuracy: 0,
      completed: false,
      failed: false
    });
    setGameState(GameState.IMAGE_LOADING);
  }, []);

  return {
    gameState,
    imageData,
    referencePoints,
    markedPoints,
    activePointId,
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
  };
};