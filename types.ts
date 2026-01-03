/*
 Copyright (c) 2026 Ashraf Morningstar
 These are personal recreations of existing projects, developed by Ashraf Morningstar
 for learning and skill development.
 Original project concepts remain the intellectual property of their respective creators.
 Repository: https://github.com/AshrafMorningstar
*/

export interface GenerationState {
  isGenerating: boolean;
  statusMessage: string;
  error: string | null;
}

export interface GeneratedContent {
  markdown: string;
  heroImageUrl: string | null;
}

export enum GenerationStep {
  IDLE = 'IDLE',
  SEARCHING = 'SEARCHING',
  GALLERY = 'GALLERY', // New step for interactive badge selection
  THINKING = 'THINKING',
  WRITING = 'WRITING',
  DRAWING = 'DRAWING',
  DONE = 'DONE'
}

export interface AppConfig {
  repoName: string;
  githubUsername: string;
  includeHeroImage: boolean;
  includeSearchData: boolean;
}

export type BadgeCategory = 'Earnable' | 'Retired' | 'Highlight' | 'Custom';
export type BadgeRarity = 'Common' | 'Rare' | 'Epic' | 'Legendary';

export interface Badge {
  id: string;
  name: string;
  emoji: string;
  description: string;
  category: BadgeCategory;
  rarity: BadgeRarity;
  isOwned: boolean;
  howToEarn: string;
  tiers: string[]; // e.g., ["Bronze", "Silver", "Gold"]
}