import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { FiCode, FiHeart, FiShield } from 'react-icons/fi';
import { useGameContext } from '../context/GameContext';
import { Card, Button, Heading, Text, FlexRow, SubHeading, ConsoleText } from './StyledComponents';
import { AIPersonalityMode } from '../types/game';

const PersonalityCard = styled(Card)<{ selected?: boolean }>`
  flex: 1;
  min-width: 250px;
  margin-bottom: 1rem;
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.4);
  }
`;

const IconWrapper = styled.div`
  font-size: 2rem;
  margin-bottom: 1rem;
  color: ${props => props.theme.colors.secondary};
`;

const ResponseContainer = styled.div`
  margin-top: 1rem;
  padding: 1rem;
  border-left: 3px solid ${props => props.theme.colors.secondary};
  position: relative;
`;

const CardsContainer = styled(FlexRow)`
  flex-wrap: wrap;
  gap: 1.5rem;
  justify-content: space-between;
  
  @media (max-width: 992px) {
    flex-direction: column;
  }
`;

const ResponseMatchingCard = styled(Card)<{ selected: boolean, correct?: boolean, incorrect?: boolean }>`
  margin-bottom: 1rem;
  cursor: pointer;
  transition: all 0.3s ease;
  border: 2px solid ${props => 
    props.correct ? props.theme.colors.success : 
    props.incorrect ? props.theme.colors.error : 
    props.selected ? props.theme.colors.secondary : 'rgba(255, 255, 255, 0.1)'};

  &:hover {
    border-color: ${props => props.theme.colors.secondary};
  }
`;

const ResponseLabel = styled.div`
  position: absolute;
  top: 0.5rem;
  right: 0.5rem;
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  background: ${props => props.theme.colors.primary};
  font-size: 0.75rem;
  font-weight: bold;
`;

const MatchingOptions = styled.div`
  display: flex;
  gap: 0.5rem;
  margin-top: 0.5rem;
`;

const MatchingButton = styled(Button)<{ selected?: boolean, correct?: boolean, incorrect?: boolean }>`
  padding: 0.25rem 0.5rem;
  font-size: 0.8rem;
  background: ${props => 
    props.correct ? props.theme.colors.success : 
    props.incorrect ? props.theme.colors.error : 
    props.selected ? props.theme.colors.secondary : props.theme.colors.primary};
  opacity: ${props => props.selected ? 1 : 0.7};
  
  &:hover {
    opacity: 0.9;
  }
`;

const SystemPromptCard = styled(Card)`
  margin-top: 1rem;
  margin-bottom: 1rem;
  background: rgba(0, 0, 0, 0.3);
  border-left: 3px solid ${props => props.theme.colors.secondary};
`;

interface AIResponse {
  scientific: string;
  cute: string;
  military: string;
}

interface AISystemPrompt {
  text: string;
  explanation: string;
}

type ResponseID = 'response1' | 'response2' | 'response3';

interface ShuffledResponse {
  id: ResponseID;
  text: string;
  originalType: AIPersonalityMode;
  selectedType?: AIPersonalityMode;
  isCorrect?: boolean;
}

