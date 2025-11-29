import React, { useState, useEffect } from 'react';
import { X, ChevronRight, Check, MousePointerClick } from 'lucide-react';

interface TutorialProps {
  isActive: boolean;
  isLoading: boolean;
  hasAnalysis: boolean;
  onComplete: () => void;
  setInputPrompt: (text: string) => void;
  triggerAnalysis: () => void;
}

interface Step {
  targetId: string | null; // null means centered modal
  title: string;
  content: string;
  position: 'top' | 'bottom' | 'left' | 'right' | 'center';
  action?: 'type_example' | 'wait_for_analysis';
}

const STEPS: Step[] = [
  {
    targetId: null,
    title: "¡Bienvenido a PromptMaster AI!",
    content: "Te ayudaremos a dominar el arte de la Ingeniería de Prompts. Vamos a hacer un recorrido rápido para mostrarte cómo funciona.",
    position: 'center'
  },
  {
    targetId: 'prompt-input',
    title: "Tu Área de Trabajo",
    content: "Aquí escribirás tus prompts. Para este ejemplo, vamos a escribir uno por ti que necesita algunas mejoras.",
    position: 'bottom',
    action: 'type_example'
  },
  {
    targetId: 'analyze-btn',
    title: "Analizar",
    content: "Haz clic en este botón para que nuestra IA evalúe tu prompt basándose en buenas prácticas.",
    position: 'bottom',
    action: 'wait_for_analysis'
  },
  {
    targetId: 'score-panel',
    title: "Métricas de Calidad",
    content: "Aquí verás un desglose numérico. Un buen prompt equilibra Contexto, Rol, Instrucciones y Restricciones.",
    position: 'right'
  },
  {
    targetId: 'feedback-grid',
    title: "Diagnóstico",
    content: "Identificamos qué hiciste bien y qué áreas necesitan atención inmediata.",
    position: 'top'
  },
  {
    targetId: 'comparison-section',
    title: "Optimización Inteligente",
    content: "La mejor parte: comparamos tu versión original con una versión profesionalmente reescrita lista para usar.",
    position: 'top'
  },
  {
    targetId: null,
    title: "¡Estás listo!",
    content: "Ahora es tu turno. Gana XP, sube de nivel y conviértete un experto en prompts.",
    position: 'center'
  }
];

const EXAMPLE_PROMPT = "Quiero que escribas un email para vender zapatos deportivos. Que sea corto.";

