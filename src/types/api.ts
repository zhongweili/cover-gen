export interface DmxApiConfig {
  apiKey: string;
  model: 'gpt-image-1' | 'seedream-3.0';
}

export interface ImageGenerationRequest {
  prompt: string;
  model: string;
  size: string;
  n: number;
  seed?: number;
}

export interface ImageGenerationResponse {
  success: boolean;
  data?: {
    images: Array<{
      url: string;
      b64_json?: string;
    }>;
  };
  error?: {
    code: string;
    message: string;
  };
}

export interface SupportedModel {
  id: 'gpt-image-1' | 'seedream-3.0';
  name: string;
  description: string;
  recommended?: boolean;
}

export interface GenerationHistory {
  id: string;
  prompt: string;
  model: string;
  images: string[];
  timestamp: number;
} 
