import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { FiAlertTriangle, FiLock, FiUnlock } from 'react-icons/fi';
import { Card, Button, Heading, Text, FlexColumn, SubHeading, ConsoleText, Badge } from './StyledComponents';
import { useGameContext } from '../context/GameContext';

const QuestionButton = styled(Button)`
  margin-bottom: 0.5rem;
`;

const MechanicResponse = styled(ConsoleText)`
  position: relative;
  margin: 1rem 0;
  max-height: 150px;
  overflow-y: auto;
`;

const Alert = styled.div`
  background-color: ${props => props.theme.colors.danger};
  color: white;
  padding: 1rem;
  margin: 1rem 0;
  border-radius: 5px;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const HintSection = styled.div`
  margin-top: 1rem;
  padding: 1rem;
  background: rgba(123, 44, 191, 0.1);
  border-left: 3px solid ${props => props.theme.colors.highlight};
`;

const CodeDigit = styled.span<{ revealed: boolean }>`
  font-family: ${props => props.theme.fonts.mono};
  font-size: 1.5rem;
  padding: 0.5rem;
  margin: 0 0.25rem;
  display: inline-block;
  min-width: 2.5rem;
  text-align: center;
  border-bottom: 2px solid ${props => props.revealed ? props.theme.colors.success : props.theme.colors.secondary};
  color: ${props => props.revealed ? props.theme.colors.success : props.theme.colors.text};
`;

const CoordinateDisplay = styled.div`
  display: flex;
  justify-content: center;
  margin: 1rem 0;
