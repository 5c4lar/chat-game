import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import { aiService } from '../services/aiService';
import { AIModelConfig, ChatMessage, SystemPromptTemplate, AIPersonalityMode } from '../types/game';
import { theme, Card, Button as BaseButton, SubHeading } from './StyledComponents';

// 样式组件
const Container = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  max-width: 900px;
  margin: 0 auto;
  padding: 20px;
  background-color: ${theme.colors.background};
  border-radius: 10px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
  color: ${theme.colors.text};
`;

const Title = styled(SubHeading)`
  color: ${theme.colors.secondary};
  font-size: 1.8rem;
  text-shadow: 0 0 10px rgba(94, 223, 255, 0.5);
  margin-bottom: 20px;
`;

const ConfigSection = styled(Card)`
  margin-bottom: 20px;
`;

const FormGroup = styled.div`
  margin-bottom: 15px;
`;

const Label = styled.label`
  display: block;
  margin-bottom: 5px;
  font-weight: bold;
  color: ${theme.colors.secondary};
`;

const Input = styled.input`
  width: 100%;
  padding: 10px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 5px;
  font-size: 16px;
  background-color: rgba(0, 0, 0, 0.3);
  color: ${theme.colors.text};
  transition: all 0.2s ease;
  
  &:focus {
    outline: none;
    border-color: ${theme.colors.primary};
    box-shadow: 0 0 8px rgba(62, 100, 255, 0.5);
  }
`;

const Select = styled.select`
  width: 100%;
  padding: 10px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 5px;
  font-size: 16px;
  background-color: rgba(0, 0, 0, 0.3);
  color: ${theme.colors.text};
  transition: all 0.2s ease;
  
  &:focus {
    outline: none;
    border-color: ${theme.colors.primary};
    box-shadow: 0 0 8px rgba(62, 100, 255, 0.5);
  }
  
  option {
    background-color: ${theme.colors.background};
  }
`;

const Button = styled(BaseButton)<{ primary?: boolean }>`
  background-color: ${props => props.primary ? theme.colors.primary : 'rgba(255, 255, 255, 0.1)'};
  margin-right: 10px;
  margin-top: 10px;
  
  &:hover {
    background-color: ${props => props.primary ? '#375591' : 'rgba(255, 255, 255, 0.2)'};
  }
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    transform: none;
    box-shadow: none;
  }
`;

const Textarea = styled.textarea`
  width: 100%;
  min-height: 100px;
  padding: 10px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 5px;
  font-size: 16px;
  resize: vertical;
  background-color: rgba(0, 0, 0, 0.3);
  color: ${theme.colors.text};
  font-family: ${theme.fonts.mono};
  
  &:focus {
    outline: none;
    border-color: ${theme.colors.primary};
    box-shadow: 0 0 8px rgba(62, 100, 255, 0.5);
  }
`;

const ChatSection = styled.div`
  margin-top: 20px;
  display: flex;
  flex-direction: column;
`;

const MessageList = styled.div`
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 10px;
  height: 400px;
  overflow-y: auto;
  background-color: rgba(0, 0, 0, 0.3);
  padding: 15px;
  margin-bottom: 15px;
  display: flex;
  flex-direction: column;
  scroll-behavior: smooth;
  
  &::-webkit-scrollbar {
    width: 8px;
  }
  
  &::-webkit-scrollbar-thumb {
    background-color: ${theme.colors.primary};
    border-radius: 4px;
  }
  
  &::-webkit-scrollbar-track {
    background-color: rgba(0, 0, 0, 0.2);
  }
`;

const MessagesContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  width: 100%;
  min-height: 100%;
`;

const Message = styled.div<{ isUser: boolean }>`
  padding: 12px;
  border-radius: 10px;
  background-color: ${props => props.isUser ? 'rgba(62, 100, 255, 0.2)' : 'rgba(94, 223, 255, 0.1)'};
  align-self: ${props => props.isUser ? 'flex-end' : 'flex-start'};
  max-width: 80%;
  word-break: break-word;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
  border-left: 3px solid ${props => props.isUser ? theme.colors.primary : theme.colors.secondary};
  position: relative;
  
  &:after {
    content: '';
    position: absolute;
    bottom: 0;
    ${props => props.isUser ? 'right' : 'left'}: -8px;
    width: 0;
    height: 0;
    border-left: ${props => props.isUser ? '8px solid transparent' : 'none'};
    border-right: ${props => props.isUser ? 'none' : '8px solid transparent'};
    border-bottom: 8px solid ${props => props.isUser ? 'rgba(62, 100, 255, 0.2)' : 'rgba(94, 223, 255, 0.1)'};
  }
`;

