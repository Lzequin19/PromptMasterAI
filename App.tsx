import React, { useState, useRef, useEffect } from 'react';
import { evaluatePrompt } from './services/geminiService';
import { PromptAnalysis, UserStats, GamificationUpdate } from './types';
import { loadUserStats, processGamification } from './services/gamificationService';
import ScoreChart from './components/ScoreChart';
import AnalysisResults from './components/AnalysisResults';
import PromptLibrary from './components/PromptLibrary';
import UserProfile from './components/UserProfile';
import GamificationToast from './components/GamificationToast';
import Tutorial from './components/Tutorial';
import WelcomeScreen from './components/WelcomeScreen';
import { Send, Loader2, Info, Moon, Sun, Instagram, MessageCircle, Heart } from 'lucide-react';

const App: React.FC = () => {
  const [inputPrompt, setInputPrompt] = useState('');
  const [analysis, setAnalysis] = useState<PromptAnalysis | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Theme State
  const [isDarkMode, setIsDarkMode] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('theme') === 'dark' || 
             (!localStorage.getItem('theme') && window.matchMedia('(prefers-color-scheme: dark)').matches);
    }
    return true;
  });

  // Welcome Screen State
  const [showWelcome, setShowWelcome] = useState(true);

  // Gamification State
  const [userStats, setUserStats] = useState<UserStats | null>(null);
  const [gameUpdate, setGameUpdate] = useState<GamificationUpdate | null>(null);
  
  // Tutorial State
  const [showTutorial, setShowTutorial] = useState(false);

  const inputRef = useRef<HTMLTextAreaElement>(null);

  // Apply theme class to html element
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [isDarkMode]);

  // Load stats on mount
  useEffect(() => {
    setUserStats(loadUserStats());
    
    // Check if tutorial has been seen, BUT don't show it yet if Welcome Screen is up.
    // We handle the trigger in handleStartApp
  }, []);

  const handleStartApp = () => {
    setShowWelcome(false);
    
    // Check tutorial status after starting app
    const tutorialCompleted = localStorage.getItem('promptMaster_tutorial_completed');
    if (!tutorialCompleted) {
       setTimeout(() => setShowTutorial(true), 800);
    }
  };

  const handleTutorialComplete = () => {
    setShowTutorial(false);
    localStorage.setItem('promptMaster_tutorial_completed', 'true');
    // Clear the demo prompt if they finished
    if (inputPrompt.includes("email para vender zapatos")) {
      setInputPrompt("");
      setAnalysis(null);
    }
  };

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
  };

  const handleAnalyze = async () => {
    if (!inputPrompt.trim()) return;
    
    setLoading(true);
    setError(null);
    setAnalysis(null);

    try {
      const result = await evaluatePrompt(inputPrompt);
      setAnalysis(result);

      // Process Gamification
      if (userStats) {
        const update = processGamification(userStats, result);
        setUserStats(update.newStats);
        setGameUpdate(update);
      }

    } catch (err) {
      setError("Ocurrió un error al analizar el prompt. Por favor intenta de nuevo.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectExample = (prompt: string) => {
    setInputPrompt(prompt);
    // Smooth scroll to input
    if (inputRef.current) {
        inputRef.current.focus();
        inputRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 8) return 'text-green-500 dark:text-green-400';
    if (score >= 5) return 'text-amber-500 dark:text-amber-400';
    return 'text-red-500 dark:text-red-400';
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-brand-dark text-brand-dark dark:text-slate-200 font-sans selection:bg-brand-primary/30 transition-colors duration-300 flex flex-col">
      
      {/* Welcome Landing Screen */}
      {showWelcome && <WelcomeScreen onStart={handleStartApp} />}

      <Tutorial 
        isActive={showTutorial && !showWelcome}
        isLoading={loading}
        hasAnalysis={!!analysis}
        onComplete={handleTutorialComplete}
        setInputPrompt={setInputPrompt}
        triggerAnalysis={handleAnalyze}
      />

      {/* Header */}
      <header className="bg-white/80 dark:bg-[#1a191a]/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 sticky top-0 z-50 transition-colors duration-300">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="h-10 w-auto overflow-hidden rounded-md bg-white px-2 py-1 flex items-center justify-center border border-slate-100 dark:border-slate-700">
               <img 
                 src="https://i.ibb.co/pjyn09MV/Somos-Zeta-Exportar-Mesa-de-trabajo-1-copia-5.png" 
                 alt="Somos Zeta" 
                 className="h-8 w-auto object-contain"
               />
            </div>
            <div className="hidden sm:block">
              <h1 className="text-xl font-bold text-brand-dark dark:text-slate-100">PromptMaster AI</h1>
              <p className="text-xs text-slate-500 dark:text-slate-400">Analizador y Optimizador Educativo</p>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
             <div className="text-xs text-slate-500 hidden md:block">
               Potenciado por Gemini 2.5 Flash
             </div>
             <button 
               onClick={toggleTheme}
               className="p-2 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
               aria-label="Toggle Theme"
             >
                {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
             </button>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-8 pb-12 flex-grow w-full">
        
        {/* User Profile Section */}
        {userStats && <UserProfile stats={userStats} />}

        {/* Intro / Input Section */}
        <section className="mb-12 max-w-3xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-brand-primary to-cyan-600 dark:from-brand-primary dark:to-cyan-400 bg-clip-text text-transparent">
                Perfecciona tus Prompts
            </h2>
            <p className="text-slate-600 dark:text-slate-400 mb-8 text-lg">
                Ingresa tu prompt crudo y observa cómo lo transformamos usando buenas prácticas de ingeniería de prompts.
            </p>

            <div className="relative group">
                <div className="absolute -inset-1 bg-gradient-to-r from-brand-primary to-cyan-500 rounded-xl blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200"></div>
                <div id="prompt-input" className="relative bg-white dark:bg-[#1a191a] rounded-xl p-2 border border-slate-200 dark:border-slate-700 shadow-2xl">
                    <textarea
                        ref={inputRef}
                        value={inputPrompt}
                        onChange={(e) => setInputPrompt(e.target.value)}
                        placeholder="Escribe tu prompt aquí... (ej: 'Escribe un email de marketing para vender zapatos')"
                        className="w-full bg-white dark:bg-[#1a191a] text-brand-dark dark:text-slate-200 placeholder-slate-400 dark:placeholder-slate-600 rounded-lg p-4 min-h-[120px] focus:outline-none focus:ring-2 focus:ring-brand-primary/50 resize-y transition-colors"
                    />
                    <div className="flex justify-between items-center mt-2 px-1 pb-1">
                        <span className="text-xs text-slate-500 dark:text-slate-600">
                            {inputPrompt.length} caracteres
                        </span>
                        <button
                            id="analyze-btn"
                            onClick={handleAnalyze}
                            disabled={loading || !inputPrompt.trim()}
                            className="bg-brand-primary hover:bg-brand-hover disabled:bg-slate-300 dark:disabled:bg-slate-700 disabled:cursor-not-allowed text-white px-6 py-2 rounded-lg font-medium transition-all flex items-center gap-2 shadow-lg shadow-brand-primary/20 dark:shadow-brand-primary/40"
                        >
                            {loading ? (
                                <>
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                    Analizando...
                                </>
                            ) : (
                                <>
                                    <Send className="w-4 h-4" />
                                    Analizar y Optimizar
                                </>
                            )}
                        </button>
                    </div>
                </div>
            </div>
            {error && <p className="mt-4 text-red-600 dark:text-red-400 text-sm bg-red-100 dark:bg-red-900/20 py-2 rounded border border-red-200 dark:border-red-900/50">{error}</p>}
        </section>

        {/* Results Section */}
        {analysis && (
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-8 animate-in fade-in slide-in-from-bottom-8 duration-700 mb-16">
            
            {/* Left Column: Metrics */}
            <div id="score-panel" className="xl:col-span-1 space-y-6">
                <div className="bg-white dark:bg-[#1a191a] rounded-xl border border-slate-200 dark:border-slate-800 p-6 shadow-xl relative overflow-hidden transition-colors">
                    <div className="absolute top-0 right-0 p-4 opacity-5 dark:opacity-10">
                        <Info className="w-24 h-24 text-brand-dark dark:text-white" />
                    </div>
                    <div className="text-center mb-6">
                        <span className="text-sm text-slate-500 dark:text-slate-400 uppercase tracking-widest font-semibold">Puntaje General</span>
                        <div className={`text-6xl font-bold mt-2 ${getScoreColor(analysis.scores.overall)}`}>
                            {analysis.scores.overall.toFixed(1)}
                            <span className="text-2xl text-slate-400 dark:text-slate-600">/10</span>
                        </div>
                    </div>
                    <div className="space-y-3">
                        <div className="flex justify-between text-sm">
                            <span className="text-slate-600 dark:text-slate-400">Objetivo</span>
                            <span className={getScoreColor(analysis.scores.objective)}>{analysis.scores.objective}</span>
                        </div>
                         <div className="flex justify-between text-sm">
                            <span className="text-slate-600 dark:text-slate-400">Contexto</span>
                            <span className={getScoreColor(analysis.scores.context)}>{analysis.scores.context}</span>
                        </div>
                         <div className="flex justify-between text-sm">
                            <span className="text-slate-600 dark:text-slate-400">Rol</span>
                            <span className={getScoreColor(analysis.scores.role)}>{analysis.scores.role}</span>
                        </div>
                         <div className="flex justify-between text-sm">
                            <span className="text-slate-600 dark:text-slate-400">Restricciones</span>
                            <span className={getScoreColor(analysis.scores.constraints)}>{analysis.scores.constraints}</span>
                        </div>
                    </div>
                </div>
                
                <ScoreChart scores={analysis.scores} isDarkMode={isDarkMode} />
                
                <div className="bg-slate-100 dark:bg-[#1a191a]/50 p-4 rounded-xl border border-slate-200 dark:border-slate-800 text-xs text-slate-600 dark:text-slate-500 leading-relaxed transition-colors">
                    <strong className="text-brand-dark dark:text-slate-400 block mb-1">Nota Pedagógica:</strong>
                    Un buen prompt debe equilibrar especificidad con flexibilidad. Usar un "Rol" ayuda a la IA a adoptar el tono correcto, mientras que las "Restricciones" evitan alucinaciones o formatos indeseados.
                </div>
            </div>

            {/* Right Column: Detailed Analysis & Optimization */}
            <div id="feedback-grid" className="xl:col-span-2">
                <div id="comparison-section">
                   <AnalysisResults analysis={analysis} originalPrompt={inputPrompt} />
                </div>
            </div>

          </div>
        )}

        {/* Example Library Section */}
        <PromptLibrary onSelectPrompt={handleSelectExample} />

      </main>

      {/* Footer */}
      <footer className="bg-white dark:bg-[#1a191a] border-t border-slate-200 dark:border-slate-800 py-12 transition-colors duration-300">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
            <div className="flex flex-col gap-4">
              <h3 className="text-lg font-bold text-brand-dark dark:text-slate-200 flex items-center gap-3">
                 <div className="h-8 w-auto bg-white border border-slate-200 px-2 py-1 rounded flex items-center justify-center">
                    <img src="https://i.ibb.co/pjyn09MV/Somos-Zeta-Exportar-Mesa-de-trabajo-1-copia-5.png" alt="Zeta Logo" className="h-6 w-auto" />
                 </div>
                 Somos Zeta Digital Advice
              </h3>
              <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed max-w-sm">
                Para seguir conectado con el mundo de la Inteligencia Artificial y la tecnología, te invitamos a sumarte a nuestras comunidades.
              </p>
              <div className="flex items-center gap-1 text-xs text-slate-500 dark:text-slate-500 mt-2">
                <span>Desarrollado con</span>
                <Heart className="w-3 h-3 text-red-500 fill-current" />
                <span>por Somos Zeta Digital Advice</span>
              </div>
            </div>

            <div className="flex flex-col gap-4">
              <h4 className="font-semibold text-brand-dark dark:text-slate-300">Nuestras Redes</h4>

              <a href="https://www.instagram.com/somoszeta_da" target="_blank" rel="noopener noreferrer"
                 className="flex items-center gap-3 text-slate-600 dark:text-slate-400 hover:text-[#E1306C] dark:hover:text-[#E1306C] transition-colors group">
                  <div className="bg-slate-100 dark:bg-slate-800 p-2 rounded-lg group-hover:bg-[#E1306C]/10 transition-colors">
                     <Instagram className="w-5 h-5" />
                  </div>
                  <span className="text-sm font-medium">Seguinos en Instagram para tips y novedades</span>
              </a>

              <a href="https://www.tiktok.com/@somoszeta.lab" target="_blank" rel="noopener noreferrer"
                 className="flex items-center gap-3 text-slate-600 dark:text-slate-400 hover:text-brand-dark dark:hover:text-white transition-colors group">
                  <div className="bg-slate-100 dark:bg-slate-800 p-2 rounded-lg group-hover:bg-slate-200 dark:group-hover:bg-slate-700 transition-colors">
                     <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                        <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/>
                     </svg>
                  </div>
                  <span className="text-sm font-medium">Seguinos en TikTok para tips</span>
              </a>

              <a href="https://whatsapp.com/channel/0029Vb5vxcqC1FuBgMpWtM33" target="_blank" rel="noopener noreferrer"
                 className="flex items-center gap-3 text-slate-600 dark:text-slate-400 hover:text-[#25D366] dark:hover:text-[#25D366] transition-colors group">
                  <div className="bg-slate-100 dark:bg-slate-800 p-2 rounded-lg group-hover:bg-[#25D366]/10 transition-colors">
                     <MessageCircle className="w-5 h-5" />
                  </div>
                  <span className="text-sm font-medium">Sumate a nuestro canal de WhatsApp "Pulso Digital"</span>
              </a>
            </div>
          </div>
        </div>
      </footer>

      {/* Gamification Toast */}
      <GamificationToast 
        update={gameUpdate} 
        onClose={() => setGameUpdate(null)} 
      />

    </div>
  );
};

export default App;
