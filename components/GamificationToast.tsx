import React, { useEffect, useState } from 'react';
import { GamificationUpdate } from '../types';
import { Trophy, Star, ArrowUpCircle } from 'lucide-react';

interface GamificationToastProps {
  update: GamificationUpdate | null;
  onClose: () => void;
}

const GamificationToast: React.FC<GamificationToastProps> = ({ update, onClose }) => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (update) {
      setVisible(true);
      const timer = setTimeout(() => {
        setVisible(false);
        setTimeout(onClose, 300); // Wait for fade out animation
      }, 5000); // Show for 5 seconds
      return () => clearTimeout(timer);
    }
  }, [update, onClose]);

  if (!update && !visible) return null;

  return (
    <div className={`fixed bottom-6 right-6 z-50 flex flex-col gap-2 transition-all duration-500 transform ${visible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
      
      {/* Level Up Notification */}
      {update?.leveledUp && (
        <div className="bg-gradient-to-r from-amber-500 to-orange-600 text-white p-4 rounded-lg shadow-2xl flex items-center gap-3 border border-amber-400/50">
          <div className="bg-white/20 p-2 rounded-full animate-bounce">
            <ArrowUpCircle className="w-6 h-6" />
          </div>
          <div>
            <h4 className="font-bold text-lg">¡Subiste de Nivel!</h4>
            <p className="text-xs text-amber-100">Ahora eres nivel {update.newStats.level}</p>
          </div>
        </div>
      )}

      {/* Badges Notification */}
      {update?.newBadges.map((badge) => (
        <div key={badge.id} className="bg-gradient-to-r from-brand-primary to-cyan-600 text-white p-4 rounded-lg shadow-2xl flex items-center gap-3 border border-brand-primary/50">
          <div className="bg-white/20 p-2 rounded-full animate-pulse">
            <Trophy className="w-6 h-6" />
          </div>
          <div>
            <h4 className="font-bold text-sm">¡Insignia Desbloqueada!</h4>
            <p className="text-xs text-brand-light">{badge.name}</p>
          </div>
        </div>
      ))}

      {/* XP Notification */}
      {update && update.earnedXp > 0 && (
         <div className="bg-white dark:bg-[#1a191a] text-brand-dark dark:text-slate-200 p-3 rounded-lg shadow-xl border border-slate-200 dark:border-slate-700 flex items-center justify-between gap-4 min-w-[200px] transition-colors">
            <div className="flex items-center gap-2">
                <Star className="w-4 h-4 text-amber-500 dark:text-yellow-400" />
                <span className="font-semibold text-sm">Experiencia ganada</span>
            </div>
            <span className="text-green-600 dark:text-green-400 font-bold">+{update.earnedXp} XP</span>
         </div>
      )}
    </div>
  );
};

export default GamificationToast;