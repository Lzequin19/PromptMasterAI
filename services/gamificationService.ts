
import { Badge, PromptAnalysis, UserStats, GamificationUpdate } from "../types";

const STORAGE_KEY = 'promptMaster_userStats';

export const INITIAL_STATS: UserStats = {
  xp: 0,
  level: 1,
  totalAnalyses: 0,
  unlockedBadges: [],
};

// Define all available badges
export const BADGES: Badge[] = [
  {
    id: 'first_step',
    name: 'Novato Curioso',
    description: 'Completa tu primer análisis de prompt.',
    iconName: 'star',
    condition: (stats) => stats.totalAnalyses >= 1
  },
  {
    id: 'consistent',
    name: 'Ingeniero Constante',
    description: 'Analiza 5 prompts diferentes.',
    iconName: 'book',
    condition: (stats) => stats.totalAnalyses >= 5
  },
  {
    id: 'role_master',
    name: 'Maestro del Rol',
    description: 'Obtén un puntaje perfecto (10) en la categoría "Rol".',
    iconName: 'crown',
    condition: (_, analysis) => (analysis?.scores.role || 0) === 10
  },
  {
    id: 'context_architect',
    name: 'Arquitecto de Contexto',
    description: 'Obtén más de 9 puntos en "Contexto".',
    iconName: 'book',
    condition: (_, analysis) => (analysis?.scores.context || 0) > 9
  },
  {
    id: 'clarity_king',
    name: 'Rey de la Claridad',
    description: 'Obtén más de 9 puntos en "Instrucciones".',
    iconName: 'zap',
    condition: (_, analysis) => (analysis?.scores.instructions || 0) > 9
  },
  {
    id: 'safety_first',
    name: 'Escudo Protector',
    description: 'Obtén más de 9 puntos en "Restricciones".',
    iconName: 'shield',
    condition: (_, analysis) => (analysis?.scores.constraints || 0) > 9
  },
  {
    id: 'perfectionist',
    name: 'Prompt Perfecto',
    description: 'Logra un puntaje general superior a 9.5.',
    iconName: 'award',
    condition: (_, analysis) => (analysis?.scores.overall || 0) > 9.5
  },
  {
    id: 'veteran',
    name: 'Veterano de Prompts',
    description: 'Alcanza el Nivel 5.',
    iconName: 'target',
    condition: (stats) => stats.level >= 5
  }
];

export const loadUserStats = (): UserStats => {
  const stored = localStorage.getItem(STORAGE_KEY);
  return stored ? JSON.parse(stored) : INITIAL_STATS;
};

export const calculateLevel = (xp: number): number => {
  // Simple linear curve: 100 XP per level
  return Math.floor(xp / 100) + 1;
};

export const processGamification = (currentStats: UserStats, analysis: PromptAnalysis): GamificationUpdate => {
  let earnedXp = 50; // Base XP for using the tool
  
  // Quality Bonuses
  if (analysis.scores.overall > 7) earnedXp += 20;
  if (analysis.scores.overall > 9) earnedXp += 50;

  const newTotalXp = currentStats.xp + earnedXp;
  const newLevel = calculateLevel(newTotalXp);
  const leveledUp = newLevel > currentStats.level;
  
  const tempStats: UserStats = {
    ...currentStats,
    xp: newTotalXp,
    level: newLevel,
    totalAnalyses: currentStats.totalAnalyses + 1
  };

  // Check for new badges
  const newBadges: Badge[] = [];
  const updatedUnlockedBadges = [...currentStats.unlockedBadges];

  BADGES.forEach(badge => {
    if (!updatedUnlockedBadges.includes(badge.id)) {
      if (badge.condition(tempStats, analysis)) {
        newBadges.push(badge);
        updatedUnlockedBadges.push(badge.id);
      }
    }
  });

  const finalStats: UserStats = {
    ...tempStats,
    unlockedBadges: updatedUnlockedBadges
  };

  // Save to local storage
  localStorage.setItem(STORAGE_KEY, JSON.stringify(finalStats));

  return {
    newStats: finalStats,
    earnedXp,
    newBadges,
    leveledUp
  };
};
