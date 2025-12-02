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
  THINKING = 'THINKING',
  WRITING = 'WRITING',
  DRAWING = 'DRAWING',
  DONE = 'DONE'
}

export interface AppConfig {
  repoName: string;
  includeHeroImage: boolean;
  includeSearchData: boolean;
}