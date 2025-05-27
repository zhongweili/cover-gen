import { create } from 'zustand';
import type { DmxApiConfig, SupportedModel } from '../types/api';
import { ConfigManager } from '../services/config';
import { DmxApiService } from '../services/dmx-api';

export const supportedModels: SupportedModel[] = [
  {
    id: 'seedream-3.0',
    name: 'SeedDream 3.0',
    description: '中文理解佳，国产优选，推荐使用',
    recommended: true,
  },
  {
    id: 'gpt-image-1',
    name: 'OpenAI GPT4o Image',
    description: '最高质量，可能需要特殊权限',
  },
];

interface ConfigStore {
  config: DmxApiConfig | null;
  isConfigured: boolean;
  isValidating: boolean;
  validationError: string | null;
  
  setConfig: (config: DmxApiConfig) => void;
  loadConfig: () => Promise<void>;
  saveConfig: (config: DmxApiConfig) => Promise<void>;
  validateConfig: (config: DmxApiConfig) => Promise<boolean>;
  saveConfigWithoutValidation: (config: DmxApiConfig) => Promise<void>;
  clearConfig: () => void;
}

const configManager = new ConfigManager();

export const useConfigStore = create<ConfigStore>((set, get) => ({
  config: null,
  isConfigured: false,
  isValidating: false,
  validationError: null,

  setConfig: (config) => {
    set({ config, isConfigured: true, validationError: null });
  },

  loadConfig: async () => {
    try {
      const config = await configManager.loadConfig();
      if (config) {
        set({ config, isConfigured: true });
      }
    } catch (error) {
      console.error('Failed to load config:', error);
    }
  },

  saveConfig: async (config) => {
    try {
      await configManager.saveConfig(config);
      set({ config, isConfigured: true, validationError: null });
    } catch (error) {
      console.error('Failed to save config:', error);
    }
  },

  validateConfig: async (config) => {
    set({ isValidating: true, validationError: null });
    
    try {
      const apiService = new DmxApiService(config.apiKey);
      const isValid = await apiService.validateApiKey();
      
      if (isValid) {
        await get().saveConfig(config);
        set({ isValidating: false });
        return true;
      } else {
        set({ 
          isValidating: false, 
          validationError: 'API Key 格式验证失败。请检查 API Key 是否正确，或跳过验证直接保存进行测试。' 
        });
        return false;
      }
    } catch (error) {
      set({ 
        isValidating: false, 
        validationError: '验证过程中发生错误。建议跳过验证直接保存，然后在生成图片时测试连接。' 
      });
      return false;
    }
  },

  saveConfigWithoutValidation: async (config) => {
    try {
      await configManager.saveConfig(config);
      set({ config, isConfigured: true, validationError: null });
    } catch (error) {
      console.error('Failed to save config:', error);
    }
  },

  clearConfig: () => {
    configManager.clearConfig();
    set({ 
      config: null, 
      isConfigured: false, 
      validationError: null 
    });
  },
})); 
