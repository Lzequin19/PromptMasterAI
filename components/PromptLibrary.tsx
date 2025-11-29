
import React, { useState } from 'react';
import { examplePrompts } from '../data/examplePrompts';
import { PromptCategory } from '../types';
import { Copy, ArrowUpRight, Lightbulb, Tag } from 'lucide-react';

interface PromptLibraryProps {
  onSelectPrompt: (prompt: string) => void;
}

const categories: (PromptCategory | 'Todos')[] = ['Todos', 'Desarrollo', 'Negocios', 'RRHH', 'Ingeniería', 'Marketing', 'Escritura', 'Salud', 'Legal', 'Educación'];

const PromptLibrary: React.FC<PromptLibraryProps> = ({ onSelectPrompt }) => {
  const [activeCategory, setActiveCategory] = useState<PromptCategory | 'Todos'>('Todos');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const filteredPrompts = activeCategory === 'Todos' 
    ? examplePrompts 
    : examplePrompts.filter(p => p.category === activeCategory);

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <section className="mt-16 animate-in fade-in slide-in-from-bottom-8 duration-700">
      <div className="flex items-center gap-3 mb-6">
        <div className="bg-brand-light dark:bg-brand-primary/20 p-2 rounded-lg">
          <Lightbulb className="w-5 h-5 text-brand-primary dark:text-brand-primary" />
        </div>
        <div>
           <h3 className="text-xl font-bold text-brand-dark dark:text-slate-200">Biblioteca de Ejemplos</h3>
           <p className="text-slate-500 dark:text-slate-400 text-sm">Prompts diseñados con buenas prácticas para inspirarte.</p>
        </div>
      </div>

      {/* Category Tabs */}
      <div className="flex overflow-x-auto pb-4 gap-2 mb-4 scrollbar-hide">
        {categories.map(cat => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
              activeCategory === cat
                ? 'bg-brand-primary text-white'
                : 'bg-white dark:bg-[#1a191a] text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredPrompts.map((prompt) => (
          <div key={prompt.id} className="bg-white dark:bg-[#1a191a] border border-slate-200 dark:border-slate-800 rounded-xl p-5 flex flex-col hover:border-brand-primary/30 transition-colors group shadow-lg">
            
            <div className="flex justify-between items-start mb-3">
              <span className="inline-flex items-center gap-1 px-2 py-1 rounded text-[10px] font-medium bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 border border-slate-200 dark:border-slate-700 uppercase tracking-wide">
                <Tag className="w-3 h-3" />
                {prompt.category}
              </span>
            </div>

            <h4 className="text-lg font-semibold text-brand-dark dark:text-slate-200 mb-2 group-hover:text-brand-primary dark:group-hover:text-brand-primary transition-colors">
              {prompt.title}
            </h4>

            <div className="bg-slate-50 dark:bg-[#2d2b2c] p-3 rounded-lg border border-slate-200 dark:border-slate-800 mb-4 flex-grow relative overflow-hidden transition-colors">
                <p className="text-slate-600 dark:text-slate-400 text-xs font-mono whitespace-pre-line line-clamp-6">
                    {prompt.content}
                </p>
                <div className="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-slate-50 dark:from-[#2d2b2c] to-transparent pointer-events-none transition-colors"></div>
            </div>

            {/* Why it works */}
            <div className="bg-brand-light dark:bg-brand-primary/10 border border-brand-primary/20 dark:border-brand-primary/30 rounded-lg p-3 mb-4 transition-colors">
                <p className="text-xs text-brand-dark dark:text-brand-light leading-relaxed">
                    <strong className="block text-brand-primary dark:text-brand-primary mb-1 text-[10px] uppercase">¿Por qué es efectivo?</strong>
                    {prompt.explanation}
                </p>
            </div>

            <div className="flex gap-2 mt-auto pt-2 border-t border-slate-100 dark:border-slate-800 transition-colors">
              <button
                onClick={() => handleCopy(prompt.content, prompt.id)}
                className="flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 text-xs font-medium transition-colors"
              >
                <Copy className="w-3.5 h-3.5" />
                {copiedId === prompt.id ? 'Copiado' : 'Copiar'}
              </button>
              <button
                onClick={() => onSelectPrompt(prompt.content)}
                className="flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-lg bg-brand-primary hover:bg-brand-hover text-white text-xs font-medium transition-colors shadow-lg shadow-brand-primary/20"
              >
                <ArrowUpRight className="w-3.5 h-3.5" />
                Probar
              </button>
            </div>

          </div>
        ))}
      </div>
    </section>
  );
};

export default PromptLibrary;
