import React from 'react';
import { GenerationStep, AppConfig } from '../types';

interface SettingsPanelProps {
  config: AppConfig;
  setConfig: React.Dispatch<React.SetStateAction<AppConfig>>;
  onGenerate: () => void;
  step: GenerationStep;
}

const SettingsPanel: React.FC<SettingsPanelProps> = ({ config, setConfig, onGenerate, step }) => {
  const isGenerating = step !== GenerationStep.IDLE && step !== GenerationStep.DONE && step !== GenerationStep.GALLERY;

  return (
    <div className="w-full md:w-80 bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl border-r border-slate-200 dark:border-slate-800 flex flex-col h-full overflow-y-auto transition-colors duration-200">
      <div className="p-6 border-b border-slate-200 dark:border-slate-800">
        <h1 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <span className="text-2xl drop-shadow-sm">🏆</span> BadgeGen
        </h1>
        <p className="text-slate-500 dark:text-slate-400 text-xs mt-1 font-medium tracking-wide">Premium README Generator</p>
      </div>

      <div className="p-6 flex-1 space-y-8">
        {/* Repo Configuration */}
        <div className="space-y-4">
          <h2 className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">Setup</h2>
          
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Repository Title</label>
            <input
              type="text"
              value={config.repoName}
              onChange={(e) => setConfig(prev => ({ ...prev, repoName: e.target.value }))}
              className="w-full bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-lg px-4 py-2.5 text-sm text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500/50 outline-none transition-all shadow-sm"
              placeholder="The Ultimate Guide..."
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700 dark:text-slate-300">GitHub Username</label>
            <input
              type="text"
              value={config.githubUsername}
              onChange={(e) => setConfig(prev => ({ ...prev, githubUsername: e.target.value }))}
              className="w-full bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-lg px-4 py-2.5 text-sm text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500/50 outline-none transition-all shadow-sm"
              placeholder="e.g. monalisa"
            />
            <p className="text-[10px] text-slate-500">Required to sync your collection.</p>
          </div>

          <div className="flex items-center justify-between py-2">
            <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Create Hero Asset</label>
            <div 
              className={`w-11 h-6 rounded-full cursor-pointer transition-colors p-1 flex items-center shadow-inner ${config.includeHeroImage ? 'bg-indigo-600 justify-end' : 'bg-slate-300 dark:bg-slate-700 justify-start'}`}
              onClick={() => setConfig(prev => ({ ...prev, includeHeroImage: !prev.includeHeroImage }))}
            >
              <div className="w-4 h-4 bg-white rounded-full shadow-sm" />
            </div>
          </div>
        </div>

        {/* Status Section */}
        {isGenerating && (
           <div className="bg-white/50 dark:bg-slate-900/50 rounded-xl p-4 border border-indigo-100 dark:border-indigo-900/30 space-y-3 shadow-lg backdrop-blur-sm">
             <div className="flex items-center gap-3 text-sm font-medium">
                {step === GenerationStep.SEARCHING && <span className="text-emerald-600 dark:text-emerald-400 animate-pulse">🔍 Analyzing Profile...</span>}
                {step === GenerationStep.THINKING && <span className="text-indigo-600 dark:text-indigo-400 animate-pulse">🧠 Structuring Content...</span>}
                {step === GenerationStep.WRITING && <span className="text-blue-600 dark:text-blue-400 animate-pulse">✍️ Drafting Guide...</span>}
                {step === GenerationStep.DRAWING && <span className="text-pink-600 dark:text-pink-400 animate-pulse">🎨 Designing Assets...</span>}
             </div>
             <div className="h-1.5 w-full bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
                <div className={`h-full bg-gradient-to-r from-indigo-500 to-purple-500 transition-all duration-700 ease-out ${
                  step === GenerationStep.SEARCHING ? 'w-1/4' : 
                  step === GenerationStep.THINKING ? 'w-2/4' : 
                  step === GenerationStep.WRITING ? 'w-3/4' : 'w-full'
                }`} />
             </div>
           </div>
        )}
      </div>

      <div className="p-6 border-t border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-900/50 backdrop-blur-xl sticky bottom-0 z-10">
        <button
          onClick={onGenerate}
          disabled={isGenerating || step === GenerationStep.GALLERY}
          className={`w-full py-3.5 px-4 rounded-xl font-bold tracking-wide flex items-center justify-center gap-2 transition-all shadow-lg transform active:scale-95
            ${(isGenerating || step === GenerationStep.GALLERY)
              ? 'bg-slate-200 dark:bg-slate-800 text-slate-400 dark:text-slate-500 cursor-not-allowed shadow-none' 
              : 'bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white shadow-indigo-500/25 hover:shadow-indigo-500/40'
            }`}
        >
          {isGenerating ? 'Processing...' : step === GenerationStep.GALLERY ? '✓ Scan Complete' : 'Start Generator'}
        </button>
      </div>
    </div>
  );
};

export default SettingsPanel;