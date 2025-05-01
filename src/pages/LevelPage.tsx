import { useParams, Navigate } from 'react-router-dom';
import { Layout } from '../components/Layout';
import { Level1PersonalitySelector } from '../components/Level1PersonalitySelector';
import { Level2CodeBreaker } from '../components/Level2CodeBreaker';
import { Level3FirewallBuilder } from '../components/Level3FirewallBuilder';
import { Level4QuantumDefense } from '../components/Level4QuantumDefense';
import { GameLevel } from '../types/game';
import { Card, FlexColumn } from '../components/StyledComponents';
import { useGameContext } from '../context/GameContext';
import { useEffect, useState } from 'react';

export const LevelPage = () => {
  const { levelId } = useParams<{ levelId: string }>();
  const { gameState } = useGameContext();
  const [isTransitioning, setIsTransitioning] = useState(false);
  
  // Convert the levelId parameter to a GameLevel type
  const currentLevel = Number(levelId) as GameLevel;
  
  // Check if the level is valid and accessible
  if (!levelId || isNaN(Number(levelId)) || Number(levelId) < 1 || Number(levelId) > 4) {
    return <Navigate to="/" replace />;
  }
  
  // Prevent access to locked levels
  if (
    currentLevel > 1 && 
    !gameState.completedLevels.includes(currentLevel - 1 as GameLevel)
  ) {
    return <Navigate to="/" replace />;
  }

  // Handle smooth transition between levels
  useEffect(() => {
    setIsTransitioning(true);
    const timer = setTimeout(() => {
      setIsTransitioning(false);
    }, 300);
    
    return () => clearTimeout(timer);
  }, [levelId]);
  
  // Render the appropriate level component
  const renderLevelComponent = () => {
    switch (currentLevel) {
      case 1:
        return <Level1PersonalitySelector />;
      case 2:
        return <Level2CodeBreaker />;
      case 3:
        return <Level3FirewallBuilder />;
      case 4:
        return <Level4QuantumDefense />;
      default:
        return <Navigate to="/" replace />;
    }
  };
  
  return (
    <Layout>
      <FlexColumn style={{ 
        flex: 1, 
        justifyContent: 'flex-start', 
        overflow: 'auto'
      }}>
        <Card style={{ 
          opacity: isTransitioning ? 0.5 : 1, 
          transition: 'opacity 0.3s ease',
          overflowY: 'auto',
          maxHeight: '100%'
        }}>
          {renderLevelComponent()}
        </Card>
      </FlexColumn>
    </Layout>
  );
};