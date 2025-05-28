export interface ImageResult {
  url: string;
  b64_json?: string;
}

export interface GenerationState {
  isGenerating: boolean;
  progress: number;
  error: string | null;
  results: ImageResult[];
}

export interface AppConfig {
  apiKey: string;
  selectedModel: string;
  isConfigured: boolean;
}

export interface PromptTemplate {
  id: string;
  name: string;
  description: string;
  template: string;
  category: string;
} 
