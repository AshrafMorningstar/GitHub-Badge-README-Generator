/*
 Copyright (c) 2026 Ashraf Morningstar
 These are personal recreations of existing projects, developed by Ashraf Morningstar
 for learning and skill development.
 Original project concepts remain the intellectual property of their respective creators.
 Repository: https://github.com/AshrafMorningstar
*/

import React, { useState, useCallback, useEffect } from 'react';
import SettingsPanel from './components/SettingsPanel';
import PreviewArea from './components/PreviewArea';
import BadgeGallery from './components/BadgeGallery';
import { AppConfig, GenerationStep, Badge } from './types';
import { fetchBadgeLibrary, generateReadmeText, generateReadmeHero } from './services/geminiService';

const DEFAULT_CONFIG: AppConfig = {
  repoName: "The Ultimate Guide to GitHub Achievements & Profile Badges 🏆",
  githubUsername: "",
  includeHeroImage: true,
  includeSearchData: true,
};

function App() {
  const [config, setConfig] = useState<AppConfig>(DEFAULT_CONFIG);
  const [step, setStep] = useState<GenerationStep>(GenerationStep.IDLE);
  const [markdown, setMarkdown] = useState<string>("");
  const [badges, setBadges] = useState<Badge[]>([]);
  
  // Theme State
  const [theme, setTheme] = useState<'light'|'dark'>(() => {
    if (typeof window !== 'undefined') {
       const saved = localStorage.getItem('theme');
       if (saved) return saved as 'light'|'dark';
       return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }
    return 'dark';
  });

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => setTheme(prev => prev === 'dark' ? 'light' : 'dark');

  // Step 1: Scan for Badges
  const handleScan = useCallback(async () => {
    setStep(GenerationStep.SEARCHING);
    try {
      // Fetch structured data
      const library = await fetchBadgeLibrary(config.githubUsername);
      setBadges(library);
      setStep(GenerationStep.GALLERY);
    } catch (error) {
      console.error("Scan failed", error);
      setStep(GenerationStep.IDLE);
      alert("Failed to scan badges. Please try again.");
    }
  }, [config.githubUsername]);

  // Step 2: Generate Final README
  const handleGenerateFinal = useCallback(async () => {
    let heroImageUrl: string | null = null;
    let generatedText = "";

    try {
      // Image Generation
      if (config.includeHeroImage) {
        setStep(GenerationStep.DRAWING);
        heroImageUrl = await generateReadmeHero();
      }

      // Text Generation
      setStep(GenerationStep.THINKING);
      await new Promise(r => setTimeout(r, 500));
      
      setStep(GenerationStep.WRITING);
      generatedText = await generateReadmeText(badges, config.repoName, heroImageUrl);

      setMarkdown(generatedText);
      setStep(GenerationStep.DONE);

    } catch (error) {
      console.error("Generation failed", error);
      setStep(GenerationStep.DONE);
      setMarkdown(`# Error \n\n Something went wrong during generation. Please try again.\n\nDetails: ${(error as Error).message}`);
    }
  }, [config, badges]);

  return (
    <div className="relative flex h-screen w-screen overflow-hidden text-slate-900 dark:text-white transition-colors duration-500">
      
      {/* Animated Background Layers */}
      <div className="absolute inset-0 z-0 bg-slate-50 dark:bg-slate-950 transition-colors duration-500"></div>
      
      {/* Gradient Blob Animation */}
      <div className="absolute top-0 -left-4 w-72 h-72 bg-purple-300 dark:bg-indigo-900 rounded-full mix-blend-multiply dark:mix-blend-screen filter blur-xl opacity-30 animate-blob"></div>
      <div className="absolute top-0 -right-4 w-72 h-72 bg-yellow-300 dark:bg-blue-900 rounded-full mix-blend-multiply dark:mix-blend-screen filter blur-xl opacity-30 animate-blob animation-delay-2000"></div>
      <div className="absolute -bottom-8 left-20 w-72 h-72 bg-pink-300 dark:bg-purple-900 rounded-full mix-blend-multiply dark:mix-blend-screen filter blur-xl opacity-30 animate-blob animation-delay-4000"></div>

      {/* Glassmorphism Overlay */}
      <div className="absolute inset-0 z-0 backdrop-blur-[100px] bg-white/30 dark:bg-slate-900/30"></div>

      {/* Main Content Content */}
      <div className="relative z-10 flex w-full h-full shadow-2xl overflow-hidden">
        <SettingsPanel 
          config={config} 
          setConfig={setConfig} 
          onGenerate={handleScan} // Sidebar now triggers Scan
          step={step}
        />
        
        {/* View Switcher */}
        {step === GenerationStep.GALLERY ? (
          <BadgeGallery 
             badges={badges} 
             setBadges={setBadges} 
             onContinue={handleGenerateFinal}
             isProcessing={false}
          />
        ) : (step === GenerationStep.DRAWING || step === GenerationStep.THINKING || step === GenerationStep.WRITING) ? (
           // Implicitly handled by PreviewArea or could be a loading state
           <PreviewArea 
              markdown={markdown} 
              isDark={theme === 'dark'}
              onToggleTheme={toggleTheme}
            />
        ) : (
          <PreviewArea 
            markdown={markdown} 
            isDark={theme === 'dark'}
            onToggleTheme={toggleTheme}
          />
        )}
      </div>
    </div>
  );
}

export default App;