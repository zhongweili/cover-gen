import axios from 'axios';
import type { ImageGenerationRequest, ImageGenerationResponse } from '../types/api';
import { convertToWeChatCover, getImageDimensions } from '../utils/image-processor';

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

  // 支持的尺寸列表（按优先级排序）
  private readonly SUPPORTED_SIZES = [
    '900x388',    // 微信公众号标准尺寸（首选）
    '1024x1024',  // 标准方形尺寸（备用）
    '512x512',    // 小尺寸备用
  ];

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
    // 首先尝试使用请求的尺寸
    let response = await this.tryGenerateWithSize(request, request.size);
    
    // 如果失败且是尺寸相关错误，尝试备用尺寸
    if (!response.success && this.isSizeRelatedError(response.error?.message)) {
      console.log('Original size failed, trying fallback sizes...');
      
      for (const fallbackSize of this.SUPPORTED_SIZES) {
        if (fallbackSize === request.size) continue; // 跳过已经尝试过的尺寸
        
        console.log(`Trying fallback size: ${fallbackSize}`);
        response = await this.tryGenerateWithSize(request, fallbackSize);
        
        if (response.success) {
          // 如果使用了备用尺寸且不是目标尺寸，需要进行图片处理
          if (fallbackSize !== '900x388' && request.size === '900x388') {
            response = await this.processImageToTargetSize(response, '900x388');
          }
          break;
        }
      }
    }
    
    return response;
  }

  /**
   * 尝试使用指定尺寸生成图片
   */
  private async tryGenerateWithSize(request: ImageGenerationRequest, size: string): Promise<ImageGenerationResponse> {
    const payload = {
      prompt: request.prompt,
      n: 1, // DMX API 固定为 1
      model: request.model,
      size: size,
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

      // 处理不同模型的响应格式
      const processedImages = await this.processImageResponse(response.data.data || [], request.model);

      return {
        success: true,
        data: {
          images: processedImages,
        },
      };
    } catch (error: any) {
      console.error('API request failed:', error);
      console.error('Error response:', error.response?.data);
      console.error('Error status:', error.response?.status);
      console.error('Error code:', error.code);
      console.error('Request model:', payload.model);
      console.error('Request size:', payload.size);
      
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

  /**
   * 检查错误是否与尺寸相关
   */
  private isSizeRelatedError(errorMessage?: string): boolean {
    if (!errorMessage) return false;
    const sizeKeywords = ['size', '尺寸', 'dimension', 'resolution', 'width', 'height'];
    return sizeKeywords.some(keyword => errorMessage.toLowerCase().includes(keyword));
  }

  /**
   * 将图片处理为目标尺寸
   */
  private async processImageToTargetSize(
    response: ImageGenerationResponse, 
    targetSize: string
  ): Promise<ImageGenerationResponse> {
    if (!response.success || !response.data?.images[0]) {
      return response;
    }

    try {
      const image = response.data.images[0];
      const originalUrl = image.url;
      
      console.log(`Processing image from original size to ${targetSize}`);
      
      // 检查原始图片尺寸
      const dimensions = await getImageDimensions(originalUrl);
      console.log('Original image dimensions:', dimensions);
      
      // 如果已经是目标尺寸，直接返回
      if (targetSize === '900x388' && dimensions.width === 900 && dimensions.height === 388) {
        console.log('Image already has correct dimensions');
        return response;
      }
      
      // 转换为微信封面尺寸
      if (targetSize === '900x388') {
        const processedUrl = await convertToWeChatCover(originalUrl, 0.9);
        
        return {
          success: true,
          data: {
            images: [{
              url: processedUrl,
              b64_json: image.b64_json // 保留原始 base64 数据
            }]
          }
        };
      }
      
      return response;
    } catch (error) {
      console.error('Image processing failed:', error);
      // 如果处理失败，返回原始图片
      return response;
    }
  }

  /**
   * 处理不同模型的图片响应格式
   * SeedDream: 直接返回 URL
   * OpenAI: 返回 base64 数据，需要转换为 blob URL
   */
  private async processImageResponse(images: any[], model: string): Promise<Array<{ url: string; b64_json?: string }>> {
    console.log('Processing images for model:', model);
    console.log('Raw images data:', images);

    const processedImages: Array<{ url: string; b64_json?: string }> = [];

    for (const image of images) {
      try {
        if (image.url) {
          // SeedDream 模型：直接使用 URL
          console.log('Found direct URL for image:', image.url);
          processedImages.push({
            url: image.url,
            b64_json: image.b64_json
          });
        } else if (image.b64_json) {
          // OpenAI 模型：将 base64 转换为 blob URL
          console.log('Converting base64 to blob URL for OpenAI model');
          const blobUrl = this.base64ToBlobUrl(image.b64_json);
          processedImages.push({
            url: blobUrl,
            b64_json: image.b64_json
          });
        } else {
          console.warn('Image data missing both url and b64_json:', image);
        }
      } catch (error) {
        console.error('Error processing image:', error, image);
      }
    }

    console.log('Processed images:', processedImages);
    return processedImages;
  }

  /**
   * 将 base64 图片数据转换为 blob URL
   */
  private base64ToBlobUrl(base64Data: string): string {
    try {
      // 移除 data URL 前缀（如果存在）
      const base64String = base64Data.replace(/^data:image\/[a-z]+;base64,/, '');
      
      // 将 base64 转换为二进制数据
      const binaryString = atob(base64String);
      const bytes = new Uint8Array(binaryString.length);
      
      for (let i = 0; i < binaryString.length; i++) {
        bytes[i] = binaryString.charCodeAt(i);
      }
      
      // 创建 blob
      const blob = new Blob([bytes], { type: 'image/png' });
      
      // 创建 blob URL
      const blobUrl = URL.createObjectURL(blob);
      
      console.log('Successfully converted base64 to blob URL:', blobUrl);
      return blobUrl;
    } catch (error) {
      console.error('Error converting base64 to blob URL:', error);
      // 如果转换失败，返回 data URL 作为备用
      return `data:image/png;base64,${base64Data}`;
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
      // 检查是否是尺寸相关的错误
      const errorMsg = error.response?.data?.error?.message || '';
      if (errorMsg.includes('size') || errorMsg.includes('尺寸') || errorMsg.includes('dimension')) {
        return `图片尺寸不支持 - ${modelName} 模型可能不支持 900×388 尺寸。建议：\n1. 联系 DMX API 确认支持的尺寸\n2. 可能需要使用标准尺寸如 1024×1024\n3. 或考虑后期裁剪处理\n\n原始错误：${errorMsg}`;
      }
      return `请求参数错误 - ${modelName} 模型可能不支持当前参数设置，请检查：\n1. 提示词是否符合要求\n2. 图片尺寸是否支持\n3. 模型是否可用\n\n详细错误：${errorMsg}`;
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
