import { createContext, useContext, useState, ReactNode } from 'react';
import { AIPersonalityMode, GameLevel, GameState } from '../types/game';

interface GameContextType {
  gameState: GameState;
  setPersonality: (mode: AIPersonalityMode) => void;
  completeLevel: (level: GameLevel) => void;
  unlockModule: (moduleName: string) => void;
  resetGame: () => void;
  increaseFailedAttempts: () => void;
}

const initialGameState: GameState = {
  currentLevel: 1,
  completedLevels: [],
  selectedPersonality: undefined,
  unlockedModules: [],
  failedAttempts: 0,
};

const GameContext = createContext<GameContextType | undefined>(undefined);

export const GameProvider = ({ children }: { children: ReactNode }) => {
  const [gameState, setGameState] = useState<GameState>(initialGameState);

  const setPersonality = (mode: AIPersonalityMode) => {
    setGameState((prev) => ({ ...prev, selectedPersonality: mode }));
  };

  const completeLevel = (level: GameLevel) => {
    setGameState((prev) => {
      // If the level is already completed, don't modify the state
      if (prev.completedLevels.includes(level)) {
        return prev;
      }
      
      // Calculate the next level
      const nextLevel = level < 4 ? (level + 1) as GameLevel : level;
      
      return {
        ...prev,
        currentLevel: nextLevel,
        completedLevels: [...prev.completedLevels, level],
      };
    });
  };

  const unlockModule = (moduleName: string) => {
    setGameState((prev) => {
      if (prev.unlockedModules.includes(moduleName)) {
        return prev;
      }
      return {
        ...prev,
        unlockedModules: [...prev.unlockedModules, moduleName],
      };
    });
  };

  const resetGame = () => {
    setGameState(initialGameState);
  };

  const increaseFailedAttempts = () => {
    setGameState((prev) => ({
      ...prev,
      failedAttempts: prev.failedAttempts + 1,
    }));
  };

  return (
    <GameContext.Provider
      value={{
        gameState,
        setPersonality,
        completeLevel,
        unlockModule,
        resetGame,
        increaseFailedAttempts,
      }}
    >
      {children}
    </GameContext.Provider>
  );
};

export const useGameContext = () => {
  const context = useContext(GameContext);
  if (context === undefined) {
    throw new Error('useGameContext must be used within a GameProvider');
  }
  return context;
};