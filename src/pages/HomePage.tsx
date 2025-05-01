import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { FiChevronRight, FiStar, FiCpu, FiShield, FiCode } from 'react-icons/fi';
import { Layout } from '../components/Layout';
import { 
  Heading, 
  Text, 
  Card, 
  Button, 
  FlexRow,
  SubHeading,
  Spacer
} from '../components/StyledComponents';
import { useGameContext } from '../context/GameContext';

const HeroSection = styled.section`
  text-align: center;
  margin: 3rem 0;
`;

const GameTitle = styled.h1`
  font-size: 3rem;
  margin-bottom: 1rem;
  background: linear-gradient(90deg, #3e64ff, #5edfff);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  text-shadow: 0 0 30px rgba(94, 223, 255, 0.5);
`;

const GameSubtitle = styled.h2`
  font-size: 1.5rem;
  margin-bottom: 2rem;
  opacity: 0.8;
`;

const LevelCards = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
  margin: 2rem 0;
`;

const LevelCard = styled(Card)<{ unlocked: boolean }>`
  cursor: ${props => props.unlocked ? 'pointer' : 'not-allowed'};
  opacity: ${props => props.unlocked ? 1 : 0.6};
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
  
  &:hover {
    transform: ${props => props.unlocked ? 'translateY(-5px)' : 'none'};
    box-shadow: ${props => props.unlocked ? '0 10px 30px rgba(0, 0, 0, 0.4)' : 'none'};
  }
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 5px;
    background: ${props => props.unlocked ? 'linear-gradient(90deg, #3e64ff, #5edfff)' : 'rgba(255, 255, 255, 0.1)'};
  }
`;

const LevelNumber = styled.div`
  font-size: 3rem;
  font-weight: 700;
  opacity: 0.2;
  position: absolute;
  right: 1rem;
  bottom: 1rem;
`;

const LevelIcon = styled.div`
  font-size: 2rem;
  margin-bottom: 1rem;
  color: ${props => props.theme.colors.secondary};
`;

const LockOverlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2rem;
  color: rgba(255, 255, 255, 0.8);
`;

export const HomePage = () => {
  const navigate = useNavigate();
  const { gameState, resetGame } = useGameContext();
  
  const levels = [
    {
      id: 1,
      title: 'AI人格实验室',
      description: '选择合适的飞船AI人格模式，了解不同AI响应风格的特点',
      icon: <FiStar />,
      path: '/level/1',
      unlocked: true
    },
    {
      id: 2,
      title: '外星密码破译站',
      description: '巧妙提问，从机械师那里获取坐标密码，同时避免触发安全警报',
      icon: <FiCpu />,
      path: '/level/2',
      unlocked: gameState.completedLevels.includes(1)
    },
    {
      id: 3,
      title: '防火墙建造工坊',
      description: '设计AI防火墙策略，平衡信息安全与实用性',
      icon: <FiShield />,
      path: '/level/3',
      unlocked: gameState.completedLevels.includes(2)
    },
    {
      id: 4,
      title: '量子黑客攻防战',
      description: '探索AI安全漏洞，学习如何防范间接信息泄露',
      icon: <FiCpu />,
      path: '/level/4',
      unlocked: gameState.completedLevels.includes(3)
    }
  ];
  
  const handleNavigateToLevel = (path: string, unlocked: boolean) => {
    if (unlocked) {
      navigate(path);
    }
  };
  
  return (
    <Layout>
      <HeroSection>
        <GameTitle>AI星舰守护者</GameTitle>
        <GameSubtitle>探索AI安全的星际之旅</GameSubtitle>
        <Text>
          2080年，人类在星际探索中发现了一艘失控的AI科学舰"普罗米修斯号"。
          作为地球科学小队成员，您需要通过四道安全验证关卡，帮助修复飞船核心AI的防护系统，
          防止外星数据病毒入侵。
        </Text>
        
        <Spacer size={1} />
        
        <Button onClick={() => navigate(`/level/${gameState.currentLevel}`)}>
          继续当前任务 <FiChevronRight />
        </Button>
        <Button onClick={resetGame} variant="warning" style={{ marginLeft: '1rem' }}>
          重新开始任务
        </Button>
      </HeroSection>
      
      <SubHeading>选择任务</SubHeading>
      <LevelCards>
        {levels.map(level => (
          <LevelCard 
            key={level.id}
            unlocked={level.unlocked}
            onClick={() => handleNavigateToLevel(level.path, level.unlocked)}
          >
            <LevelIcon>{level.icon}</LevelIcon>
            <SubHeading>{level.title}</SubHeading>
            <Text>{level.description}</Text>
            <LevelNumber>{level.id}</LevelNumber>
            
            {!level.unlocked && (
              <LockOverlay>
                <FiShield />
              </LockOverlay>
            )}
          </LevelCard>
        ))}
      </LevelCards>
    </Layout>
  );
};