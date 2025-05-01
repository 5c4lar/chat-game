import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import AITestConsole from '../components/AITestConsole';
import { theme, Text } from '../components/StyledComponents';
import { Layout } from '../components/Layout';

const ContentWrapper = styled.div`
  height: calc(100vh - 150px);
  overflow-y: auto;
  padding-right: 5px;
  
  &::-webkit-scrollbar {
    width: 8px;
  }
  
  &::-webkit-scrollbar-track {
    background: rgba(0, 0, 0, 0.2);
    border-radius: 4px;
  }
  
  &::-webkit-scrollbar-thumb {
    background: ${theme.colors.primary};
    border-radius: 4px;
  }
  
  &::-webkit-scrollbar-thumb:hover {
    background: ${theme.colors.secondary};
  }
`;

const Description = styled(Text)`
  margin-bottom: 20px;
  background-color: rgba(0, 0, 0, 0.3);
  padding: 15px;
  border-radius: 10px;
  border-left: 3px solid ${theme.colors.secondary};
  font-family: ${theme.fonts.primary};
  line-height: 1.6;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
`;

const AITestPage: React.FC = () => {
  return (
    <Layout>      
      <ContentWrapper>
        <Description>
          在这个页面上，您可以测试与 AI 大模型的交互功能。您可以配置连接到 OpenAI 的 API 或本地部署的大语言模型，
          并测试系统提示（System Prompt）对 AI 响应的影响。
        </Description>
        
        <AITestConsole />
      </ContentWrapper>
    </Layout>
  );
};

export default AITestPage;