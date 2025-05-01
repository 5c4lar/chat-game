import { useState } from 'react';
import { Layout } from '../components/Layout';
import { 
  Heading, 
  SubHeading, 
  Text, 
  Card, 
  Button, 
  FlexRow 
} from '../components/StyledComponents';
import { useGameContext } from '../context/GameContext';
import styled from 'styled-components';

const SettingRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin: 1rem 0;
  padding: 0.75rem 0;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
`;

const SettingLabel = styled.div`
  font-weight: 600;
`;

const ToggleSwitch = styled.label`
  position: relative;
  display: inline-block;
  width: 60px;
  height: 30px;
  
  input {
    opacity: 0;
    width: 0;
    height: 0;
    
    &:checked + span {
      background-color: ${props => props.theme.colors.primary};
    }
    
    &:checked + span:before {
      transform: translateX(30px);
    }
  }
  
  span {
    position: absolute;
    cursor: pointer;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(255, 255, 255, 0.2);
    transition: 0.3s;
    border-radius: 34px;
    
    &:before {
      position: absolute;
      content: "";
      height: 22px;
      width: 22px;
      left: 4px;
      bottom: 4px;
      background-color: white;
      transition: 0.3s;
      border-radius: 50%;
    }
  }
`;

export const SettingsPage = () => {
  const { resetGame } = useGameContext();
  const [settings, setSettings] = useState({
    sound: true,
    animations: true,
    difficulty: 'normal',
    language: '中文'
  });
  
  const handleSoundToggle = () => {
    setSettings(prev => ({ ...prev, sound: !prev.sound }));
  };
  
  const handleAnimationsToggle = () => {
    setSettings(prev => ({ ...prev, animations: !prev.animations }));
  };
  
  const handleDifficultyChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSettings(prev => ({ ...prev, difficulty: e.target.value }));
  };
  
  const handleLanguageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSettings(prev => ({ ...prev, language: e.target.value }));
  };
  
  return (
    <Layout>
      <Heading>游戏设置</Heading>
      
      <Card>
        <SubHeading>个性化设置</SubHeading>
        
        <SettingRow>
          <SettingLabel>声音效果</SettingLabel>
          <ToggleSwitch>
            <input 
              type="checkbox"
              checked={settings.sound}
              onChange={handleSoundToggle}
            />
            <span></span>
          </ToggleSwitch>
        </SettingRow>
        
        <SettingRow>
          <SettingLabel>动画效果</SettingLabel>
          <ToggleSwitch>
            <input 
              type="checkbox"
              checked={settings.animations}
              onChange={handleAnimationsToggle}
            />
            <span></span>
          </ToggleSwitch>
        </SettingRow>
        
        <SettingRow>
          <SettingLabel>难度设置</SettingLabel>
          <select 
            value={settings.difficulty}
            onChange={handleDifficultyChange}
            style={{
              padding: '0.5rem',
              backgroundColor: 'rgba(0, 0, 0, 0.3)',
              color: 'white',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              borderRadius: '4px'
            }}
          >
            <option value="easy">简单</option>
            <option value="normal">普通</option>
            <option value="hard">困难</option>
          </select>
        </SettingRow>
        
        <SettingRow>
          <SettingLabel>语言</SettingLabel>
          <select 
            value={settings.language}
            onChange={handleLanguageChange}
            style={{
              padding: '0.5rem',
              backgroundColor: 'rgba(0, 0, 0, 0.3)',
              color: 'white',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              borderRadius: '4px'
            }}
          >
            <option value="中文">中文</option>
            <option value="English">English</option>
          </select>
        </SettingRow>
      </Card>
      
      <Card>
        <SubHeading>游戏数据</SubHeading>
        <Text>
          重置游戏将清除所有进度，包括已完成的关卡和解锁的成就。此操作无法撤销。
        </Text>
        <Button 
          variant="danger" 
          onClick={resetGame}
          style={{ marginTop: '1rem' }}
        >
          重置游戏数据
        </Button>
      </Card>
    </Layout>
  );
};