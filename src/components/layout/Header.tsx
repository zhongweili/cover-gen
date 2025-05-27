import React, { useState } from 'react';
import { Palette, X, BookOpen, Users, Sparkles, Shield, Zap } from 'lucide-react';

// 使用指南模态框
const GuideModal: React.FC<{ isOpen: boolean; onClose: () => void }> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b">
          <div className="flex items-center space-x-2">
            <BookOpen className="w-6 h-6 text-primary" />
            <h2 className="text-xl font-semibold text-gray-900">使用指南</h2>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X className="w-6 h-6" />
          </button>
        </div>
        
        <div className="p-6 space-y-6">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-3">🚀 快速开始</h3>
            <ol className="space-y-2 text-gray-600">
              <li><strong>1. 配置 API Key</strong> - 在左侧面板输入您的 DMX API Key</li>
              <li><strong>2. 选择 AI 模型</strong> - 推荐使用 SeedDream 3.0，支持中文更佳</li>
              <li><strong>3. 描述封面需求</strong> - 详细描述您想要的封面风格、内容、色彩</li>
              <li><strong>4. 设置生成数量</strong> - 选择生成 1-4 张封面供您选择</li>
              <li><strong>5. 开始生成</strong> - 点击生成按钮，等待 AI 为您创作</li>
            </ol>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-3">💡 使用技巧</h3>
            <div className="space-y-3">
              <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <h4 className="font-medium text-blue-900 mb-1">描述要详细</h4>
                <p className="text-sm text-blue-700">包含风格、色彩、元素、情感等具体描述，如"现代简约风格，蓝色渐变背景，包含科技元素"</p>
              </div>
              <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                <h4 className="font-medium text-green-900 mb-1">使用智能模板</h4>
                <p className="text-sm text-green-700">点击"智能提示词"可以快速选择预设的风格模板，节省时间</p>
              </div>
              <div className="p-3 bg-purple-50 border border-purple-200 rounded-lg">
                <h4 className="font-medium text-purple-900 mb-1">多次尝试</h4>
                <p className="text-sm text-purple-700">如果结果不满意，可以调整描述后重新生成，每次都会有不同的创意</p>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-3">🔧 常见问题</h3>
            <div className="space-y-3">
              <div>
                <h4 className="font-medium text-gray-900">Q: API 验证失败怎么办？</h4>
                <p className="text-sm text-gray-600 mt-1">可以点击"跳过验证直接保存"，然后尝试生成图片测试连接。</p>
              </div>
              <div>
                <h4 className="font-medium text-gray-900">Q: 哪个模型效果更好？</h4>
                <p className="text-sm text-gray-600 mt-1">SeedDream 3.0 对中文理解更佳，推荐优先使用。OpenAI 模型质量更高但可能需要特殊权限。</p>
              </div>
              <div>
                <h4 className="font-medium text-gray-900">Q: 生成失败怎么办？</h4>
                <p className="text-sm text-gray-600 mt-1">检查 API Key 是否正确、账户余额是否充足，或尝试简化提示词描述。</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// 关于我们模态框
const AboutModal: React.FC<{ isOpen: boolean; onClose: () => void }> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b">
          <div className="flex items-center space-x-2">
            <Users className="w-6 h-6 text-primary" />
            <h2 className="text-xl font-semibold text-gray-900">关于我们</h2>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X className="w-6 h-6" />
          </button>
        </div>
        
        <div className="p-6 space-y-6">
          <div className="text-center">
            <div className="w-16 h-16 bg-gradient-primary rounded-full flex items-center justify-center mx-auto mb-4">
              <Palette className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">封面大师 Cover Master</h3>
            <p className="text-gray-600">专业的微信公众号封面 AI 生成工具</p>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-3">🎯 产品愿景</h3>
            <p className="text-gray-600 leading-relaxed">
              我们致力于为内容创作者提供最简单、最智能的封面设计解决方案。通过先进的 AI 技术，
              让每个人都能轻松创作出专业级的微信公众号封面，释放创意潜能。
            </p>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-3">✨ 核心优势</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-start space-x-3">
                <Sparkles className="w-5 h-5 text-primary mt-1" />
                <div>
                  <h4 className="font-medium text-gray-900">AI 智能生成</h4>
                  <p className="text-sm text-gray-600">基于先进的 AI 模型，理解您的需求并生成专业封面</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <Zap className="w-5 h-5 text-primary mt-1" />
                <div>
                  <h4 className="font-medium text-gray-900">快速高效</h4>
                  <p className="text-sm text-gray-600">15-30秒即可生成多个设计方案，大幅提升工作效率</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <Shield className="w-5 h-5 text-primary mt-1" />
                <div>
                  <h4 className="font-medium text-gray-900">安全可靠</h4>
                  <p className="text-sm text-gray-600">数据加密存储，保护您的隐私和创作内容</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <BookOpen className="w-5 h-5 text-primary mt-1" />
                <div>
                  <h4 className="font-medium text-gray-900">简单易用</h4>
                  <p className="text-sm text-gray-600">直观的界面设计，无需专业技能即可上手使用</p>
                </div>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-3">🤝 技术支持</h3>
            <div className="bg-gray-50 rounded-lg p-4">
              <p className="text-gray-600 mb-3">
                本产品基于 DMX API 提供的 AI 服务，确保稳定可靠的图像生成能力。
              </p>
              <div className="flex flex-wrap gap-2">
                <span className="px-3 py-1 bg-primary/10 text-primary text-sm rounded-full">React 18</span>
                <span className="px-3 py-1 bg-primary/10 text-primary text-sm rounded-full">TypeScript</span>
                <span className="px-3 py-1 bg-primary/10 text-primary text-sm rounded-full">Tailwind CSS</span>
                <span className="px-3 py-1 bg-primary/10 text-primary text-sm rounded-full">DMX API</span>
              </div>
            </div>
          </div>

          <div className="text-center pt-4 border-t">
            <p className="text-sm text-gray-500">
              © 2025 封面大师 Cover Master. 让创作更简单
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export const Header: React.FC = () => {
  const [showGuide, setShowGuide] = useState(false);
  const [showAbout, setShowAbout] = useState(false);

  return (
    <>
      <header className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo and Brand */}
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-primary rounded-lg flex items-center justify-center">
                <Palette className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">封面大师</h1>
                <p className="text-xs text-gray-500">Cover Master</p>
              </div>
            </div>

            {/* Navigation */}
            <nav className="flex items-center space-x-6">
              <button 
                onClick={() => setShowGuide(true)}
                className="text-gray-600 hover:text-primary transition-colors"
              >
                使用指南
              </button>
              <button 
                onClick={() => setShowAbout(true)}
                className="text-gray-600 hover:text-primary transition-colors"
              >
                关于我们
              </button>
            </nav>
          </div>
        </div>
      </header>

      {/* Modals */}
      <GuideModal isOpen={showGuide} onClose={() => setShowGuide(false)} />
      <AboutModal isOpen={showAbout} onClose={() => setShowAbout(false)} />
    </>
  );
}; 
