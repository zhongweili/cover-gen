import React, { useState } from 'react';
import { Edit3, Lightbulb, Wand2 } from 'lucide-react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';

interface PromptTemplate {
  id: string;
  name: string;
  template: string;
  category: string;
}

const promptTemplates: PromptTemplate[] = [
  {
    id: '1',
    name: '商务风格',
    template: '现代商务风格的微信公众号封面，简洁专业，蓝色调，包含文字区域',
    category: '商务'
  },
  {
    id: '2',
    name: '科技感',
    template: '科技感十足的封面设计，渐变背景，几何元素，未来感，适合科技类文章',
    category: '科技'
  },
  {
    id: '3',
    name: '温馨生活',
    template: '温馨的生活类封面，暖色调，手绘风格，温暖舒适的感觉',
    category: '生活'
  },
  {
    id: '4',
    name: '教育培训',
    template: '教育培训类封面，书本元素，知识传递，专业可信，清新简洁',
    category: '教育'
  }
];

interface PromptInputProps {
  value: string;
  onChange: (value: string) => void;
  onGenerate: () => void;
  isGenerating: boolean;
  disabled: boolean;
}

export const PromptInput: React.FC<PromptInputProps> = ({
  value,
  onChange,
  onGenerate,
  isGenerating,
  disabled
}) => {
  const [showTemplates, setShowTemplates] = useState(false);

  const handleTemplateSelect = (template: PromptTemplate) => {
    onChange(template.template);
    setShowTemplates(false);
  };

  return (
    <Card className="space-y-3">
      <div className="flex items-center space-x-2">
        <Edit3 className="w-5 h-5 text-primary" />
        <h3 className="text-lg font-semibold text-gray-900">描述你的封面</h3>
      </div>

      <div>
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="详细描述你想要的封面内容、风格、色彩等要求..."
          className="w-full h-32 px-4 py-3 border-2 border-gray-200 rounded-lg resize-none focus:border-primary focus:ring-4 focus:ring-primary/10 focus:outline-none transition-colors"
          disabled={disabled}
        />
        <p className="text-sm text-gray-500 mt-2">
          提示：越详细的描述，AI 生成的封面越符合你的期望
        </p>
      </div>

      {/* Template Section */}
      <div>
        <button
          type="button"
          onClick={() => setShowTemplates(!showTemplates)}
          className="flex items-center space-x-2 text-primary hover:text-primary-600 transition-colors"
        >
          <Lightbulb className="w-4 h-4" />
          <span className="text-sm font-medium">智能提示词</span>
        </button>

        {showTemplates && (
          <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-2">
            {promptTemplates.map((template) => (
              <button
                key={template.id}
                onClick={() => handleTemplateSelect(template)}
                className="text-left p-3 border border-gray-200 rounded-lg hover:border-primary hover:bg-primary/5 transition-all"
                disabled={disabled}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-medium text-gray-900">
                    {template.name}
                  </span>
                  <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                    {template.category}
                  </span>
                </div>
                <p className="text-xs text-gray-600 line-clamp-2">
                  {template.template}
                </p>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Generate Button */}
      <Button
        onClick={onGenerate}
        loading={isGenerating}
        disabled={disabled || !value.trim()}
        className="w-full"
        size="lg"
      >
        <Wand2 className="w-5 h-5 mr-2" />
        {isGenerating ? '正在生成...' : '开始生成封面'}
      </Button>
    </Card>
  );
}; 