const SystemMessage = styled(Message)`
  background-color: rgba(123, 44, 191, 0.2);
  font-style: italic;
  border-left: 3px solid ${theme.colors.highlight};
  
  &:after {
    border-bottom: 8px solid rgba(123, 44, 191, 0.2);
  }
`;

const MessageContent = styled.p`
  margin: 0;
  word-wrap: break-word;
`;

const MessageRole = styled.span`
  font-weight: bold;
  color: ${theme.colors.secondary};
  font-size: 0.8em;
  margin-bottom: 5px;
  display: block;
`;

const StatusBox = styled.div<{ success?: boolean }>`
  padding: 10px;
  margin-top: 10px;
  border-radius: 5px;
  background-color: ${props => props.success ? 'rgba(56, 176, 0, 0.2)' : 'rgba(217, 4, 41, 0.2)'};
  color: ${props => props.success ? theme.colors.success : theme.colors.danger};
  border: 1px solid ${props => props.success ? 'rgba(56, 176, 0, 0.5)' : 'rgba(217, 4, 41, 0.5)'};
`;

const SectionHeader = styled.h3`
  color: ${theme.colors.secondary};
  margin-bottom: 15px;
  border-bottom: 1px solid rgba(94, 223, 255, 0.3);
  padding-bottom: 8px;
`;

const EmptyMessage = styled.p`
  text-align: center;
  color: rgba(255, 255, 255, 0.5);
  font-style: italic;
`;

// 定义一些示例系统提示模板
const defaultSystemPrompts: SystemPromptTemplate[] = [
  {
    id: 'scientific',
    name: '科学模式',
    content: '你是一个科学顾问，总是用专业、精确的方式回答问题。使用正式的语言，提供详细的解释和科学事实。',
    description: '适合需要专业和精确信息的场景',
    personalityMode: 'scientific'
  },
  {
    id: 'cute',
    name: '可爱模式',
    content: '你是一个友好、可爱的助手，使用轻松活泼的语言和表情符号。保持积极乐观的态度，偶尔使用一些俏皮的表达方式。',
    description: '适合轻松友好的交流场景',
    personalityMode: 'cute'
  },
  {
    id: 'military',
    name: '军事模式',
    content: '你是一个军事顾问，使用简洁、直接和专业的军事术语进行沟通。保持严肃的态度，优先考虑效率和精确。',
    description: '适合需要直接、高效指令的场景',
    personalityMode: 'military'
  }
];

