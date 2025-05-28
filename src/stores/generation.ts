import { create } from 'zustand';
import type { GenerationHistory } from '../types/api';
import type { GenerationState, ImageResult } from '../types/app';
import { DmxApiService } from '../services/dmx-api';

interface GenerationStore extends GenerationState {
  history: GenerationHistory[];
  currentPrompt: string;
  generationCount: number;
  
  setPrompt: (prompt: string) => void;
  setGenerationCount: (count: number) => void;
  generateImages: (apiKey: string, model: string, prompt: string, count: number) => Promise<void>;
  addToHistory: (item: GenerationHistory) => void;
  clearHistory: () => void;
  clearResults: () => void;
}

export const useGenerationStore = create<GenerationStore>((set, get) => ({
  isGenerating: false,
  progress: 0,
  error: null,
  results: [],
  history: [],
  currentPrompt: '',
  generationCount: 1,

  setPrompt: (prompt: string) => {
    set({ currentPrompt: prompt });
  },

  setGenerationCount: (count: number) => {
    set({ generationCount: count });
  },

  generateImages: async (apiKey: string, model: string, prompt: string, count: number) => {
    set({ 
      isGenerating: true, 
      progress: 0, 
      error: null, 
      results: [] 
    });

    try {
      const apiService = new DmxApiService(apiKey);
      const results: ImageResult[] = [];

      // 生成多张图片
      for (let i = 0; i < count; i++) {
        set({ progress: (i / count) * 100 });

        const response = await apiService.generateImage({
          prompt,
          model,
          size: '900x388', // 微信公众号封面标准尺寸
          n: 1,
        });

        if (response.success && response.data?.images[0]) {
          results.push({
            url: response.data.images[0].url,
            b64_json: response.data.images[0].b64_json
          });
        } else {
          throw new Error(response.error?.message || '生成失败');
        }
      }

      // 添加到历史记录
      const historyItem: GenerationHistory = {
        id: Date.now().toString(),
        prompt,
        model,
        images: results,
        timestamp: Date.now(),
      };

      set({ 
        isGenerating: false, 
        progress: 100, 
        results,
        history: [historyItem, ...get().history]
      });

    } catch (error: any) {
      let errorMessage = '生成过程中发生错误';
      
      if (error.message) {
        errorMessage = error.message;
      } else if (error.response?.status === 403) {
        errorMessage = 'API Key 无效或账户余额不足';
      } else if (error.response?.status === 401) {
        errorMessage = 'API Key 验证失败，请检查配置';
      } else if (error.code === 'NETWORK_ERROR') {
        errorMessage = '网络连接失败，请检查网络设置';
      }
      
      set({ 
        isGenerating: false, 
        error: errorMessage,
        progress: 0 
      });
    }
  },

  addToHistory: (item: GenerationHistory) => {
    set({ history: [item, ...get().history] });
  },

  clearHistory: () => {
    set({ history: [] });
  },

  clearResults: () => {
    set({ results: [], error: null });
  },
})); 
