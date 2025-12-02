import React from 'react';
import { GenerationStep, AppConfig } from '../types';

interface SettingsPanelProps {
  config: AppConfig;
  setConfig: React.Dispatch<React.SetStateAction<AppConfig>>;
  onGenerate: () => void;
  step: GenerationStep;
}

const SettingsPanel: React.FC<SettingsPanelProps> = ({ config, setConfig, onGenerate, step }) => {
  const isGenerating = step !== GenerationStep.IDLE && step !== GenerationStep.DONE;

  return (
    <div className="w-full md:w-80 bg-slate-800 border-r border-slate-700 flex flex-col h-full overflow-y-auto">
      <div className="p-6 border-b border-slate-700">
        <h1 className="text-xl font-bold text-white flex items-center gap-2">
          <span className="text-2xl">🏆</span> BadgeGen
        </h1>
        <p className="text-slate-400 text-xs mt-1">AI-Powered README Generator</p>
      </div>

      <div className="p-6 flex-1 space-y-8">
        {/* Repo Configuration */}
        <div className="space-y-4">
          <h2 className="text-sm font-semibold text-slate-300 uppercase tracking-wider">Configuration</h2>
          
          <div className="space-y-2">
            <label className="text-sm text-slate-400">Repository Title</label>
            <input
              type="text"
              value={config.repoName}
              onChange={(e) => setConfig(prev => ({ ...prev, repoName: e.target.value }))}
              className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-blue-500 outline-none transition-all"
              placeholder="The Ultimate Guide..."
            />
          </div>

          <div className="flex items-center justify-between">
            <label className="text-sm text-slate-400">Generate Hero Image</label>
            <div 
              className={`w-12 h-6 rounded-full cursor-pointer transition-colors p-1 flex items-center ${config.includeHeroImage ? 'bg-blue-600 justify-end' : 'bg-slate-700 justify-start'}`}
              onClick={() => setConfig(prev => ({ ...prev, includeHeroImage: !prev.includeHeroImage }))}
            >
              <div className="w-4 h-4 bg-white rounded-full shadow-md" />
            </div>
          </div>

          <div className="flex items-center justify-between">
            <label className="text-sm text-slate-400">Search Latest Data</label>
            <div 
              className={`w-12 h-6 rounded-full cursor-pointer transition-colors p-1 flex items-center ${config.includeSearchData ? 'bg-emerald-600 justify-end' : 'bg-slate-700 justify-start'}`}
              onClick={() => setConfig(prev => ({ ...prev, includeSearchData: !prev.includeSearchData }))}
            >
              <div className="w-4 h-4 bg-white rounded-full shadow-md" />
            </div>
          </div>
        </div>

        {/* Status Section */}
        {isGenerating && (
           <div className="bg-slate-900/50 rounded-lg p-4 border border-slate-700 space-y-3 animate-pulse">
             <div className="flex items-center gap-3">
                {step === GenerationStep.SEARCHING && <span className="text-emerald-400">🔍 Scanning Web...</span>}
                {step === GenerationStep.THINKING && <span className="text-purple-400">🧠 Thinking Deeply...</span>}
                {step === GenerationStep.WRITING && <span className="text-blue-400">✍️ Writing Markdown...</span>}
                {step === GenerationStep.DRAWING && <span className="text-pink-400">🎨 Painting Hero...</span>}
             </div>
             <div className="h-1 w-full bg-slate-700 rounded-full overflow-hidden">
                <div className={`h-full bg-blue-500 transition-all duration-500 ${
                  step === GenerationStep.SEARCHING ? 'w-1/4' : 
                  step === GenerationStep.THINKING ? 'w-2/4' : 
                  step === GenerationStep.WRITING ? 'w-3/4' : 'w-full'
                }`} />
             </div>
           </div>
        )}
      </div>

      <div className="p-6 border-t border-slate-700 bg-slate-800 sticky bottom-0 z-10">
        <button
          onClick={onGenerate}
          disabled={isGenerating}
          className={`w-full py-3 px-4 rounded-lg font-semibold flex items-center justify-center gap-2 transition-all shadow-lg
            ${isGenerating 
              ? 'bg-slate-700 text-slate-500 cursor-not-allowed' 
              : 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white shadow-blue-900/20'
            }`}
        >
          {isGenerating ? 'Processing...' : '✨ Generate README'}
        </button>
        <p className="text-center text-xs text-slate-500 mt-4">
          Powered by Gemini 2.5 Flash & 3.0 Pro
        </p>
      </div>
    </div>
  );
};

export default SettingsPanel;