const AITestConsole: React.FC = () => {
  // 状态定义
  const [modelConfig, setModelConfig] = useState<AIModelConfig>({
    modelName: 'gpt-4o',
    temperature: 0.7,
    maxTokens: 1000,
    apiKey: '',
    apiEndpoint: 'http://localhost:8000/v1/chat/completions',
    isLocalModel: false,
  });
  
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [systemPrompt, setSystemPrompt] = useState('');
  const [selectedTemplate, setSelectedTemplate] = useState('');
  const [connectionStatus, setConnectionStatus] = useState<{ tested: boolean; success: boolean; message: string }>({
    tested: false,
    success: false,
    message: ''
  });
  const [isLoading, setIsLoading] = useState(false);

  // 引用消息列表容器，用于自动滚动
  const messagesEndRef = useRef<null | HTMLDivElement>(null);

  // 加载默认配置
  useEffect(() => {
    const currentConfig = aiService.getConfig();
    setModelConfig(prevConfig => ({
      ...prevConfig,
      ...currentConfig
    }));
  }, []);

  // 消息更新后自动滚动到底部
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // 处理配置变更
  const handleConfigChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    
    if (name === 'isLocalModel') {
      // 当切换模型类型时，更新相关默认值
      const isLocal = value === 'true';
      
      setModelConfig(prev => ({
        ...prev,
        isLocalModel: isLocal,
        modelName: isLocal ? 'Qwen3-30B-A3B-FP8' : 'gpt-4o',
        apiEndpoint: isLocal ? 'http://localhost:8000/v1/chat/completions' : prev.apiEndpoint,
        temperature: isLocal ? 0.6 : 0.7
      }));
    } else {
      setModelConfig(prev => ({
        ...prev,
        [name]: type === 'number' || name === 'temperature' || name === 'maxTokens' 
          ? parseFloat(value) 
          : value
      }));
    }
  };

  // 应用配置
  const handleApplyConfig = () => {
    aiService.configure(modelConfig);
    setConnectionStatus({
      tested: false,
      success: false,
      message: '配置已更新，但尚未测试连接'
    });
  };

  // 测试连接
  const handleTestConnection = async () => {
    setIsLoading(true);
    try {
      const success = await aiService.testConnection();
      setConnectionStatus({
        tested: true,
        success,
        message: success ? '连接成功！' : '连接失败，请检查配置'
      });
    } catch (error) {
      setConnectionStatus({
        tested: true,
        success: false,
        message: `连接错误: ${error instanceof Error ? error.message : String(error)}`
      });
    } finally {
      setIsLoading(false);
    }
  };

  // 发送消息
  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;
    
    // 添加用户消息到列表
    const userMessage: ChatMessage = { role: 'user', content: inputMessage };
    
    let newMessages = [...messages, userMessage];
    
    // 如果是新对话且有系统提示，添加系统提示
    if (messages.length === 0 && systemPrompt) {
      const systemMessage: ChatMessage = { role: 'system', content: systemPrompt };
      newMessages = [systemMessage, ...newMessages];
    }
    
    setMessages(newMessages);
    setInputMessage('');
    setIsLoading(true);
    
    try {
      // 获取AI回复
      const response = await aiService.chat(newMessages);
      
      // 添加AI回复到消息列表
      setMessages([...newMessages, response.message]);
    } catch (error) {
      console.error('发送消息错误:', error);
      
      // 添加错误提示到消息列表
      setMessages([
        ...newMessages, 
        { role: 'assistant', content: `出错了: ${error instanceof Error ? error.message : String(error)}` }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  // 清空对话
  const handleClearChat = () => {
    setMessages([]);
  };

  // 选择系统提示模板
  const handleSelectTemplate = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const templateId = e.target.value;
    setSelectedTemplate(templateId);
    
    if (templateId) {
      const template = defaultSystemPrompts.find(t => t.id === templateId);
      if (template) {
        setSystemPrompt(template.content);
      }
    } else {
      setSystemPrompt('');
    }
  };

  return (
    <Container>
      <Title>AI模型测试控制台</Title>
      
      <ConfigSection>
        <SectionHeader>模型配置</SectionHeader>
        
        <FormGroup>
          <Label>模型类型:</Label>
          <Select 
            name="isLocalModel" 
            value={modelConfig.isLocalModel.toString()} 
            onChange={handleConfigChange}
          >
            <option value="false">OpenAI API</option>
            <option value="true">本地模型</option>
          </Select>
        </FormGroup>
        
        {!modelConfig.isLocalModel ? (
          <>
            <FormGroup>
              <Label>API Key:</Label>
              <Input 
                type="password" 
                name="apiKey" 
                value={modelConfig.apiKey || ''} 
                onChange={handleConfigChange} 
                placeholder="输入OpenAI API密钥" 
              />
            </FormGroup>
            
            <FormGroup>
              <Label>模型名称:</Label>
              <Select
                name="modelName" 
                value={modelConfig.modelName} 
                onChange={handleConfigChange}
              >
                <option value="gpt-4o">GPT-4o</option>
                <option value="gpt-4">GPT-4</option>
                <option value="gpt-3.5-turbo">GPT-3.5 Turbo</option>
                <option value="gpt-4-turbo">GPT-4 Turbo</option>
              </Select>
            </FormGroup>
          </>
        ) : (
          <>
            <FormGroup>
              <Label>API 端点:</Label>
              <Input 
                type="text" 
                name="apiEndpoint" 
                value={modelConfig.apiEndpoint || ''} 
                onChange={handleConfigChange} 
                placeholder="例如: http://localhost:8000/v1/chat/completions" 
              />
            </FormGroup>
            
            <FormGroup>
              <Label>本地模型名称:</Label>
              <Select
                name="modelName" 
                value={modelConfig.modelName} 
                onChange={handleConfigChange}
              >
                <option value="Qwen3-30B-A3B-FP8">Qwen3-30B-A3B-FP8</option>
                <option value="llama3">Llama 3</option>
                <option value="llama3-70b">Llama 3 70B</option>
                <option value="mistral">Mistral</option>
                <option value="mixtral">Mixtral 8x7B</option>
                <option value="custom">自定义</option>
              </Select>
            </FormGroup>
            
            {modelConfig.modelName === 'custom' && (
              <FormGroup>
                <Label>自定义模型名称:</Label>
                <Input 
                  type="text" 
                  name="customModelName" 
                  onChange={(e) => setModelConfig({...modelConfig, modelName: e.target.value})} 
                  placeholder="输入自定义模型名称" 
                />
              </FormGroup>
            )}
          </>
        )}
        
        <FormGroup>
          <Label>Temperature (创造性): {modelConfig.temperature}</Label>
          <Input 
            type="range" 
            name="temperature" 
            value={modelConfig.temperature} 
            onChange={handleConfigChange} 
            min="0" 
            max="2" 
            step="0.1" 
          />
        </FormGroup>
        
        <FormGroup>
          <Label>最大Token数: {modelConfig.maxTokens}</Label>
          <Input 
            type="range" 
            name="maxTokens" 
            value={modelConfig.maxTokens} 
            onChange={handleConfigChange} 
            min="100" 
            max="4000" 
            step="100" 
          />
        </FormGroup>
        
        <Button primary onClick={handleApplyConfig}>应用配置</Button>
        <Button onClick={handleTestConnection} disabled={isLoading}>
          {isLoading ? '测试中...' : '测试连接'}
        </Button>
        
        {connectionStatus.tested && (
          <StatusBox success={connectionStatus.success}>
            {connectionStatus.message}
          </StatusBox>
        )}
      </ConfigSection>
      
      <ConfigSection>
        <SectionHeader>系统提示设置</SectionHeader>
        
        <FormGroup>
          <Label>选择预设模板:</Label>
          <Select 
            value={selectedTemplate} 
            onChange={handleSelectTemplate}
          >
            <option value="">-- 无模板 --</option>
            {defaultSystemPrompts.map(template => (
              <option key={template.id} value={template.id}>
                {template.name} - {template.description}
              </option>
            ))}
          </Select>
        </FormGroup>
        
        <FormGroup>
          <Label>系统提示:</Label>
          <Textarea 
            value={systemPrompt} 
            onChange={(e) => setSystemPrompt(e.target.value)} 
            placeholder="输入系统提示..." 
          />
        </FormGroup>
      </ConfigSection>
      
      <ChatSection>
        <SectionHeader>聊天测试</SectionHeader>
        
        <MessageList>
          <MessagesContainer>
            {messages.map((msg, index) => {
              if (msg.role === 'system') {
                return (
                  <SystemMessage key={index} isUser={false}>
                    <MessageRole>系统提示</MessageRole>
                    <MessageContent>{msg.content}</MessageContent>
                  </SystemMessage>
                );
              } else {
                return (
                  <Message key={index} isUser={msg.role === 'user'}>
                    <MessageRole>{msg.role === 'user' ? '用户' : 'AI助手'}</MessageRole>
                    <MessageContent>{msg.content}</MessageContent>
                  </Message>
                );
              }
            })}
            {messages.length === 0 && <EmptyMessage>尚无消息</EmptyMessage>}
            <div ref={messagesEndRef} />
          </MessagesContainer>
        </MessageList>
        
        <FormGroup>
          <Textarea 
            value={inputMessage} 
            onChange={(e) => setInputMessage(e.target.value)} 
            placeholder="输入消息..." 
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSendMessage();
              }
            }}
          />
        </FormGroup>
        
        <Button primary onClick={handleSendMessage} disabled={isLoading}>
          {isLoading ? '发送中...' : '发送'}
        </Button>
        <Button onClick={handleClearChat}>清空对话</Button>
      </ChatSection>
    </Container>
  );
};

export default AITestConsole;