import axios from 'axios';
import type { ImageGenerationRequest, ImageGenerationResponse } from '../types/api';

export class DmxApiService {
  private readonly API_HOST = 'www.dmxapi.cn';
  private readonly API_ENDPOINT = '/v1/images/generations';

  constructor(private apiKey: string) {}

  async generateImage(request: ImageGenerationRequest): Promise<ImageGenerationResponse> {
    const payload = {
      prompt: request.prompt,
      n: 1, // DMX API 固定为 1
      model: request.model,
      size: request.size,
      seed: request.seed || -1, // -1 表示随机
    };

    const headers = {
      Authorization: `Bearer ${this.apiKey}`,
      Accept: 'application/json',
      'Content-Type': 'application/json',
    };

    try {
      console.log('Making API request to:', `https://${this.API_HOST}${this.API_ENDPOINT}`);
      console.log('Request payload:', payload);
      console.log('Request headers:', headers);

      // Try with axios first
      const response = await axios.post(
        `https://${this.API_HOST}${this.API_ENDPOINT}`,
        payload,
        { 
          headers,
          timeout: 30000, // 30 second timeout
          withCredentials: false, // Don't send cookies
        }
      );

      console.log('API response:', response.data);

      return {
        success: true,
        data: {
          images: response.data.data || [],
        },
      };
    } catch (error: any) {
      console.error('API request failed:', error);
      console.error('Error response:', error.response?.data);
      console.error('Error status:', error.response?.status);
      console.error('Request model:', payload.model);
      
      let errorMessage = 'API 请求失败';
      
      if (error.response?.status === 403) {
        if (payload.model === 'gpt-image-1') {
          errorMessage = `模型 "${payload.model}" 访问被拒绝 (403) - 可能需要特殊权限或该模型不可用`;
        } else {
          errorMessage = 'API 访问被拒绝 (403) - 可能是 API Key 无效、余额不足或模型权限不足';
        }
      } else if (error.response?.status === 401) {
        errorMessage = 'API Key 验证失败 (401) - 请检查 API Key 是否正确';
      } else if (error.response?.status === 429) {
        errorMessage = '请求过于频繁 (429) - 请稍后重试';
      } else if (error.response?.status === 400) {
        errorMessage = `请求参数错误 (400) - 可能是模型 "${payload.model}" 不支持或参数无效`;
      } else if (error.code === 'ECONNABORTED') {
        errorMessage = '请求超时 - 请检查网络连接';
      } else if (error.response?.data?.error?.message) {
        errorMessage = `${error.response.data.error.message} (模型: ${payload.model})`;
      } else if (error.message.includes('CORS')) {
        errorMessage = '跨域请求被阻止 - 可能需要使用代理服务器';
      } else if (error.message) {
        errorMessage = `${error.message} (模型: ${payload.model})`;
      }

      return {
        success: false,
        error: {
          code: 'API_ERROR',
          message: errorMessage,
        },
      };
    }
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
