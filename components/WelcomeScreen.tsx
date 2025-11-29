import React, { useState } from 'react';
import { ArrowRight, Instagram, MessageCircle, Heart } from 'lucide-react';

interface WelcomeScreenProps {
  onStart: () => void;
}

const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ onStart }) => {
  const [isExiting, setIsExiting] = useState(false);

  const handleStart = () => {
    setIsExiting(true);
    setTimeout(onStart, 500); // Wait for animation
  };

  return (
    <div className={`fixed inset-0 z-[200] bg-slate-50 dark:bg-[#1a191a] flex flex-col items-center justify-center p-6 transition-all duration-500 ${isExiting ? 'opacity-0 -translate-y-10' : 'opacity-100'}`}>
      
      {/* Background Decor */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-[20%] -left-[10%] w-[50%] h-[50%] bg-brand-primary/10 rounded-full blur-[100px]"></div>
        <div className="absolute bottom-[10%] right-[10%] w-[40%] h-[40%] bg-cyan-500/10 rounded-full blur-[100px]"></div>
      </div>

      <div className="max-w-md w-full text-center relative z-10 flex flex-col items-center">
        
        {/* Logo */}
        <div className="mb-8 p-4 bg-white dark:bg-[#2d2b2c] rounded-2xl shadow-xl border border-slate-100 dark:border-slate-800 animate-in zoom-in duration-700">
           <img 
             src="https://i.ibb.co/pjyn09MV/Somos-Zeta-Exportar-Mesa-de-trabajo-1-copia-5.png" 
             alt="Somos Zeta Logo" 
             className="h-16 w-auto"
           />
        </div>

        {/* Title & Message */}
        <h1 className="text-3xl md:text-4xl font-bold text-brand-dark dark:text-white mb-4 animate-in slide-in-from-bottom-4 duration-700 delay-100">
          PromptMaster AI
        </h1>
        
        <p className="text-lg text-slate-600 dark:text-slate-300 mb-8 leading-relaxed animate-in slide-in-from-bottom-4 duration-700 delay-200">
          Bienvenido/a a tu asistente para mejorar tus instrucciones de IA.
        </p>

        {/* Start Button */}
        <button 
          onClick={handleStart}
          className="group relative inline-flex items-center gap-2 bg-brand-primary hover:bg-brand-hover text-white text-lg font-semibold px-8 py-3 rounded-full shadow-lg shadow-brand-primary/30 transition-all hover:scale-105 animate-in slide-in-from-bottom-4 duration-700 delay-300"
        >
          Comenzar
          <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
        </button>

        {/* Contact Info */}
        <div className="mt-16 w-full animate-in fade-in duration-1000 delay-500 border-t border-slate-200 dark:border-slate-800 pt-8">
            <p className="text-sm font-semibold text-brand-dark dark:text-slate-400 mb-4 flex items-center justify-center gap-2">
               <span className="w-1 h-1 rounded-full bg-brand-primary"></span>
               Conectate con nuestras comunidades
               <span className="w-1 h-1 rounded-full bg-brand-primary"></span>
            </p>
            
            <div className="flex flex-col gap-3">
                <a href="https://www.instagram.com/somoszeta_da" target="_blank" rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 text-slate-600 dark:text-slate-400 hover:text-[#E1306C] dark:hover:text-[#E1306C] transition-colors bg-white dark:bg-slate-800/50 p-2 rounded-lg border border-slate-100 dark:border-slate-700 hover:border-[#E1306C]/30">
                    <Instagram className="w-4 h-4" />
                    <span className="text-sm">Instagram</span>
                </a>
                
                <a href="https://www.tiktok.com/@somoszeta.lab" target="_blank" rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 text-slate-600 dark:text-slate-400 hover:text-black dark:hover:text-white transition-colors bg-white dark:bg-slate-800/50 p-2 rounded-lg border border-slate-100 dark:border-slate-700 hover:border-slate-400">
                     <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                        <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/>
                     </svg>
                    <span className="text-sm">TikTok</span>
                </a>

                <a href="https://whatsapp.com/channel/0029Vb5vxcqC1FuBgMpWtM33" target="_blank" rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 text-slate-600 dark:text-slate-400 hover:text-[#25D366] dark:hover:text-[#25D366] transition-colors bg-white dark:bg-slate-800/50 p-2 rounded-lg border border-slate-100 dark:border-slate-700 hover:border-[#25D366]/30">
                    <MessageCircle className="w-4 h-4" />
                    <span className="text-sm">Canal WhatsApp "Pulso Digital"</span>
                </a>
            </div>

            <div className="mt-8 text-[10px] text-slate-400 flex items-center justify-center gap-1">
                 Desarrollado con <Heart className="w-3 h-3 text-red-500 fill-current" /> por Somos Zeta Digital Advice
            </div>
        </div>

      </div>
    </div>
  );
};

export default WelcomeScreen;
