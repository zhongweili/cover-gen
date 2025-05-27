import type { DmxApiConfig } from '../types/api';

export class ConfigManager {
  private readonly STORAGE_KEY = 'dmx_api_config';

  async saveConfig(config: DmxApiConfig): Promise<void> {
    // 简单加密存储
    const encrypted = btoa(JSON.stringify(config));
    localStorage.setItem(this.STORAGE_KEY, encrypted);
  }

  async loadConfig(): Promise<DmxApiConfig | null> {
    try {
      const encrypted = localStorage.getItem(this.STORAGE_KEY);
      if (!encrypted) return null;

      const decrypted = atob(encrypted);
      return JSON.parse(decrypted);
    } catch {
      return null;
    }
  }

  clearConfig(): void {
    localStorage.removeItem(this.STORAGE_KEY);
  }
} 
