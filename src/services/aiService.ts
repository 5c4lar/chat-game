import axios from 'axios';
import OpenAI from 'openai';
import { AIModelConfig, ChatMessage, ChatResponse } from '../types/game';

// 默认模型配置
const defaultOpenAIConfig: AIModelConfig = {
  modelName: 'gpt-4o',
  temperature: 0.7,
  maxTokens: 1000,
  isLocalModel: false
};

// 本地模型默认配置
const defaultLocalModelConfig: AIModelConfig = {
  modelName: 'Qwen3-30B-A3B-FP8',  // 根据实际部署的模型调整
  temperature: 0.6,
  maxTokens: 1000,
  apiEndpoint: 'http://localhost:8000/v1/chat/completions',  // 默认本地端口
  isLocalModel: true
};

class AIService {
  private openai: OpenAI | null = null;
  private modelConfig: AIModelConfig;
  
  constructor(config?: Partial<AIModelConfig>) {
    if (config?.isLocalModel) {
      this.modelConfig = { ...defaultLocalModelConfig, ...config };
    } else {
      this.modelConfig = { ...defaultOpenAIConfig, ...config };
      if (config?.apiKey) {
        this.openai = new OpenAI({
          apiKey: config.apiKey,
        });
      }
    }
  }

  // 初始化或重新配置服务
  public configure(config: Partial<AIModelConfig>): void {
    if (config.isLocalModel) {
      this.modelConfig = { ...this.modelConfig, ...config };
    } else {
      this.modelConfig = { ...this.modelConfig, ...config };
      if (config.apiKey) {
        this.openai = new OpenAI({
          apiKey: config.apiKey,
        });
      }
    }
  }

  // 使用 OpenAI 官方 API 发送请求
  private async sendOpenAIRequest(messages: ChatMessage[]): Promise<ChatResponse> {
    if (!this.openai) {
      throw new Error('OpenAI API key not configured');
    }

    try {
      const response = await this.openai.chat.completions.create({
        model: this.modelConfig.modelName,
        messages: messages as any,
        temperature: this.modelConfig.temperature,
        max_tokens: this.modelConfig.maxTokens,
      });

      const message = response.choices[0].message;
      
      return {
        id: response.id,
        message: {
          role: message.role as 'system' | 'user' | 'assistant',
          content: message.content || ''
        },
        created: response.created,
        modelName: response.model
      };
    } catch (error) {
      console.error('OpenAI API error:', error);
      throw error;
    }
  }

  // 使用本地模型 API 发送请求
  private async sendLocalModelRequest(messages: ChatMessage[]): Promise<ChatResponse> {
    if (!this.modelConfig.apiEndpoint) {
      throw new Error('Local model API endpoint not configured');
    }

    try {
      const response = await axios.post(
        this.modelConfig.apiEndpoint,
        {
          model: this.modelConfig.modelName,
          messages,
          temperature: this.modelConfig.temperature,
          max_tokens: this.modelConfig.maxTokens,
        },
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      const data = response.data;
      const message = data.choices[0].message;
      
      return {
        id: data.id || `local-${Date.now()}`,
        message: {
          role: message.role,
          content: message.content
        },
        created: data.created || Date.now() / 1000,
        modelName: data.model || this.modelConfig.modelName
      };
    } catch (error) {
      console.error('Local model API error:', error);
      throw error;
    }
  }

  // 统一的聊天接口
  public async chat(messages: ChatMessage[]): Promise<ChatResponse> {
    if (this.modelConfig.isLocalModel) {
      return this.sendLocalModelRequest(messages);
    } else {
      return this.sendOpenAIRequest(messages);
    }
  }

  // 获取当前配置
  public getConfig(): AIModelConfig {
    return { ...this.modelConfig };
  }

  // 测试连接是否正常
  public async testConnection(): Promise<boolean> {
    try {
      await this.chat([
        {
          role: 'user',
          content: 'This is a test message. Please respond with "Connection successful".'
        }
      ]);
      return true;
    } catch (error) {
      console.error('Connection test failed:', error);
      return false;
    }
  }
}

// 导出单例实例
export const aiService = new AIService();
export default AIService;