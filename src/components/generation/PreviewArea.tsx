import React from 'react';
import { motion } from 'framer-motion';
import { Download, Copy, RotateCcw, Sparkles, Clock, AlertTriangle, RefreshCw } from 'lucide-react';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';

interface PreviewAreaProps {
  isGenerating: boolean;
  progress: number;
  results: string[];
  error: string | null;
  onRegenerate: () => void;
  onDownload: (url: string) => void;
  onCopy: (url: string) => void;
}

export const PreviewArea: React.FC<PreviewAreaProps> = ({
  isGenerating,
  progress,
  results,
  error,
  onRegenerate,
  onDownload,
  onCopy
}) => {
  // 解析错误类型
  const getErrorType = (errorMessage: string | null) => {
    if (!errorMessage) return 'unknown';
    if (errorMessage.includes('超时')) return 'timeout';
    if (errorMessage.includes('访问被拒绝') || errorMessage.includes('403')) return 'forbidden';
    if (errorMessage.includes('验证失败') || errorMessage.includes('401')) return 'unauthorized';
    if (errorMessage.includes('频率过高') || errorMessage.includes('429')) return 'rate_limit';
    if (errorMessage.includes('参数错误') || errorMessage.includes('400')) return 'bad_request';
    if (errorMessage.includes('服务器错误') || errorMessage.includes('500')) return 'server_error';
    if (errorMessage.includes('网络') || errorMessage.includes('CORS')) return 'network';
    return 'api_error';
  };

  // 获取错误图标和颜色
  const getErrorDisplay = (errorType: string) => {
    switch (errorType) {
      case 'timeout':
        return { icon: '⏱️', color: 'bg-yellow-100 text-yellow-600', title: '请求超时' };
      case 'forbidden':
        return { icon: '🔒', color: 'bg-red-100 text-red-600', title: '访问被拒绝' };
      case 'unauthorized':
        return { icon: '🔑', color: 'bg-orange-100 text-orange-600', title: 'API Key 无效' };
      case 'rate_limit':
        return { icon: '⚡', color: 'bg-purple-100 text-purple-600', title: '请求过于频繁' };
      case 'network':
        return { icon: '🌐', color: 'bg-blue-100 text-blue-600', title: '网络连接问题' };
      case 'server_error':
        return { icon: '🔧', color: 'bg-gray-100 text-gray-600', title: '服务器错误' };
      default:
        return { icon: '❌', color: 'bg-red-100 text-red-600', title: '生成失败' };
    }
  };

  // Empty State
  if (!isGenerating && results.length === 0 && !error) {
    return (
      <Card className="min-h-[500px] lg:min-h-[600px] flex flex-col items-center justify-center text-center">
        <div className="w-20 h-20 bg-gradient-primary rounded-full flex items-center justify-center mb-6">
          <Sparkles className="w-10 h-10 text-white" />
        </div>
        <h3 className="text-h3 text-gray-900 mb-4">开始创作你的封面</h3>
        <p className="text-gray-600 max-w-md leading-relaxed">
          在左侧输入描述，点击生成即可看到AI为你创作的精美封面
        </p>
        <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-md text-sm text-gray-500">
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-primary rounded-full"></div>
            <span>支持中文描述</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-primary rounded-full"></div>
            <span>AI智能生成</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-primary rounded-full"></div>
            <span>微信尺寸适配</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-primary rounded-full"></div>
            <span>一键下载使用</span>
          </div>
        </div>
      </Card>
    );
  }

  // Loading State
  if (isGenerating) {
    return (
      <Card className="min-h-[500px] lg:min-h-[600px] flex flex-col items-center justify-center text-center">
        <div className="w-20 h-20 bg-gradient-primary rounded-full flex items-center justify-center mb-6 animate-pulse">
          <Clock className="w-10 h-10 text-white" />
        </div>
        <h3 className="text-h3 text-gray-900 mb-4">AI正在为你创作封面...</h3>
        <p className="text-gray-600 mb-6">
          OpenAI 模型预计需要 1-2 分钟，SeedDream 模型约 10-20 秒
        </p>
        
        {/* Progress Bar */}
        <div className="w-80 bg-gray-200 rounded-full h-3 mb-3">
          <motion.div
            className="bg-gradient-primary h-3 rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.5 }}
          />
        </div>
        <p className="text-sm text-gray-500 font-medium">{Math.round(progress)}%</p>
        
        <div className="mt-8 text-xs text-gray-400 max-w-sm">
          <p>正在调用 AI 模型生成您的专属封面，请耐心等待...</p>
          <p className="mt-2">如果超时，系统会自动提示，您可以重新尝试</p>
        </div>
      </Card>
    );
  }

  // Error State
  if (error) {
    const errorType = getErrorType(error);
    const errorDisplay = getErrorDisplay(errorType);
    
    return (
      <Card className="min-h-[500px] lg:min-h-[600px] flex flex-col items-center justify-center text-center">
        <div className={`w-20 h-20 rounded-full flex items-center justify-center mb-6 ${errorDisplay.color}`}>
          <span className="text-3xl">{errorDisplay.icon}</span>
        </div>
        
        <h3 className="text-h3 text-gray-900 mb-4">{errorDisplay.title}</h3>
        
        <div className="max-w-lg mb-6">
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 text-left">
            <div className="flex items-start space-x-3">
              <AlertTriangle className="w-5 h-5 text-orange-500 mt-0.5 flex-shrink-0" />
              <div className="flex-1">
                <div className="text-sm text-gray-700 leading-relaxed whitespace-pre-line">
                  {error}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <Button onClick={onRegenerate} variant="primary">
            <RefreshCw className="w-4 h-4 mr-2" />
            重新生成
          </Button>
          
          {errorType === 'timeout' && (
            <Button 
              onClick={() => window.open('https://www.dmxapi.cn', '_blank')} 
              variant="outline"
            >
              检查 API 状态
            </Button>
          )}
          
          {(errorType === 'forbidden' || errorType === 'unauthorized') && (
            <Button 
              onClick={() => window.open('https://www.dmxapi.cn', '_blank')} 
              variant="outline"
            >
              管理 API Key
            </Button>
          )}
        </div>
        
        <div className="text-xs text-gray-400 max-w-md space-y-2">
          {errorType === 'timeout' && (
            <div className="bg-blue-50 border border-blue-200 rounded p-3 text-blue-700">
              <p className="font-medium">💡 超时解决建议：</p>
              <p>• OpenAI 模型处理时间较长，已延长至 2 分钟超时</p>
              <p>• 可尝试使用 SeedDream 3.0 模型，速度更快</p>
              <p>• 简化提示词可能有助于加快生成速度</p>
            </div>
          )}
          
          {errorType === 'forbidden' && (
            <div className="bg-yellow-50 border border-yellow-200 rounded p-3 text-yellow-700">
              <p className="font-medium">🔑 权限问题解决：</p>
              <p>• 检查 DMX API 账户是否有足够余额</p>
              <p>• 确认是否有对应模型的使用权限</p>
              <p>• OpenAI 模型可能需要特殊权限，建议先试用 SeedDream</p>
            </div>
          )}
          
          {errorType === 'network' && (
            <div className="bg-green-50 border border-green-200 rounded p-3 text-green-700">
              <p className="font-medium">🌐 网络问题解决：</p>
              <p>• 检查网络连接是否正常</p>
              <p>• 尝试刷新页面重新配置</p>
              <p>• 如果是 CORS 错误，可使用"跳过验证"功能</p>
            </div>
          )}
          
          <p className="text-center">
            如果问题持续出现，请联系技术支持或查看 
            <button 
              onClick={() => window.open('https://www.dmxapi.cn/docs', '_blank')}
              className="text-primary hover:underline ml-1"
            >
              API 文档
            </button>
          </p>
        </div>
      </Card>
    );
  }

  // Results State
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Sparkles className="w-5 h-5 text-primary" />
          <h3 className="text-h3 text-gray-900">生成完成！</h3>
        </div>
        <div className="flex space-x-2">
          <Button onClick={onRegenerate} variant="secondary" size="sm">
            <RotateCcw className="w-4 h-4 mr-2" />
            重新生成
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {results.map((imageUrl, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className="overflow-hidden hover-lift">
              <div className="aspect-[900/388] bg-gray-100 rounded-lg overflow-hidden mb-4">
                <img
                  src={imageUrl}
                  alt={`生成的封面 ${index + 1}`}
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </div>
              
              <div className="flex space-x-2">
                <Button
                  onClick={() => onCopy(imageUrl)}
                  variant="secondary"
                  size="sm"
                  className="flex-1"
                >
                  <Copy className="w-4 h-4 mr-2" />
                  复制链接
                </Button>
                <Button
                  onClick={() => onDownload(imageUrl)}
                  size="sm"
                  className="flex-1"
                >
                  <Download className="w-4 h-4 mr-2" />
                  下载
                </Button>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>

      {results.length > 1 && (
        <div className="text-center">
          <Button
            onClick={() => {
              results.forEach((url, index) => {
                setTimeout(() => onDownload(url), index * 100);
              });
            }}
            variant="outline"
          >
            <Download className="w-4 h-4 mr-2" />
            批量下载全部
          </Button>
        </div>
      )}
    </div>
  );
}; 
