import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { FiCode, FiHeart, FiShield } from 'react-icons/fi';
import { useGameContext } from '../context/GameContext';
import { Card, Button, Heading, Text, FlexColumn, SubHeading, ConsoleText } from './StyledComponents';
import { AIPersonalityMode } from '../types/game';

const PersonalityCard = styled(Card)<{ selected: boolean }>`
  cursor: pointer;
  transition: all 0.3s ease;
  transform: ${props => props.selected ? 'translateY(-10px)' : 'none'};
  border: 2px solid ${props => props.selected ? props.theme.colors.secondary : 'rgba(255, 255, 255, 0.1)'};
  
  &:hover {
    transform: translateY(-5px);
    border-color: ${props => props.theme.colors.secondary};
  }
`;

const IconWrapper = styled.div`
  font-size: 2rem;
  margin-bottom: 1rem;
  color: ${props => props.theme.colors.secondary};
`;

const DemoQuestion = styled.div`
  margin-top: 2rem;
  padding: 1rem;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 5px;
`;

const ResponseContainer = styled.div`
  margin-top: 1rem;
  padding: 1rem;
  border-left: 3px solid ${props => props.theme.colors.secondary};
`;

interface AIResponse {
  scientific: string;
  cute: string;
  military: string;
}

export const Level1PersonalitySelector = () => {
  const navigate = useNavigate();
  const { gameState, setPersonality, completeLevel, unlockModule } = useGameContext();
  const [selectedMode, setSelectedMode] = useState<AIPersonalityMode | null>(null);
  const [showResponse, setShowResponse] = useState(false);
  
  const handleSelect = (mode: AIPersonalityMode) => {
    setSelectedMode(mode);
  };
  
  const handleConfirm = () => {
    if (selectedMode) {
      setPersonality(selectedMode);
      setShowResponse(true);
    }
  };
  
  const handleCompleteLevel = () => {
    completeLevel(1);
    unlockModule('propulsion');
    
    // 添加延迟，让用户有时间看到完成信息
    setTimeout(() => {
      navigate('/level/2');
    }, 1500);
  };
  
  const aiResponses: AIResponse = {
    scientific: "木星的大红斑是一个持续了至少400年的巨大风暴系统。它是木星大气中的一个高压区域，直径约为地球的1.3倍。根据最近的研究（Smith et al., 2018），这个风暴的持续性源于木星独特的大气层结构和快速自转。风速可达到650公里/小时，而颜色则来自于大气中复杂的化学物质，如磷、硫和碳氢化合物的相互作用。",
    cute: "喔哇！木星的大红斑就像一个超~级~大的太空漩涡！🌪️✨ 它比我们整个地球都要大呢！而且它已经旋转了好几百年了，像一个永不停止的宇宙棒棒糖！🍭 科学家们认为它是由于超强大的风暴造成的，风速快得能把你的头发吹得乱七八糟！💨😵‍💫 它之所以是红色的，可能是因为里面有一些特殊的化学物质在玩调色盘游戏！🎨",
    military: "木星大红斑：持续400+年的大型风暴系统。直径：地球的1.3倍。风速：650km/h。组成：含磷、硫、碳氢化合物的大气形成红色。战略意义：无。航行警告：建议所有太空舰艇避开该区域。完毕。"
  };
  
  return (
    <div>
      <Heading>AI人格实验室</Heading>
      <Text>
        为了确保飞船AI系统能够以最适合您的方式提供信息，请选择一种交互人格模式。
        这将决定AI如何回应您的问题和指令。
      </Text>
      
      <FlexColumn>
        <PersonalityCard
          selected={selectedMode === 'scientific'}
          onClick={() => handleSelect('scientific')}
        >
          <IconWrapper><FiCode /></IconWrapper>
          <SubHeading>科学探索模式</SubHeading>
          <Text>
            严谨详实的回答，引用最新研究结论，提供深入的科学解释。
            适合需要准确信息和研究依据的任务。
          </Text>
        </PersonalityCard>
        
        <PersonalityCard
          selected={selectedMode === 'cute'}
          onClick={() => handleSelect('cute')}
        >
          <IconWrapper><FiHeart /></IconWrapper>
          <SubHeading>萌趣导航员</SubHeading>
          <Text>
            活泼友好的交互风格，使用表情符号和拟人化语言，
            内容更加生动有趣，易于理解。
          </Text>
        </PersonalityCard>
        
        <PersonalityCard
          selected={selectedMode === 'military'}
          onClick={() => handleSelect('military')}
        >
          <IconWrapper><FiShield /></IconWrapper>
          <SubHeading>战斗警戒模式</SubHeading>
          <Text>
            简短精确的指令式回答，专注于关键信息传递，
            减少冗余内容，高效执行任务。
          </Text>
        </PersonalityCard>
      </FlexColumn>
      
      <Button 
        disabled={!selectedMode}
        onClick={handleConfirm}
        style={{ marginTop: '1rem' }}
      >
        确认选择
      </Button>
      
      {showResponse && (
        <DemoQuestion>
          <SubHeading>测试问题：木星为什么有大红斑？</SubHeading>
          <ResponseContainer>
            <ConsoleText>
              {selectedMode && aiResponses[selectedMode]}
            </ConsoleText>
          </ResponseContainer>
          <Button 
            onClick={handleCompleteLevel}
            variant="success"
            style={{ marginTop: '1rem' }}
          >
            确认AI人格设置并继续 →
          </Button>
        </DemoQuestion>
      )}
    </div>
  );
};