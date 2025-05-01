import { Layout } from '../components/Layout';
import { 
  Heading, 
  SubHeading, 
  Text, 
  Card, 
  FlexRow,
  SpaceshipModule,
  ProgressBar,
  Badge
} from '../components/StyledComponents';
import { useGameContext } from '../context/GameContext';
import styled from 'styled-components';
import { FiCheck, FiLock, FiStar, FiShield } from 'react-icons/fi';

const ProgressContainer = styled.div`
  margin-top: 2rem;
`;

const AchievementCard = styled(Card)`
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  margin-bottom: 0.75rem;
`;

const IconWrapper = styled.div<{ unlocked: boolean }>`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background-color: ${props => props.unlocked 
    ? props.theme.colors.success
    : 'rgba(255, 255, 255, 0.1)'};
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${props => props.unlocked ? 'white' : 'rgba(255, 255, 255, 0.5)'};
  font-size: 1.2rem;
`;

const ProgressSection = styled.div`
  margin: 2rem 0;
`;

const ModulesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(100px, 1fr));
  gap: 1rem;
  margin-top: 1rem;
`;

const ModuleLabel = styled.div`
  margin-top: 0.5rem;
  font-size: 0.9rem;
  text-align: center;
`;

const StatsContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
  margin-top: 1rem;
`;

const StatCard = styled.div`
  background: rgba(255, 255, 255, 0.05);
  padding: 1rem;
  border-radius: 5px;
  text-align: center;
`;

const StatValue = styled.div`
  font-size: 2.5rem;
  font-weight: 700;
  color: ${props => props.theme.colors.secondary};
  margin-bottom: 0.5rem;
`;

const StatLabel = styled.div`
  font-size: 0.9rem;
  opacity: 0.8;
`;

export const ProgressPage = () => {
  const { gameState } = useGameContext();
  
  // Calculate completion percentage
  const totalLevels = 4;
  const completedLevels = gameState.completedLevels.length;
  const completionPercentage = (completedLevels / totalLevels) * 100;
  
  // Define ship modules
  const modules = [
    { id: 'propulsion', name: '动力系统', icon: '🚀' },
    { id: 'navigation', name: '导航系统', icon: '🧭' },
    { id: 'weapons', name: '武器系统', icon: '🛡️' },
    { id: 'life-support', name: '生命维持系统', icon: '🫁' },
  ];
  
  // Define achievements
  const achievements = [
    { 
      id: 'first-level', 
      name: '初级AI工程师', 
      description: '完成"AI人格实验室"关卡',
      unlocked: gameState.completedLevels.includes(1)
    },
    { 
      id: 'second-level', 
      name: '密码破译专家', 
      description: '完成"外星密码破译站"关卡',
      unlocked: gameState.completedLevels.includes(2)
    },
    { 
      id: 'third-level', 
      name: '防火墙架构师', 
      description: '完成"防火墙建造工坊"关卡',
      unlocked: gameState.completedLevels.includes(3)
    },
    { 
      id: 'fourth-level', 
      name: '量子安全专家', 
      description: '完成"量子黑客攻防战"关卡',
      unlocked: gameState.completedLevels.includes(4)
    },
    { 
      id: 'all-modules', 
      name: '星舰修复大师', 
      description: '修复所有飞船系统模块',
      unlocked: gameState.unlockedModules.length === 4
    }
  ];
  
  return (
    <Layout>
      <Heading>任务进度</Heading>
      
      <Card>
        <SubHeading>总体完成度</SubHeading>
        <FlexRow style={{ alignItems: 'center', justifyContent: 'space-between' }}>
          <Text>任务进度：</Text>
          <Text>{completionPercentage.toFixed(0)}%</Text>
        </FlexRow>
        <ProgressBar progress={completionPercentage} />
        
        <ProgressSection>
          <SubHeading>飞船系统状态</SubHeading>
          <Text>修复以下系统模块以恢复"普罗米修斯号"的正常功能：</Text>
          
          <ModulesGrid>
            {modules.map(module => {
              const isUnlocked = gameState.unlockedModules.includes(module.id);
              return (
                <div key={module.id}>
                  <SpaceshipModule unlocked={isUnlocked}>
                    <div style={{ fontSize: '2rem' }}>{module.icon}</div>
                  </SpaceshipModule>
                  <ModuleLabel>
                    {module.name}
                    <Badge 
                      variant={isUnlocked ? 'success' : 'danger'}
                      style={{ 
                        marginLeft: '0.5rem',
                        fontSize: '0.7rem',
                        padding: '0.15rem 0.4rem'
                      }}
                    >
                      {isUnlocked ? '已修复' : '损坏'}
                    </Badge>
                  </ModuleLabel>
                </div>
              );
            })}
          </ModulesGrid>
        </ProgressSection>
      </Card>
      
      <Card>
        <SubHeading>成就列表</SubHeading>
        {achievements.map(achievement => (
          <AchievementCard key={achievement.id}>
            <IconWrapper unlocked={achievement.unlocked}>
              {achievement.unlocked ? <FiCheck /> : <FiLock />}
            </IconWrapper>
            <div>
              <div style={{ fontWeight: 'bold' }}>{achievement.name}</div>
              <div style={{ fontSize: '0.9rem', opacity: 0.8 }}>{achievement.description}</div>
            </div>
          </AchievementCard>
        ))}
      </Card>
      
      <Card>
        <SubHeading>游戏统计</SubHeading>
        <StatsContainer>
          <StatCard>
            <StatValue>{gameState.completedLevels.length}</StatValue>
            <StatLabel>完成关卡数</StatLabel>
          </StatCard>
          
          <StatCard>
            <StatValue>{gameState.unlockedModules.length}</StatValue>
            <StatLabel>解锁系统数</StatLabel>
          </StatCard>
          
          <StatCard>
            <StatValue>{gameState.failedAttempts}</StatValue>
            <StatLabel>失败尝试次数</StatLabel>
          </StatCard>
        </StatsContainer>
      </Card>
    </Layout>
  );
};