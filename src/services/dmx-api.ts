import axios from 'axios';
import type { ImageGenerationRequest, ImageGenerationResponse } from '../types/api';

export class DmxApiService {
  private readonly API_HOST = 'www.dmxapi.cn';
  private readonly API_ENDPOINT = '/v1/images/generations';

  // 不同模型的超时配置（毫秒）
  private readonly MODEL_TIMEOUTS = {
    'gpt-image-1': 120000,    // OpenAI 模型：2分钟
    'seedream-3.0': 60000,    // SeedDream 模型：1分钟
  };

  // 默认超时时间
  private readonly DEFAULT_TIMEOUT = 90000; // 1.5分钟

  constructor(private apiKey: string) {}

  private getTimeoutForModel(model: string): number {
    return this.MODEL_TIMEOUTS[model as keyof typeof this.MODEL_TIMEOUTS] || this.DEFAULT_TIMEOUT;
  }

  private formatTimeoutMessage(model: string, timeoutMs: number): string {
    const timeoutSeconds = Math.round(timeoutMs / 1000);
    const modelNames = {
      'gpt-image-1': 'OpenAI GPT-4o Image',
      'seedream-3.0': 'SeedDream 3.0'
    };
    const modelName = modelNames[model as keyof typeof modelNames] || model;
    
    return `${modelName} 模型生成超时（${timeoutSeconds}秒）- 该模型处理时间较长，请稍后重试`;
  }

  async generateImage(request: ImageGenerationRequest): Promise<ImageGenerationResponse> {
    const payload = {
      prompt: request.prompt,
      n: 1, // DMX API 固定为 1
      model: request.model,
      size: request.size,
      seed: request.seed || -1, // -1 表示随机
    };

    const timeout = this.getTimeoutForModel(request.model);
    
    const headers = {
      Authorization: `Bearer ${this.apiKey}`,
      Accept: 'application/json',
      'Content-Type': 'application/json',
    };

    try {
      console.log('Making API request to:', `https://${this.API_HOST}${this.API_ENDPOINT}`);
      console.log('Request payload:', payload);
      console.log('Request timeout:', `${timeout}ms (${Math.round(timeout/1000)}s)`);
      console.log('Request headers:', headers);

      // 显示开始时间用于调试
      const startTime = Date.now();
      console.log('Request started at:', new Date(startTime).toISOString());

      const response = await axios.post(
        `https://${this.API_HOST}${this.API_ENDPOINT}`,
        payload,
        { 
          headers,
          timeout,
          withCredentials: false,
        }
      );

      const endTime = Date.now();
      const duration = endTime - startTime;
      console.log('Request completed in:', `${duration}ms (${Math.round(duration/1000)}s)`);
      console.log('API response:', response.data);

      return {
        success: true,
        data: {
          images: response.data.data || [],
        },
      };
    } catch (error: any) {
      const endTime = Date.now();
      console.error('API request failed:', error);
      console.error('Error response:', error.response?.data);
      console.error('Error status:', error.response?.status);
      console.error('Error code:', error.code);
      console.error('Request model:', payload.model);
      console.error('Request duration before error:', `${endTime - Date.now()}ms`);
      
      let errorMessage = this.getDetailedErrorMessage(error, payload.model, timeout);
      
      return {
        success: false,
        error: {
          code: this.getErrorCode(error),
          message: errorMessage,
        },
      };
    }
  }

  private getErrorCode(error: any): string {
    if (error.code === 'ECONNABORTED') return 'TIMEOUT';
    if (error.response?.status === 403) return 'FORBIDDEN';
    if (error.response?.status === 401) return 'UNAUTHORIZED';
    if (error.response?.status === 429) return 'RATE_LIMIT';
    if (error.response?.status === 400) return 'BAD_REQUEST';
    if (error.response?.status >= 500) return 'SERVER_ERROR';
    if (error.message?.includes('CORS')) return 'CORS_ERROR';
    if (error.message?.includes('Network')) return 'NETWORK_ERROR';
    return 'API_ERROR';
  }

  private getDetailedErrorMessage(error: any, model: string, timeout: number): string {
    const modelNames = {
      'gpt-image-1': 'OpenAI GPT-4o Image',
      'seedream-3.0': 'SeedDream 3.0'
    };
    const modelName = modelNames[model as keyof typeof modelNames] || model;

    // 超时错误
    if (error.code === 'ECONNABORTED') {
      return this.formatTimeoutMessage(model, timeout);
    }

    // HTTP 状态码错误
    if (error.response?.status === 403) {
      if (model === 'gpt-image-1') {
        return `${modelName} 模型访问被拒绝 - 该模型可能需要特殊权限或账户升级。建议：\n1. 检查账户是否有 OpenAI 模型权限\n2. 尝试使用 SeedDream 3.0 模型\n3. 联系 DMX API 客服确认权限`;
      } else {
        return `${modelName} 模型访问被拒绝 - 可能原因：\n1. API Key 无效或过期\n2. 账户余额不足\n3. 模型权限不足\n请检查 API Key 和账户状态`;
      }
    }

    if (error.response?.status === 401) {
      return `API Key 验证失败 - 请检查：\n1. API Key 是否正确输入\n2. API Key 是否已过期\n3. 是否有足够的账户权限`;
    }

    if (error.response?.status === 429) {
      return `请求频率过高 - 请稍等片刻后重试。如果问题持续，可能需要升级账户套餐`;
    }

    if (error.response?.status === 400) {
      return `请求参数错误 - ${modelName} 模型可能不支持当前参数设置，请检查：\n1. 提示词是否符合要求\n2. 图片尺寸是否支持\n3. 模型是否可用`;
    }

    if (error.response?.status >= 500) {
      return `DMX API 服务器错误 (${error.response.status}) - 服务暂时不可用，请稍后重试`;
    }

    // 网络相关错误
    if (error.message?.includes('CORS')) {
      return `跨域请求被阻止 - 浏览器安全限制，建议：\n1. 使用 "跳过验证直接保存" 功能\n2. 或联系技术支持配置代理`;
    }

    if (error.message?.includes('Network') || error.message?.includes('timeout')) {
      return `网络连接问题 - 请检查：\n1. 网络连接是否正常\n2. 是否能访问 ${this.API_HOST}\n3. 防火墙是否阻止了请求`;
    }

    // API 返回的具体错误信息
    if (error.response?.data?.error?.message) {
      return `${modelName} 模型错误：${error.response.data.error.message}`;
    }

    // 通用错误
    if (error.message) {
      return `${modelName} 模型请求失败：${error.message}`;
    }

    return `${modelName} 模型生成失败，请稍后重试`;
  }

  async validateApiKey(): Promise<boolean> {
    try {
      // For now, we'll skip actual validation due to CORS/User-Agent restrictions
      // and just check if the API key format looks valid
      console.log('Validating API key format...');
      
      if (!this.apiKey || this.apiKey.trim().length < 10) {
        console.log('API key appears to be too short');
        return false;
      }
      
      // Basic format check - DMX API keys typically start with certain patterns
      if (!this.apiKey.startsWith('sk-') && !this.apiKey.includes('-')) {
        console.log('API key format may be invalid');
        return false;
      }
      
      console.log('API key format appears valid');
      return true;
    } catch (error) {
      console.warn('API validation failed:', error);
      return false;
    }
  }
} 
