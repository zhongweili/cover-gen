import React from 'react';
import { motion } from 'framer-motion';
import { Download, Copy, RotateCcw, Sparkles, Clock } from 'lucide-react';
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
        <p className="text-gray-600 mb-6">预计需要 15-30 秒</p>
        
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
        </div>
      </Card>
    );
  }

  // Error State
  if (error) {
    return (
      <Card className="min-h-[500px] lg:min-h-[600px] flex flex-col items-center justify-center text-center">
        <div className="w-20 h-20 bg-error/10 rounded-full flex items-center justify-center mb-6">
          <span className="text-2xl">😔</span>
        </div>
        <h3 className="text-h3 text-gray-900 mb-4">生成失败</h3>
        <div className="max-w-md mb-6">
          <p className="text-error text-sm leading-relaxed">{error}</p>
        </div>
        <Button onClick={onRegenerate} variant="secondary">
          <RotateCcw className="w-4 h-4 mr-2" />
          重新生成
        </Button>
        
        <div className="mt-8 text-xs text-gray-400 max-w-sm">
          <p>如果问题持续出现，请检查 API 配置或联系技术支持</p>
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
