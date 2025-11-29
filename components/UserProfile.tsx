import React from 'react';
import { UserStats } from '../types';
import { BADGES } from '../services/gamificationService';
import { Award, Star, Zap, Target, Crown, BookOpen, Shield, Lock } from 'lucide-react';

interface UserProfileProps {
  stats: UserStats;
}

const UserProfile: React.FC<UserProfileProps> = ({ stats }) => {
  // Logic: Level 1 starts at 0 XP. Level 2 starts at 100 XP.
  // XP needed for next level is always based on the next level threshold.
  const xpPerLevel = 100;
  const xpInCurrentLevel = stats.xp % xpPerLevel;
  const progressPercent = (xpInCurrentLevel / xpPerLevel) * 100;

  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'award': return <Award className="w-5 h-5" />;
      case 'star': return <Star className="w-5 h-5" />;
      case 'zap': return <Zap className="w-5 h-5" />;
      case 'target': return <Target className="w-5 h-5" />;
      case 'crown': return <Crown className="w-5 h-5" />;
      case 'book': return <BookOpen className="w-5 h-5" />;
      case 'shield': return <Shield className="w-5 h-5" />;
      default: return <Star className="w-5 h-5" />;
    }
  };

  return (
    <div className="bg-white dark:bg-[#1a191a] border border-slate-200 dark:border-slate-800 rounded-xl p-6 shadow-xl mb-8 animate-in fade-in duration-700 transition-colors">
      <div className="flex flex-col md:flex-row gap-8 items-center md:items-start">
        
        {/* Level & XP Section */}
        <div className="flex-shrink-0 flex flex-col items-center gap-2 w-full md:w-48">
          <div className="relative">
            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-brand-primary to-cyan-600 flex items-center justify-center shadow-lg shadow-brand-primary/30">
              <span className="text-4xl font-bold text-white">{stats.level}</span>
            </div>
            <div className="absolute -bottom-2 px-3 py-1 bg-white dark:bg-[#2d2b2c] rounded-full border border-slate-200 dark:border-slate-700 text-xs text-brand-primary dark:text-brand-primary uppercase font-bold tracking-wider transition-colors">
              Nivel
            </div>
          </div>
          
          <div className="w-full mt-4">
            <div className="flex justify-between text-xs text-slate-500 dark:text-slate-400 mb-1">
              <span>XP: {stats.xp}</span>
              <span>Sig: {Math.floor(stats.xp / 100 + 1) * 100}</span>
            </div>
            <div className="h-2 w-full bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden transition-colors">
              <div 
                className="h-full bg-brand-primary transition-all duration-1000 ease-out"
                style={{ width: `${progressPercent}%` }}
              ></div>
            </div>
            <p className="text-[10px] text-center text-slate-500 mt-2">
              Analiza más prompts para subir de nivel
            </p>
          </div>
        </div>

        {/* Badges Grid */}
        <div className="flex-grow w-full">
          <h3 className="text-brand-dark dark:text-slate-200 font-semibold mb-4 flex items-center gap-2">
            <Award className="w-5 h-5 text-amber-500 dark:text-amber-400" />
            Insignias y Logros
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
            {BADGES.map((badge) => {
              const isUnlocked = stats.unlockedBadges.includes(badge.id);
              
              return (
                <div 
                  key={badge.id}
                  className={`group relative p-3 rounded-lg border flex flex-col items-center gap-2 transition-all duration-300
                    ${isUnlocked 
                      ? 'bg-brand-light dark:bg-brand-primary/20 border-brand-primary/30 dark:border-brand-primary/40 hover:bg-brand-primary/20 dark:hover:bg-brand-primary/30 shadow-lg shadow-brand-primary/10' 
                      : 'bg-slate-50 dark:bg-slate-900/50 border-slate-200 dark:border-slate-800 opacity-60 grayscale'
                    }`}
                >
                  <div className={`p-2 rounded-full ${isUnlocked ? 'bg-white dark:bg-brand-primary/20 text-brand-primary dark:text-brand-light' : 'bg-slate-200 dark:bg-slate-800 text-slate-400 dark:text-slate-600'}`}>
                    {isUnlocked ? getIcon(badge.iconName) : <Lock className="w-5 h-5" />}
                  </div>
                  <span className={`text-xs font-medium text-center ${isUnlocked ? 'text-brand-dark dark:text-slate-200' : 'text-slate-400 dark:text-slate-500'}`}>
                    {badge.name}
                  </span>

                  {/* Tooltip */}
                  <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 w-40 bg-white dark:bg-[#1a191a] border border-slate-200 dark:border-slate-700 p-2 rounded shadow-xl text-center opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity z-10">
                    <p className="text-[10px] text-slate-600 dark:text-slate-300">{badge.description}</p>
                    {!isUnlocked && <p className="text-[9px] text-red-500 dark:text-red-400 mt-1 uppercase font-bold">Bloqueado</p>}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

      </div>
    </div>
  );
};

export default UserProfile;