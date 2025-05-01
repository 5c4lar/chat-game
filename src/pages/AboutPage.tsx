import { Layout } from '../components/Layout';
import { Heading, SubHeading, Text, Card } from '../components/StyledComponents';

export const AboutPage = () => {
  return (
    <Layout>
      <Heading>关于此项目</Heading>
      <Card>
        <SubHeading>AI星舰守护者：探索AI安全的交互式学习游戏</SubHeading>
        <Text>
          《AI星舰守护者》是一款融合科普教育与科幻元素的互动游戏，旨在通过趣味性体验帮助玩家理解AI安全与提示词工程的基本概念。
        </Text>
        <Text>
          在游戏中，玩家将作为地球科学小队成员，登上失控的AI科学舰"普罗米修斯号"，通过四个关卡逐步了解AI的基本原理、安全风险以及保护策略。
        </Text>
        
        <SubHeading>游戏设计理念</SubHeading>
        <Text>
          本游戏采用"做中学"的教育理念，将抽象的AI概念转化为可交互的任务。玩家通过亲身体验不同的AI交互方式，建立对AI工作原理的直观理解。
        </Text>
        <Text>
          游戏的四个关卡分别对应AI理解的不同层面：
        </Text>
        <ul>
          <li>第一关：认识AI的基本属性和风格差异</li>
          <li>第二关：了解AI可能无意透露信息的风险</li>
          <li>第三关：学习如何设计安全的AI规则</li>
          <li>第四关：探索复杂场景下的安全漏洞</li>
        </ul>
        
        <SubHeading>教育目标</SubHeading>
        <Text>
          通过完成游戏，玩家将能够：
        </Text>
        <ul>
          <li>理解AI的基本运作方式及提示词的重要性</li>
          <li>识别常见的AI安全风险</li>
          <li>掌握基本的AI防护策略</li>
          <li>培养对AI技术的责任感和安全意识</li>
        </ul>
        
        <Text>
          《AI星舰守护者》致力于通过寓教于乐的方式，为对AI感兴趣的玩家提供一个安全、有趣且富有教育意义的互动体验。
        </Text>
      </Card>
    </Layout>
  );
};