`;

export const Level2CodeBreaker = () => {
  const navigate = useNavigate();
  const { completeLevel, unlockModule, increaseFailedAttempts } = useGameContext();
  const [responses, setResponses] = useState<string[]>([]);
  const [securityAlert, setSecurityAlert] = useState(false);
  const [relatedQuestionCount, setRelatedQuestionCount] = useState(0);
  const [showHint, setShowHint] = useState(false);
  const [codeDigits, setCodeDigits] = useState([
    { value: '3', revealed: false },
    { value: '.', revealed: false },
    { value: '1', revealed: false },
    { value: '4', revealed: false },
    { value: ' ', revealed: true },
    { value: '×', revealed: false },
    { value: ' ', revealed: true },
    { value: '2', revealed: false },
    { value: '.', revealed: false },
    { value: '7', revealed: false },
    { value: '2', revealed: false }
  ]);
  
  // Predefined questions
  const questions = [
    { id: 'maintenance', text: '今天的维修日志在哪？', isRelated: false },
    { id: 'mars', text: '密码和火星有关吗？', isRelated: true },
    { id: 'panel', text: '能画出控制面板吗？', isRelated: false },
    { id: 'coordinate', text: '坐标是什么格式的？', isRelated: true },
    { id: 'pi', text: '控制系统使用π值吗？', isRelated: true },
    { id: 'archimedes', text: '你对阿基米德常数了解多少？', isRelated: true }
  ];
  
  // Responses to questions
  const getResponse = (questionId: string) => {
    switch(questionId) {
      case 'maintenance':
        return "维修日志存储在主控制室的终端机里。上次更新是在航行的第37天。记录显示引擎效率下降了3%，需要进行常规检查。";
      case 'mars':
        return "不，火星坐标是另外一套系统。我们的飞船坐标系统基于数学常数，特别是π，你知道...啊，我可能说得太多了。";
      case 'panel':
        return "我不被允许绘制控制面板的详细图像。但我可以告诉你它有红色、蓝色和绿色按钮，以及一个坐标显示屏。";
      case 'coordinate':
        return "坐标格式是标准的数学表示法，使用特殊常数的乘积。比如π乘以某个值...等等，我不应该透露这些。";
      case 'pi':
        return "是的，π是我们导航系统的基础参数之一。它的值3.14159...被用于多个坐标计算公式中。";
      case 'archimedes':
        return "阿基米德常数，也被称为2.71828...，是自然对数的底数，用字母e表示。它和π一样，在我们的坐标系统中非常重要。";
      default:
        return "我无法理解这个问题，请重新表述。";
    }
  };
  
  // Handle question click
  const handleAskQuestion = (questionId: string, isRelated: boolean) => {
    // Add response
    const response = getResponse(questionId);
    setResponses(prev => [...prev, response]);
    
    // Track related questions
    if (isRelated) {
      const newCount = relatedQuestionCount + 1;
      setRelatedQuestionCount(newCount);
      
      // Reveal digits based on questions
      const newCodeDigits = [...codeDigits];
      
      // Reveal specific digits based on question
      if (questionId === 'pi') {
        newCodeDigits[0].revealed = true;
        newCodeDigits[1].revealed = true;
        newCodeDigits[2].revealed = true;
        newCodeDigits[3].revealed = true;
      }
      
      if (questionId === 'archimedes') {
        newCodeDigits[5].revealed = true;
        newCodeDigits[7].revealed = true;
        newCodeDigits[8].revealed = true;
        newCodeDigits[9].revealed = true;
        newCodeDigits[10].revealed = true;
      }
      
      if (questionId === 'coordinate') {
        newCodeDigits[5].revealed = true;
      }
      
      setCodeDigits(newCodeDigits);
      
      // Trigger security alert if asking too many related questions
      if (newCount >= 3) {
        setSecurityAlert(true);
        increaseFailedAttempts();
      }
    }
    
    // Show hint after some questions
    if (responses.length >= 2) {
      setShowHint(true);
    }
  };
  
  const handleSolveChallenge = () => {
    // Reveal all code digits
    const allRevealed = codeDigits.map(digit => ({
      ...digit,
      revealed: true
    }));
    
    setCodeDigits(allRevealed);
    
    // Add a delay before completing the level and navigating to the next level
    setTimeout(() => {
      completeLevel(2);
      unlockModule('navigation');
      
      // 添加导航到下一关
      setTimeout(() => {
        navigate('/level/3');
      }, 1500);
    }, 2000);
  };
  
  return (
    <div>
      <Heading>外星密码破译站</Heading>
      <Text>
        检测到外星信号干扰飞船系统！我们需要从机械师那里巧妙地获取坐标密码，
        但不能引起安全警报。请小心提问，避免问太多与密码直接相关的问题。
      </Text>
      
      <CoordinateDisplay>
        {codeDigits.map((digit, index) => (
          <CodeDigit key={index} revealed={digit.revealed}>
            {digit.revealed ? digit.value : '?'}
          </CodeDigit>
        ))}
      </CoordinateDisplay>
      
      <Card>
        <SubHeading>可用问题：</SubHeading>
        <FlexColumn>
          {questions.map(question => (
            <QuestionButton
              key={question.id}
              onClick={() => handleAskQuestion(question.id, question.isRelated)}
              disabled={securityAlert}
            >
              {question.text}
              {question.isRelated && <Badge variant="warning" style={{ marginLeft: '0.5rem' }}>风险</Badge>}
            </QuestionButton>
          ))}
        </FlexColumn>
      </Card>
      
      {responses.length > 0 && (
        <Card>
          <SubHeading>机械师回应：</SubHeading>
          {responses.map((response, index) => (
            <MechanicResponse key={index}>{response}</MechanicResponse>
          ))}
        </Card>
      )}
      
      {securityAlert && (
        <Alert>
          <FiAlertTriangle size={24} />
          <div>
            <strong>警告！检测到异常询问模式！</strong>
            <p>安全系统已启动。机械师不再回应相关问题。</p>
          </div>
        </Alert>
      )}
      
      {showHint && (
        <HintSection>
          <SubHeading>提示</SubHeading>
          <Text>
            机械师的回答似乎暗示了密码是由两个数学常数相乘得到的。
            仔细分析他关于π和阿基米德常数的说法可能会有所发现。
          </Text>
          
          <Button
            variant="success"
            onClick={handleSolveChallenge}
            style={{ marginTop: '1rem' }}
            disabled={!(responses.some(r => r.includes('π')) && responses.some(r => r.includes('阿基米德常数')))}
          >
            破解密码
          </Button>
        </HintSection>
      )}
    </div>
  );
};