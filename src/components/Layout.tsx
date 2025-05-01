import { ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { FiHome, FiInfo, FiSettings, FiAward, FiActivity } from 'react-icons/fi';
import { useGameContext } from '../context/GameContext';
import { AppContainer, Button, FlexRow } from './StyledComponents';
import cyberspaceLogo from '../assets/cyberspace-logo.png';

interface LayoutProps {
  children: ReactNode;
  showHeader?: boolean;
  showFooter?: boolean;
}

const Header = styled.header`
  padding: 1rem 0;
  margin-bottom: 1rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  flex-shrink: 0;
`;

const Footer = styled.footer`
  padding: 1rem 0;
  margin-top: auto;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  font-size: 0.9rem;
  flex-shrink: 0;
`;

const Nav = styled(FlexRow)`
  justify-content: space-between;
`;

const Logo = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  font-size: 1.5rem;
  font-weight: 700;
  color: ${props => props.theme.colors.secondary};
`;

const LogoImage = styled.img`
  height: 70px; /* Increased from 50px to 70px */
  width: auto;
`;

const ContentContainer = styled.main`
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  overflow-y: auto;
  padding: 0.5rem;
  height: 100%;
`;

const ModuleStatus = styled.div`
  display: flex;
  gap: 0.5rem;
  align-items: center;
`;

const ModuleIndicator = styled.div<{ unlocked: boolean }>`
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background-color: ${props => 
    props.unlocked ? props.theme.colors.success : 'rgba(255, 255, 255, 0.3)'};
`;

export const Layout = ({ children, showHeader = true, showFooter = true }: LayoutProps) => {
  const navigate = useNavigate();
  const { gameState } = useGameContext();
  
  return (
    <AppContainer>
      {showHeader && (
        <Header>
          <Nav>
            <Logo>
              <span>AI星舰守护者</span>
              <LogoImage src={cyberspaceLogo} alt="网络空间安全防御全国重点实验室" />
            </Logo>
            <FlexRow>
              <Button onClick={() => navigate('/')}><FiHome /></Button>
              <Button onClick={() => navigate('/progress')}><FiAward /></Button>
              <Button onClick={() => navigate('/about')}><FiInfo /></Button>
              <Button onClick={() => navigate('/settings')}><FiSettings /></Button>
              <Button onClick={() => navigate('/ai-test')}><FiActivity /></Button>
            </FlexRow>
          </Nav>
          <FlexRow style={{ marginTop: '1rem', justifyContent: 'center' }}>
            <ModuleStatus>
              <ModuleIndicator unlocked={gameState.unlockedModules.includes('propulsion')} />
              <span>动力系统</span>
            </ModuleStatus>
            <ModuleStatus>
              <ModuleIndicator unlocked={gameState.unlockedModules.includes('navigation')} />
              <span>导航系统</span>
            </ModuleStatus>
            <ModuleStatus>
              <ModuleIndicator unlocked={gameState.unlockedModules.includes('weapons')} />
              <span>武器系统</span>
            </ModuleStatus>
            <ModuleStatus>
              <ModuleIndicator unlocked={gameState.unlockedModules.includes('life-support')} />
              <span>生命维持系统</span>
            </ModuleStatus>
          </FlexRow>
        </Header>
      )}
      
      <ContentContainer>{children}</ContentContainer>
      
      {showFooter && (
        <Footer>
          <p>© 2080 太空科学探索协会 | 当前飞船系统状态: {gameState.failedAttempts > 3 ? '警告' : '稳定'}</p>
        </Footer>
      )}
    </AppContainer>
  );
};