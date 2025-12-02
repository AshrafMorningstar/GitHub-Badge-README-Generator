import React, { useState, useCallback } from 'react';
import SettingsPanel from './components/SettingsPanel';
import PreviewArea from './components/PreviewArea';
import { AppConfig, GenerationStep } from './types';
import { fetchLatestAchievementsData, generateReadmeText, generateReadmeHero } from './services/geminiService';

const DEFAULT_CONFIG: AppConfig = {
  repoName: "The Ultimate Guide to GitHub Achievements & Profile Badges 🏆",
  includeHeroImage: true,
  includeSearchData: true,
};

function App() {
  const [config, setConfig] = useState<AppConfig>(DEFAULT_CONFIG);
  const [step, setStep] = useState<GenerationStep>(GenerationStep.IDLE);
  const [markdown, setMarkdown] = useState<string>("");

  const handleGenerate = useCallback(async () => {
    setStep(GenerationStep.SEARCHING);
    let searchContext = "";
    let heroImageUrl: string | null = null;
    let generatedText = "";

    try {
      // 1. Search Grounding (Optional but recommended)
      if (config.includeSearchData) {
        searchContext = await fetchLatestAchievementsData();
      } else {
        searchContext = "Use your internal knowledge about GitHub Achievements.";
      }

      // 2. Image Generation (Parallel-able, but doing sequential for clearer step tracking)
      if (config.includeHeroImage) {
        setStep(GenerationStep.DRAWING);
        heroImageUrl = await generateReadmeHero();
      }

      // 3. Text Generation with Thinking
      setStep(GenerationStep.THINKING);
      // Give the UI a moment to show the Thinking state before the heavy computation/request
      await new Promise(r => setTimeout(r, 500));
      
      setStep(GenerationStep.WRITING);
      generatedText = await generateReadmeText(searchContext, config.repoName, heroImageUrl);

      setMarkdown(generatedText);
      setStep(GenerationStep.DONE);

    } catch (error) {
      console.error("Generation sequence failed", error);
      setStep(GenerationStep.DONE);
      setMarkdown(`# Error \n\n Something went wrong during generation. Please try again.\n\nDetails: ${(error as Error).message}`);
    }
  }, [config]);

  return (
    <div className="flex h-screen w-screen bg-slate-900 text-white overflow-hidden selection:bg-blue-500/30">
      <SettingsPanel 
        config={config} 
        setConfig={setConfig} 
        onGenerate={handleGenerate}
        step={step}
      />
      <PreviewArea markdown={markdown} />
    </div>
  );
}

export default App;