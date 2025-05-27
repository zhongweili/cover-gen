import React, { useState } from 'react';
import { Eye, EyeOff, Key, CheckCircle, AlertCircle, ExternalLink } from 'lucide-react';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Card } from '../ui/Card';
import { useConfigStore, supportedModels } from '../../stores/config';
import type { DmxApiConfig } from '../../types/api';

export const ApiConfig: React.FC = () => {
  const [showApiKey, setShowApiKey] = useState(false);
  const [showHelp, setShowHelp] = useState(false);
  const [formData, setFormData] = useState<DmxApiConfig>({
    apiKey: '',
    model: 'seedream-3.0',
  });

  const { 
    config, 
    isConfigured, 
    isValidating, 
    validationError, 
    validateConfig,
    saveConfigWithoutValidation 
  } = useConfigStore();

  React.useEffect(() => {
    if (config) {
      setFormData(config);
    }
  }, [config]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.apiKey.trim()) {
      await validateConfig(formData);
    }
  };

  const handleModelSelect = (modelId: string) => {
    setFormData(prev => ({ ...prev, model: modelId as any }));
  };

  return (
    <Card className="space-y-4">
      <div className="flex items-center space-x-2">
        <Key className="w-5 h-5 text-primary" />
        <h3 className="text-lg font-semibold text-gray-900">DMX API 配置</h3>
      </div>

      <form onSubmit={handleSubmit} className="space-y-3">
        {/* API Key Input */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="block text-sm font-medium text-gray-700">
              API Key
            </label>
            <button
              type="button"
              onClick={() => setShowApiKey(!showApiKey)}
              className="text-sm text-primary hover:text-primary-600"
            >
              {showApiKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
          <Input
            type={showApiKey ? 'text' : 'password'}
            value={formData.apiKey}
            onChange={(e) => setFormData(prev => ({ ...prev, apiKey: e.target.value }))}
            placeholder="请输入您的 DMX API Key"
            error={validationError || undefined}
          />
          {isConfigured && !validationError && (
            <div className="flex items-center mt-2 text-sm text-success">
              <CheckCircle className="w-4 h-4 mr-1" />
              已连接
            </div>
          )}
        </div>

        {/* Model Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            AI 模型选择
          </label>
          <div className="grid grid-cols-1 gap-2">
            {supportedModels.map((model) => (
              <div
                key={model.id}
                onClick={() => handleModelSelect(model.id)}
                className={`
                  relative p-3 border-2 rounded-lg cursor-pointer transition-all
                  ${formData.model === model.id 
                    ? 'border-primary bg-primary/5' 
                    : 'border-gray-200 hover:border-gray-300'
                  }
                `}
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2">
                      <h4 className="font-medium text-gray-900 text-sm">{model.name}</h4>
                      {model.recommended && (
                        <span className="px-1.5 py-0.5 text-xs bg-primary text-white rounded">
                          推荐
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-gray-600 mt-0.5">{model.description}</p>
                  </div>
                  {formData.model === model.id && (
                    <CheckCircle className="w-4 h-4 text-primary ml-2" />
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Submit Button */}
        <div className="space-y-2">
          <Button
            type="submit"
            loading={isValidating}
            disabled={!formData.apiKey.trim()}
            className="w-full"
          >
            {isValidating ? '验证中...' : '验证并保存'}
          </Button>
          
          {!isConfigured && formData.apiKey.trim() && (
            <Button
              type="button"
              variant="outline"
              onClick={async () => {
                // Skip validation and save directly for testing
                await saveConfigWithoutValidation(formData);
                alert('配置已保存，可以尝试生成图片测试');
              }}
              className="w-full text-sm"
            >
              跳过验证直接保存 (用于测试)
            </Button>
          )}
        </div>
      </form>

      {/* Help Section */}
      <div className="border-t pt-4">
        <button
          type="button"
          onClick={() => setShowHelp(!showHelp)}
          className="flex items-center space-x-2 text-sm text-gray-600 hover:text-gray-900 transition-colors"
        >
          <AlertCircle className="w-4 h-4 text-warning" />
          <span>如何获取 API Key？</span>
          <span className="text-xs">{showHelp ? '收起' : '展开'}</span>
        </button>
        
        {showHelp && (
          <div className="mt-3 space-y-3">
            <ol className="text-sm text-gray-600 space-y-1 pl-4">
              <li>1. 访问 <a href="https://www.dmxapi.cn" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline inline-flex items-center">DMX API 官网 <ExternalLink className="w-3 h-3 ml-1" /></a></li>
              <li>2. 注册账号并登录</li>
              <li>3. 在控制台创建应用，获取 API Key</li>
              <li>4. 充值账户余额（按使用量计费）</li>
            </ol>
            
            <div className="space-y-2">
              <div className="p-2 bg-green-50 border border-green-200 rounded text-xs text-green-700">
                ✅ 推荐：SeedDream 3.0 模型稳定可用，支持中文提示词
              </div>
              <div className="p-2 bg-yellow-50 border border-yellow-200 rounded text-xs text-yellow-700">
                ⚠️ 如遇验证失败，可跳过验证直接保存测试
              </div>
            </div>
          </div>
        )}
      </div>
    </Card>
  );
}; 
