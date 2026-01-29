import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

interface PreviewAreaProps {
  markdown: string;
  isDark: boolean;
  onToggleTheme: () => void;
}

const PreviewArea: React.FC<PreviewAreaProps> = ({ markdown, isDark, onToggleTheme }) => {
  const [viewMode, setViewMode] = useState<'preview' | 'code'>('preview');
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(markdown);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (!markdown) {
    return (
      <div className="flex-1 flex flex-col h-full bg-slate-50 dark:bg-slate-900 transition-colors duration-200">
         <div className="h-16 border-b border-slate-200 dark:border-slate-700 flex items-center justify-end px-6 bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm">
           <button
            onClick={onToggleTheme}
            className="p-2 rounded-lg text-slate-500 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
            title="Toggle Theme"
          >
            {isDark ? '🌙' : '☀️'}
          </button>
         </div>
        <div className="flex-1 flex flex-col items-center justify-center text-slate-500 p-8">
          <div className="w-24 h-24 bg-white dark:bg-slate-800 rounded-full flex items-center justify-center mb-6 border border-slate-200 dark:border-slate-700 shadow-sm">
             <span className="text-4xl opacity-50">📄</span>
          </div>
          <h3 className="text-xl font-medium text-slate-700 dark:text-slate-300">Ready to Create</h3>
          <p className="max-w-md text-center mt-2 text-slate-500 dark:text-slate-400">
            Configure your options on the left and click "Generate README" to build your ultimate guide.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden bg-slate-50 dark:bg-slate-900 transition-colors duration-200">
      {/* Toolbar */}
      <div className="h-16 border-b border-slate-200 dark:border-slate-700 flex items-center justify-between px-6 bg-white/80 dark:bg-slate-800/50 backdrop-blur-sm sticky top-0 z-20">
        <div className="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-lg border border-slate-200 dark:border-slate-700">
          <button
            onClick={() => setViewMode('preview')}
            className={`px-4 py-1.5 rounded-md text-sm font-medium transition-colors ${
              viewMode === 'preview' 
                ? 'bg-white dark:bg-slate-600 text-slate-900 dark:text-white shadow-sm' 
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'
            }`}
          >
            Preview
          </button>
          <button
            onClick={() => setViewMode('code')}
            className={`px-4 py-1.5 rounded-md text-sm font-medium transition-colors ${
              viewMode === 'code' 
                ? 'bg-white dark:bg-slate-600 text-slate-900 dark:text-white shadow-sm' 
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'
            }`}
          >
            Raw Code
          </button>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={onToggleTheme}
            className="p-2 rounded-lg text-slate-500 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
            title="Toggle Theme"
          >
            {isDark ? '🌙' : '☀️'}
          </button>
          <button
            onClick={handleCopy}
            className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 rounded-lg text-sm font-medium text-slate-700 dark:text-slate-300 transition-colors shadow-sm"
          >
            {copied ? '✅ Copied!' : '📋 Copy Markdown'}
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
        {viewMode === 'preview' ? (
          <div className="prose dark:prose-invert prose-slate max-w-4xl mx-auto prose-headings:scroll-mt-20 prose-img:rounded-xl prose-img:shadow-2xl">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>
              {markdown}
            </ReactMarkdown>
          </div>
        ) : (
          <div className="max-w-4xl mx-auto h-full">
            <textarea
              readOnly
              value={markdown}
              className="w-full h-full bg-white dark:bg-slate-950 text-slate-800 dark:text-slate-300 font-mono text-sm p-6 rounded-xl border border-slate-200 dark:border-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-900 resize-none shadow-inner"
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default PreviewArea;