export const Level1PersonalitySelector = () => {
  const navigate = useNavigate();
  const { completeLevel, unlockModule } = useGameContext();
  const [showMatching, setShowMatching] = useState(false);
  const [shuffledResponses, setShuffledResponses] = useState<ShuffledResponse[]>([]);
  const [matchingCompleted, setMatchingCompleted] = useState(false);
  const [allCorrect, setAllCorrect] = useState(false);
  const [showSystemPrompts, setShowSystemPrompts] = useState(false);
  
  const aiResponses: AIResponse = {
    scientific: "木星的大红斑是一个持续了至少400年的巨大风暴系统。它是木星大气中的一个高压区域，直径约为地球的1.3倍。根据最近的研究（Smith et al., 2018），这个风暴的持续性源于木星独特的大气层结构和快速自转。风速可达到650公里/小时，而颜色则来自于大气中复杂的化学物质，如磷、硫和碳氢化合物的相互作用。",
    cute: "喔哇！木星的大红斑就像一个超~级~大的太空漩涡！🌪️✨ 它比我们整个地球都要大呢！而且它已经旋转了好几百年了，像一个永不停止的宇宙棒棒糖！🍭 科学家们认为它是由于超强大的风暴造成的，风速快得能把你的头发吹得乱七八糟！💨😵‍💫 它之所以是红色的，可能是因为里面有一些特殊的化学物质在玩调色盘游戏！🎨",
    military: "木星大红斑：持续400+年的大型风暴系统。直径：地球的1.3倍。风速：650km/h。组成：含磷、硫、碳氢化合物的大气形成红色。战略意义：无。航行警告：建议所有太空舰艇避开该区域。完毕。"
  };

  const personalityDescriptions = {
    scientific: "科学探索模式：严谨详实的回答，引用最新研究结论，提供深入的科学解释。",
    cute: "萌趣导航员：活泼友好的交互风格，使用表情符号和拟人化语言，内容生动有趣。",
    military: "战斗警戒模式：简短精确的指令式回答，专注于关键信息传递，减少冗余内容。"
  };
  
  const systemPrompts: Record<AIPersonalityMode, AISystemPrompt> = {
    scientific: {
      text: "你是一位认真严谨的科学顾问。请以学术和专业的方式回答问题，提供准确、基于事实的信息，并在适当的情况下引用相关研究或数据。使用专业术语，但确保解释复杂概念。保持客观，避免使用表情符号或过于口语化的表达。回答应当全面而深入，关注科学细节和准确性。",
      explanation: "这个系统提示让AI采用学术风格，强调准确性和专业性，引导AI提供有深度的科学解释和引用相关研究。"
    },
    cute: {
      text: "你是一个超级可爱、友好的助手！请用活泼、热情的语气回答问题，加入大量表情符号😊和拟人化的描述。把复杂的概念变成有趣的比喻，用生动形象的方式解释事物。不要害怕使用感叹号！或者一些俏皮的词汇~用亲切友好的口吻和用户交流，就像在和好朋友聊天一样！",
      explanation: "这个系统提示让AI采用活泼可爱的风格，使用大量表情符号和拟人化语言，将严肃的科学概念转化为生动有趣的解释。"
    },
    military: {
      text: "你是一个军事通讯专家。以简短、直接、精确的方式回答所有问题。使用简明扼要的句子，避免不必要的修饰词。回答应结构化、分点列出，优先提供最关键的信息。末尾说'完毕'表示回答结束。任何时候都保持专业、高效的沟通风格，就像在战场通讯中一样。",
      explanation: "这个系统提示让AI采用军事风格的通讯方式，简短精确，结构化地呈现信息，没有多余的修饰，只关注最核心的要点。"
    }
  };
  
  const startMatchingGame = () => {
    // Create shuffled responses
    const responses: ShuffledResponse[] = [
      { id: 'response1', text: aiResponses.scientific, originalType: 'scientific' },
      { id: 'response2', text: aiResponses.cute, originalType: 'cute' },
      { id: 'response3', text: aiResponses.military, originalType: 'military' }
    ];
    
    // Fisher-Yates shuffle algorithm
    for (let i = responses.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [responses[i], responses[j]] = [responses[j], responses[i]];
    }
    
    setShuffledResponses(responses);
    setShowMatching(true);
  };
  
  const handleSelectMatch = (responseId: ResponseID, personalityType: AIPersonalityMode) => {
    setShuffledResponses(prev => 
      prev.map(resp => 
        resp.id === responseId 
          ? { ...resp, selectedType: personalityType } 
          : resp
      )
    );
  };
  
  const handleCheckMatches = () => {
    // Check if all responses have a selected type
    if (!shuffledResponses.every(resp => resp.selectedType)) {
      return; // Don't proceed if not all responses have been matched
    }
    
    // Check if matches are correct
    const updatedResponses = shuffledResponses.map(resp => ({
      ...resp,
      isCorrect: resp.selectedType === resp.originalType
    }));
    
    setShuffledResponses(updatedResponses);
    setMatchingCompleted(true);
    
    const allMatchesCorrect = updatedResponses.every(resp => resp.isCorrect);
    setAllCorrect(allMatchesCorrect);
  };
  
  const handleCompleteLevel = () => {
    completeLevel(1);
    unlockModule('propulsion')
    navigate('/level/2');
  };
  
  const resetMatching = () => {
    setShuffledResponses(shuffledResponses.map(resp => ({ ...resp, selectedType: undefined, isCorrect: undefined })));
    setMatchingCompleted(false);
    setAllCorrect(false);
    setShowSystemPrompts(false);
  };

  const revealSystemPrompts = () => {
    setShowSystemPrompts(true);
  };
  
  return (
    <div>
      <Heading>AI提示实验室</Heading>
      <Text>
        即使是相同的AI模型，使用不同的系统提示（System Prompt）也会产生完全不同的回答风格和内容。
        在这个实验中，您将了解系统提示如何影响AI的表现。
      </Text>
      
      {!showMatching ? (
        <>
          <SubHeading>系统提示的力量</SubHeading>
          <Text>
            下面是一个匹配挑战：我们将展示同一个AI模型对同一个问题的三种不同回答方式，
            每种回答都使用了不同的系统提示。您需要将每个回答匹配到正确的AI风格类型。
          </Text>
          <Button 
            onClick={startMatchingGame}
            variant="primary"
            style={{ marginTop: '1rem' }}
          >
            开始测试
          </Button>
        </>
      ) : (
        <>
          <SubHeading>将回答匹配到正确的AI风格</SubHeading>
          <Text>问题：木星为什么有大红斑？</Text>
          
          {shuffledResponses.map((response, index) => (
            <ResponseMatchingCard 
              key={response.id}
              selected={!!response.selectedType}
              correct={matchingCompleted && response.isCorrect}
              incorrect={matchingCompleted && !response.isCorrect}
            >
              <SubHeading>回答 {index + 1}</SubHeading>
              <ConsoleText>{response.text}</ConsoleText>
              
              <MatchingOptions>
                <Text>选择风格类型：</Text>
                {(['scientific', 'cute', 'military'] as AIPersonalityMode[]).map(type => (
                  <MatchingButton
                    key={type}
                    onClick={() => !matchingCompleted && handleSelectMatch(response.id, type)}
                    selected={response.selectedType === type}
                    correct={matchingCompleted && response.selectedType === type && response.isCorrect}
                    incorrect={matchingCompleted && response.selectedType === type && !response.isCorrect}
                    disabled={matchingCompleted}
                    variant={type === 'scientific' ? 'primary' : type === 'cute' ? 'primary' : 'secondary'}
                  >
                    {type === 'scientific' ? '科学探索' : type === 'cute' ? '萌趣导航员' : '战斗警戒'}
                  </MatchingButton>
                ))}
                {matchingCompleted && (
                  <ResponseLabel>
                    {response.isCorrect ? '✓ 正确' : `✗ 应为: ${
                      response.originalType === 'scientific' ? '科学探索' : 
                      response.originalType === 'cute' ? '萌趣导航员' : '战斗警戒'
                    }`}
                  </ResponseLabel>
                )}
              </MatchingOptions>
            </ResponseMatchingCard>
          ))}
          
          {!matchingCompleted ? (
            <Button 
              onClick={handleCheckMatches}
              disabled={!shuffledResponses.every(resp => resp.selectedType)}
              style={{ marginTop: '1rem' }}
              variant="primary"
            >
              检查答案
            </Button>
          ) : (
            <>
              {allCorrect ? (
                <>
                  <Text style={{ color: 'green', fontWeight: 'bold' }}>
                    恭喜！您正确地识别了不同的AI风格。这些风格差异实际上来自于不同的系统提示（System Prompt）！
                  </Text>
                  {!showSystemPrompts ? (
                    <Button 
                      onClick={revealSystemPrompts}
                      variant="primary"
                      style={{ marginTop: '1rem' }}
                    >
                      查看背后的系统提示
                    </Button>
                  ) : (
                    <>
                      <SubHeading style={{ marginTop: '1.5rem' }}>系统提示的秘密</SubHeading>
                      <Text>
                        下面是产生三种不同回答风格的系统提示。系统提示是给AI模型的隐藏指令，用户看不到，但会极大地影响AI的回答方式。
                        同一个AI模型，只需更改这些提示，就能呈现完全不同的个性和专业领域。
                      </Text>
                      
                      <CardsContainer>
                        <PersonalityCard>
                          <IconWrapper><FiCode /></IconWrapper>
                          <SubHeading>科学探索模式</SubHeading>
                          <SystemPromptCard>
                            <ConsoleText>{systemPrompts.scientific.text}</ConsoleText>
                          </SystemPromptCard>
                          <Text>{systemPrompts.scientific.explanation}</Text>
                        </PersonalityCard>
                        
                        <PersonalityCard>
                          <IconWrapper><FiHeart /></IconWrapper>
                          <SubHeading>萌趣导航员</SubHeading>
                          <SystemPromptCard>
                            <ConsoleText>{systemPrompts.cute.text}</ConsoleText>
                          </SystemPromptCard>
                          <Text>{systemPrompts.cute.explanation}</Text>
                        </PersonalityCard>
                        
                        <PersonalityCard>
                          <IconWrapper><FiShield /></IconWrapper>
                          <SubHeading>战斗警戒模式</SubHeading>
                          <SystemPromptCard>
                            <ConsoleText>{systemPrompts.military.text}</ConsoleText>
                          </SystemPromptCard>
                          <Text>{systemPrompts.military.explanation}</Text>
                        </PersonalityCard>
                      </CardsContainer>
                      
                      <Text style={{ marginTop: '1rem' }}>
                        这种系统提示的技巧在AI互动中非常重要。通过调整系统提示，您可以将AI从普通助手转变为专业顾问、创意伙伴或任何您需要的角色。
                        在后续关卡中，您将学习更多关于如何有效设计和使用提示词的技巧！
                      </Text>
                      
                      <Button 
                        onClick={handleCompleteLevel}
                        variant="success"
                        style={{ marginTop: '1.5rem' }}
                      >
                        进入下一关 →
                      </Button>
                    </>
                  )}
                </>
              ) : (
                <>
                  <Text style={{ color: 'orange' }}>
                    部分匹配不正确。请尝试理解每种AI风格的特点。
                  </Text>
                  <Button 
                    onClick={resetMatching}
                    style={{ marginTop: '1rem' }}
                    variant="warning"
                  >
                    重新尝试
                  </Button>
                </>
              )}
            </>
          )}
        </>
      )}
    </div>
  );
};