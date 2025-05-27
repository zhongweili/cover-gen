import React from 'react';
import { Settings, Image } from 'lucide-react';
import { Card } from '../ui/Card';

interface GenerationSettingsProps {
  count: number;
  onCountChange: (count: number) => void;
  disabled: boolean;
}

export const GenerationSettings: React.FC<GenerationSettingsProps> = ({
  count,
  onCountChange,
  disabled
}) => {
  const countOptions = [1, 2, 3, 4];

  return (
    <Card className="space-y-3">
      <div className="flex items-center space-x-2">
        <Settings className="w-5 h-5 text-primary" />
        <h3 className="text-lg font-semibold text-gray-900">生成设置</h3>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          生成数量
        </label>
        <div className="flex space-x-2">
          {countOptions.map((option) => (
            <button
              key={option}
              onClick={() => onCountChange(option)}
              disabled={disabled}
              className={`
                w-12 h-12 rounded-lg border-2 font-semibold transition-all
                ${count === option
                  ? 'border-primary bg-primary text-white'
                  : 'border-gray-200 text-gray-700 hover:border-gray-300'
                }
                ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
              `}
            >
              {option}
            </button>
          ))}
        </div>
        <p className="text-sm text-gray-500 mt-2">
          选择要生成的封面数量（1-4张）
        </p>
      </div>

      <div className="border-t pt-4">
        <div className="flex items-center space-x-2 text-gray-600">
          <Image className="w-4 h-4" />
          <span className="text-sm">图片尺寸: 900×388 (微信公众号标准)</span>
        </div>
      </div>
    </Card>
  );
}; 
