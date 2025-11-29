
export interface ScoreCategory {
  score: number;
  fullMark: number;
  name: string;
}

export interface KeyChange {
  title: string;
  description: string;
  type: 'addition' | 'modification' | 'removal';
}

export interface PromptAnalysis {
  scores: {
    objective: number;
    context: number;
    role: number;
    format: number;
    instructions: number;
    examples: number;
    constraints: number;
    overall: number;
  };
  feedback: {
    strengths: string[];
    weaknesses: string[];
  };
  suggestions: string[];
  key_changes: KeyChange[];
  optimizedPrompt: string;
  explanation: string;
}

export interface ChartDataPoint {
  subject: string;
  A: number;
  fullMark: number;
}

export type PromptCategory = 'Desarrollo' | 'Escritura' | 'Negocios' | 'Educación' | 'Marketing' | 'RRHH' | 'Ingeniería' | 'Salud' | 'Legal';

export interface ExamplePrompt {
  id: string;
  category: PromptCategory;
  title: string;
  content: string;
  explanation: string;
}

// Gamification Types
export interface Badge {
  id: string;
  name: string;
  description: string;
  iconName: 'award' | 'star' | 'zap' | 'target' | 'crown' | 'book' | 'shield';
  condition: (stats: UserStats, analysis?: PromptAnalysis) => boolean;
}

export interface UserStats {
  xp: number;
  level: number;
  totalAnalyses: number;
  unlockedBadges: string[]; // List of Badge IDs
}

export interface GamificationUpdate {
  newStats: UserStats;
  earnedXp: number;
  newBadges: Badge[];
  leveledUp: boolean;
}
