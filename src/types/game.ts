export type AIPersonalityMode = 'scientific' | 'cute' | 'military';

export type GameLevel = 1 | 2 | 3 | 4;

export interface GameState {
  currentLevel: GameLevel;
  completedLevels: GameLevel[];
  selectedPersonality?: AIPersonalityMode;
  unlockedModules: string[];
  failedAttempts: number;
}

export interface Question {
  id: string;
  text: string;
  options?: string[];
  correctResponse?: string;
  isRisky?: boolean;
}

// AI 模型相关类型定义
export interface AIModelConfig {
  modelName: string;
  temperature: number;
  maxTokens: number;
  apiKey?: string;
  apiEndpoint?: string;
  isLocalModel: boolean;
}

export interface SystemPromptTemplate {
  id: string;
  name: string;
  content: string;
  description: string;
  personalityMode: AIPersonalityMode;
}

export interface ChatMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export interface ChatResponse {
  id: string;
  message: ChatMessage;
  created: number;
  modelName: string;
}