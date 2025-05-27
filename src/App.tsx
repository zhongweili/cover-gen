import { useEffect } from 'react';
import { Header } from './components/layout/Header';
import { ApiConfig } from './components/config/ApiConfig';
import { PromptInput } from './components/generation/PromptInput';
import { GenerationSettings } from './components/generation/GenerationSettings';
import { PreviewArea } from './components/generation/PreviewArea';
import { useConfigStore } from './stores/config';
import { useGenerationStore } from './stores/generation';

function App() {
  const { config, isConfigured, loadConfig } = useConfigStore();
  const {
    currentPrompt,
    generationCount,
    isGenerating,
    progress,
    results,
    error,
    setPrompt,
    setGenerationCount,
    generateImages,
    clearResults
  } = useGenerationStore();

  // Load config on app start
  useEffect(() => {
    loadConfig();
  }, [loadConfig]);

  const handleGenerate = async () => {
    if (!config || !isConfigured) {
      alert('请先配置 API Key');
      return;
    }

    if (!currentPrompt.trim()) {
      alert('请输入封面描述');
      return;
    }

    await generateImages(
      config.apiKey,
      config.model,
      currentPrompt,
      generationCount
    );
  };

  const handleDownload = async (url: string) => {
    try {
      const response = await fetch(url);
      const blob = await response.blob();
      const downloadUrl = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.download = `cover-${Date.now()}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(downloadUrl);
    } catch (error) {
      console.error('Download failed:', error);
      alert('下载失败，请稍后重试');
    }
  };

  const handleCopy = async (url: string) => {
    try {
      await navigator.clipboard.writeText(url);
      alert('链接已复制到剪贴板');
    } catch (error) {
      console.error('Copy failed:', error);
      alert('复制失败，请手动复制链接');
    }
  };

  const handleRegenerate = () => {
    clearResults();
    handleGenerate();
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8 min-h-[calc(100vh-200px)]">
          {/* Left Panel - Controls */}
          <div className="lg:w-96 lg:flex-shrink-0 space-y-4">
            <ApiConfig />
            
            <PromptInput
              value={currentPrompt}
              onChange={setPrompt}
              onGenerate={handleGenerate}
              isGenerating={isGenerating}
              disabled={!isConfigured}
            />
            
            <GenerationSettings
              count={generationCount}
              onCountChange={setGenerationCount}
              disabled={!isConfigured || isGenerating}
            />
          </div>

          {/* Right Panel - Preview */}
          <div className="flex-1 lg:min-h-[600px]">
            <PreviewArea
              isGenerating={isGenerating}
              progress={progress}
              results={results}
              error={error}
              onRegenerate={handleRegenerate}
              onDownload={handleDownload}
              onCopy={handleCopy}
            />
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center text-gray-600">
            <p className="text-sm">
              © 2025 封面大师 Cover Master. 专业的微信公众号封面 AI 生成工具
            </p>
            <p className="text-xs mt-2">
              Powered by DMX API • 让创作更简单
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App; 