const Tutorial: React.FC<TutorialProps> = ({ 
  isActive, 
  isLoading, 
  hasAnalysis, 
  onComplete, 
  setInputPrompt,
  triggerAnalysis
}) => {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [rect, setRect] = useState<DOMRect | null>(null);
  const currentStep = STEPS[currentStepIndex];

  // Robust element tracking loop
  useEffect(() => {
    if (!isActive) return;
    
    // If step has no target, clear rect and return
    if (!currentStep.targetId) {
      setRect(null);
      return;
    }

    const element = document.getElementById(currentStep.targetId);
    if (element) {
        // Initial scroll to element
        element.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }

    // Use requestAnimationFrame to track element position perfectly even during scroll/resize
    let rafId: number;
    const updateRect = () => {
      const el = document.getElementById(currentStep.targetId!);
      if (el) {
        const newRect = el.getBoundingClientRect();
        // Update state
        setRect(newRect);
      }
      rafId = requestAnimationFrame(updateRect);
    };

    rafId = requestAnimationFrame(updateRect);

    return () => cancelAnimationFrame(rafId);
  }, [isActive, currentStepIndex, hasAnalysis]);

  // Handle auto-typing action
  useEffect(() => {
    if (!isActive) return;

    if (currentStep.action === 'type_example') {
      let i = 0;
      setInputPrompt("");
      const typeInterval = setInterval(() => {
        if (i < EXAMPLE_PROMPT.length) {
          setInputPrompt(EXAMPLE_PROMPT.slice(0, i + 1));
          i++;
        } else {
          clearInterval(typeInterval);
        }
      }, 30);
      return () => clearInterval(typeInterval);
    }
  }, [currentStepIndex, isActive]);

  // Logic to advance steps automatically based on app state
  useEffect(() => {
    if (currentStep.action === 'wait_for_analysis') {
      if (isLoading) {
        // User clicked, waiting... logic handled by component unmounting/remounting state usually
      } else if (hasAnalysis && currentStepIndex === 2) {
        // Analysis done, move to next step
        handleNext();
      }
    }
  }, [isLoading, hasAnalysis, currentStepIndex]);

  const handleNext = () => {
    if (currentStepIndex < STEPS.length - 1) {
      setCurrentStepIndex(prev => prev + 1);
    } else {
      onComplete();
    }
  };

  const handleSkip = () => {
    onComplete();
  };

  // Helper to clamp tooltip position within viewport
  const getTooltipStyle = () => {
    if (!rect) return {};

    const tooltipWidth = 320; // Approx max width
    const margin = 16;
    const padding = 12; // Gap between spotlight and tooltip
    
    let top = 0;
    let left = 0;
    let arrowClass = '';

    // Horizontal positioning (Center align default)
    left = rect.left + (rect.width / 2) - (tooltipWidth / 2);
    // Clamp
    left = Math.max(margin, Math.min(window.innerWidth - tooltipWidth - margin, left));

    // Vertical positioning
    if (currentStep.position === 'bottom') {
        top = rect.bottom + padding;
        arrowClass = '-top-1.5 left-1/2 -translate-x-1/2 rotate-45 border-l border-t';
        
        // If goes off bottom, flip to top
        if (top + 200 > window.innerHeight) {
             top = rect.top - 200 - padding;
             arrowClass = '-bottom-1.5 left-1/2 -translate-x-1/2 rotate-[225deg] border-l border-t';
        }
    } else if (currentStep.position === 'top') {
        top = rect.top - 180 - padding; // Estimated height of tooltip
        arrowClass = '-bottom-1.5 left-1/2 -translate-x-1/2 rotate-[225deg] border-l border-t';
    } else if (currentStep.position === 'right') {
        left = rect.right + padding;
        top = rect.top;
        arrowClass = 'top-6 -left-1.5 -rotate-45 border-l border-t';
        
        // Check right edge
        if (left + tooltipWidth > window.innerWidth) {
            // Flip to bottom
            left = rect.left + (rect.width / 2) - (tooltipWidth / 2);
            left = Math.max(margin, Math.min(window.innerWidth - tooltipWidth - margin, left));
            top = rect.bottom + padding;
            arrowClass = '-top-1.5 left-1/2 -translate-x-1/2 rotate-45 border-l border-t';
        }
    }

    // Force basic safeguards
    if (top < margin) top = rect.bottom + padding; 
    
    // Mobile Override: if screen is narrow, always center bottom or top
    if (window.innerWidth < 640) {
        left = margin;
        const mobileTooltipWidth = window.innerWidth - (margin * 2);
        
        // Position below if space, otherwise above
        if (rect.bottom + 250 < window.innerHeight) {
            top = rect.bottom + padding;
            arrowClass = '-top-1.5 left-1/2 -translate-x-1/2 rotate-45 border-l border-t';
        } else {
            top = rect.top - 240; // Force above
            arrowClass = '-bottom-1.5 left-1/2 -translate-x-1/2 rotate-[225deg] border-l border-t';
        }
    }

    return { style: { top, left }, arrowClass };
  };

  if (!isActive) return null;
  if (isLoading) return null;

  const tooltipData = rect ? getTooltipStyle() : null;
  const padding = 8; // Spotlight padding around element

  return (
    <div className="fixed inset-0 z-[100] overflow-hidden pointer-events-none font-sans">
      
      {/* If centered (no target or target not found), full dim background */}
      {!rect && (
        <div className="absolute inset-0 bg-black/70 pointer-events-auto flex items-center justify-center p-4 backdrop-blur-sm">
           <div className="bg-white dark:bg-[#1a191a] p-8 rounded-xl max-w-md w-full shadow-2xl border border-slate-200 dark:border-slate-700 animate-in zoom-in-95 duration-300">
              <h2 className="text-2xl font-bold text-brand-dark dark:text-white mb-4">{currentStep.title}</h2>
              <p className="text-slate-600 dark:text-slate-300 mb-8 text-lg">{currentStep.content}</p>
              <div className="flex gap-4 justify-center">
                 <button 
                   onClick={handleSkip}
                   className="px-4 py-2 text-slate-500 hover:text-slate-700 dark:text-slate-400 font-medium"
                 >
                   Omitir
                 </button>
                 <button 
                   onClick={handleNext}
                   className="bg-brand-primary hover:bg-brand-hover text-white px-8 py-2 rounded-lg font-bold shadow-lg transition-transform hover:scale-105 flex items-center gap-2"
                 >
                   {currentStepIndex === STEPS.length - 1 ? 'Empezar' : 'Comenzar Tour'} <ChevronRight className="w-4 h-4" />
                 </button>
              </div>
           </div>
        </div>
      )}

      {/* If target exists, draw Spotlight */}
      {rect && (
        <>
           {/* Backdrop constructed of 4 divs to create "hole" */}
           {/* Top */}
           <div className="absolute top-0 left-0 right-0 bg-black/60 pointer-events-auto transition-all duration-75 ease-linear" style={{ height: Math.max(0, rect.top - padding) }} />
           {/* Bottom */}
           <div className="absolute bottom-0 left-0 right-0 bg-black/60 pointer-events-auto transition-all duration-75 ease-linear" style={{ top: rect.bottom + padding }} />
           {/* Left */}
           <div className="absolute left-0 bg-black/60 pointer-events-auto transition-all duration-75 ease-linear" 
                style={{ top: Math.max(0, rect.top - padding), height: rect.height + (padding * 2), width: Math.max(0, rect.left - padding) }} />
           {/* Right */}
           <div className="absolute right-0 bg-black/60 pointer-events-auto transition-all duration-75 ease-linear" 
                style={{ top: Math.max(0, rect.top - padding), height: rect.height + (padding * 2), left: rect.right + padding }} />

           {/* Highlight Border */}
           <div 
             className="absolute border-2 border-brand-primary rounded-lg shadow-[0_0_30px_rgba(28,137,175,0.6)] transition-all duration-75 ease-linear pointer-events-none box-content"
             style={{
               top: rect.top - padding,
               left: rect.left - padding,
               width: rect.width + (padding * 2),
               height: rect.height + (padding * 2),
             }}
           />

           {/* Transparent Clickable Overlay for hole */}
           <div 
             className="absolute pointer-events-none"
             style={{
               top: rect.top - padding,
               left: rect.left - padding,
               width: rect.width + (padding * 2),
               height: rect.height + (padding * 2),
               // Ensure interaction passes through this hole to the element below
             }}
           />

           {/* Tooltip Card */}
           <div 
             className="absolute pointer-events-auto transition-all duration-300 z-50 w-[calc(100%-32px)] max-w-xs"
             style={tooltipData?.style}
           >
              <div className="bg-white dark:bg-[#2d2b2c] p-5 rounded-lg shadow-2xl border border-slate-200 dark:border-slate-700 relative animate-in fade-in slide-in-from-bottom-2">
                 {/* Arrow */}
                 <div className={`absolute w-3 h-3 bg-white dark:bg-[#2d2b2c] transform border-slate-200 dark:border-slate-700
                    ${tooltipData?.arrowClass || ''}
                 `} />

                 <div className="flex justify-between items-start mb-2">
                    <h3 className="font-bold text-brand-dark dark:text-white text-lg">{currentStep.title}</h3>
                    <button onClick={handleSkip} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200">
                      <X className="w-4 h-4" />
                    </button>
                 </div>
                 
                 <p className="text-slate-600 dark:text-slate-300 text-sm mb-4 leading-relaxed">
                   {currentStep.content}
                 </p>

                 <div className="flex justify-between items-center">
                    <span className="text-xs text-slate-400 font-medium">
                      Paso {currentStepIndex + 1} de {STEPS.length}
                    </span>
                    
                    {currentStep.action !== 'wait_for_analysis' && (
                        <button 
                        onClick={handleNext}
                        className="bg-brand-primary text-white px-4 py-1.5 rounded text-sm font-medium hover:bg-brand-hover transition-colors flex items-center gap-1"
                        >
                        Siguiente <ChevronRight className="w-3 h-3" />
                        </button>
                    )}

                    {currentStep.action === 'wait_for_analysis' && (
                        <div className="flex items-center gap-2">
                             {/* Backup button in case UI is blocked */}
                             <button 
                                onClick={triggerAnalysis}
                                className="bg-brand-primary/10 hover:bg-brand-primary/20 text-brand-primary px-3 py-1 rounded text-xs font-bold border border-brand-primary/30 md:hidden"
                             >
                                Analizar
                             </button>
                             <div className="text-xs text-brand-primary animate-pulse font-medium flex items-center gap-1">
                                Clic en Analizar <MousePointerClick className="w-3 h-3" />
                             </div>
                        </div>
                    )}
                 </div>
              </div>
           </div>
        </>
      )}
    </div>
  );
};

export default Tutorial;