import React, { useState, useEffect } from 'react';
import { PromptAnalysis } from '../types';
import { CheckCircle, AlertTriangle, ArrowRight, BookOpen, Copy, Plus, RefreshCw, Trash2, Code, FileText, AlignLeft } from 'lucide-react';

interface AnalysisResultsProps {
  analysis: PromptAnalysis;
  originalPrompt: string;
}

type OutputFormat = 'json' | 'markdown' | 'text';

const AnalysisResults: React.FC<AnalysisResultsProps> = ({ analysis, originalPrompt }) => {
  const [copied, setCopied] = useState(false);
  const [format, setFormat] = useState<OutputFormat>('markdown'); // Default to Markdown as it is most readable
  const [formattedContent, setFormattedContent] = useState('');

  // Transform the content whenever analysis or format changes
  useEffect(() => {
    let parsedObj: Record<string, any> = {};
    
    // Try to parse the optimizedPrompt string as JSON. 
    // If it fails (Gemini sent plain text), wrap it in a generic object.
    try {
      parsedObj = JSON.parse(analysis.optimizedPrompt);
    } catch (e) {
      parsedObj = { content: analysis.optimizedPrompt };
    }

    let content = '';

    switch (format) {
      case 'json':
        content = JSON.stringify(parsedObj, null, 2);
        break;
      case 'markdown':
        content = Object.entries(parsedObj).map(([key, value]) => {
          // Capitalize and clean keys (e.g., "output_format" -> "Output Format")
          const prettyKey = key.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
          return `**${prettyKey}:**\n${value}`;
        }).join('\n\n');
        break;
      case 'text':
        content = Object.entries(parsedObj).map(([key, value]) => {
          const prettyKey = key.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
          return `${prettyKey}:\n${value}`;
        }).join('\n\n----------------\n\n');
        break;
    }

    setFormattedContent(content);
  }, [analysis.optimizedPrompt, format]);

  const handleCopy = () => {
    navigator.clipboard.writeText(formattedContent);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const getChangeIcon = (type: 'addition' | 'modification' | 'removal') => {
    switch(type) {
      case 'addition': return <Plus className="w-4 h-4 text-green-500 dark:text-green-400" />;
      case 'modification': return <RefreshCw className="w-4 h-4 text-amber-500 dark:text-amber-400" />;
      case 'removal': return <Trash2 className="w-4 h-4 text-red-500 dark:text-red-400" />;
    }
  };

  const getChangeLabel = (type: 'addition' | 'modification' | 'removal') => {
    switch(type) {
      case 'addition': return 'Agregado';
      case 'modification': return 'Modificado';
      case 'removal': return 'Eliminado';
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      
      {/* Explanation Section */}
      <div className="bg-brand-light dark:bg-brand-primary/20 border border-brand-primary/30 dark:border-brand-primary/40 rounded-lg p-6 transition-colors">
        <div className="flex items-start gap-3">
            <BookOpen className="w-6 h-6 text-brand-primary dark:text-brand-primary mt-1 flex-shrink-0" />
            <div>
                <h3 className="text-lg font-semibold text-brand-dark dark:text-blue-100 mb-2">Diagnóstico General</h3>
                <p className="text-brand-dark dark:text-blue-200 leading-relaxed">{analysis.explanation}</p>
            </div>
        </div>
      </div>

      {/* Feedback Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Strengths */}
        <div className="bg-white dark:bg-[#1a191a] rounded-lg p-5 border border-green-200 dark:border-green-900/30 shadow-sm transition-colors">
          <h4 className="flex items-center gap-2 text-green-600 dark:text-green-400 font-semibold mb-4">
            <CheckCircle className="w-5 h-5" />
            Fortalezas
          </h4>
          <ul className="space-y-2">
            {analysis.feedback.strengths && analysis.feedback.strengths.length > 0 ? (
              analysis.feedback.strengths.map((str, idx) => (
                <li key={idx} className="text-brand-dark dark:text-slate-300 text-sm flex items-start gap-2">
                  <span className="w-1.5 h-1.5 bg-green-500 rounded-full mt-1.5 shrink-0"></span>
                  {str}
                </li>
              ))
            ) : (
                <li className="text-slate-500 italic text-sm">No se detectaron fortalezas claras.</li>
            )}
          </ul>
        </div>

        {/* Weaknesses */}
        <div className="bg-white dark:bg-[#1a191a] rounded-lg p-5 border border-amber-200 dark:border-amber-900/30 shadow-sm transition-colors">
          <h4 className="flex items-center gap-2 text-amber-600 dark:text-amber-400 font-semibold mb-4">
            <AlertTriangle className="w-5 h-5" />
            Áreas de Mejora
          </h4>
          <ul className="space-y-2">
            {analysis.feedback.weaknesses && analysis.feedback.weaknesses.length > 0 ? (
              analysis.feedback.weaknesses.map((weak, idx) => (
                <li key={idx} className="text-brand-dark dark:text-slate-300 text-sm flex items-start gap-2">
                   <span className="w-1.5 h-1.5 bg-amber-500 rounded-full mt-1.5 shrink-0"></span>
                   {weak}
                </li>
              ))
            ) : (
                <li className="text-slate-500 italic text-sm">¡Excelente trabajo! Pocas debilidades detectadas.</li>
            )}
          </ul>
        </div>
      </div>

      {/* Comparison Header */}
      <div className="relative py-4">
        <div className="absolute inset-0 flex items-center" aria-hidden="true">
          <div className="w-full border-t border-slate-200 dark:border-slate-700 transition-colors"></div>
        </div>
        <div className="relative flex justify-center">
          <span className="bg-slate-50 dark:bg-brand-dark px-4 text-sm text-slate-500 dark:text-slate-400 font-medium tracking-wider uppercase transition-colors">
            Optimización y Comparación
          </span>
        </div>
      </div>

      {/* Key Changes Breakdown */}
      {analysis.key_changes && analysis.key_changes.length > 0 && (
        <div className="bg-white dark:bg-[#1a191a] border border-slate-200 dark:border-slate-700 rounded-lg overflow-hidden transition-colors shadow-sm">
          <div className="bg-slate-50 dark:bg-[#2d2b2c] px-4 py-3 border-b border-slate-200 dark:border-slate-700">
             <h4 className="text-brand-primary dark:text-brand-primary font-semibold text-sm flex items-center gap-2">
                <RefreshCw className="w-4 h-4" />
                Diferencias Clave Implementadas
             </h4>
          </div>
          <div className="divide-y divide-slate-100 dark:divide-slate-800/50">
            {analysis.key_changes.map((change, idx) => (
              <div key={idx} className="p-4 flex items-start gap-4">
                <div className={`mt-1 p-1.5 rounded-md bg-opacity-20 flex-shrink-0 
                  ${change.type === 'addition' ? 'bg-green-500' : change.type === 'modification' ? 'bg-amber-500' : 'bg-red-500'}`}>
                   {getChangeIcon(change.type)}
                </div>
                <div>
                   <div className="flex items-center gap-2 mb-1">
                      <span className="text-brand-dark dark:text-slate-200 font-medium text-sm">{change.title}</span>
                      <span className={`text-[10px] px-1.5 py-0.5 rounded border uppercase tracking-wide
                        ${change.type === 'addition' ? 'text-green-600 dark:text-green-400 border-green-200 dark:border-green-900 bg-green-50 dark:bg-green-900/20' : 
                          change.type === 'modification' ? 'text-amber-600 dark:text-amber-400 border-amber-200 dark:border-amber-900 bg-amber-50 dark:bg-amber-900/20' : 
                          'text-red-600 dark:text-red-400 border-red-200 dark:border-red-900 bg-red-50 dark:bg-red-900/20'}`}>
                        {getChangeLabel(change.type)}
                      </span>
                   </div>
                   <p className="text-slate-600 dark:text-slate-400 text-xs">{change.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Comparison View */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 relative">
        
        {/* Connector Arrow (Desktop) */}
        <div className="hidden lg:flex absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10 w-10 h-10 bg-white dark:bg-[#1a191a] rounded-full border border-slate-200 dark:border-slate-600 items-center justify-center shadow-xl transition-colors">
             <ArrowRight className="w-5 h-5 text-brand-primary dark:text-brand-primary" />
        </div>

        {/* Connector Arrow (Mobile) */}
         <div className="lg:hidden flex justify-center -my-3 z-10">
             <div className="w-16 h-8 bg-white dark:bg-[#1a191a] rounded-full border border-slate-200 dark:border-slate-600 flex items-center justify-center shadow-xl transition-colors gap-2">
                <span className="text-[10px] font-bold text-slate-400">VS</span>
             </div>
        </div>
        
        {/* Before */}
        <div className="flex flex-col h-full group">
            <div className="bg-red-50 dark:bg-red-900/10 text-red-600 dark:text-red-300 text-xs font-bold uppercase tracking-wider py-3 px-5 rounded-t-lg border-t border-x border-red-200 dark:border-red-900/20 flex justify-between items-center transition-colors h-[50px]">
                <span>Antes</span>
                <span className="text-[10px] opacity-70 dark:opacity-60 font-normal normal-case hidden sm:inline">Tu versión original</span>
            </div>
            <div className="bg-white dark:bg-[#1a191a] p-6 rounded-b-lg border border-slate-200 dark:border-slate-800 text-brand-dark dark:text-slate-400 text-sm whitespace-pre-wrap flex-grow h-full font-mono relative transition-colors shadow-sm">
                {originalPrompt}
                <div className="absolute top-0 left-0 w-1 h-full bg-red-400/50 dark:bg-red-500/20 rounded-l"></div>
            </div>
        </div>

        {/* After */}
        <div className="flex flex-col h-full relative group shadow-2xl shadow-brand-primary/5">
             <div className="bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-300 text-xs font-bold uppercase tracking-wider px-3 sm:px-5 rounded-t-lg border-t border-x border-green-200 dark:border-green-900/30 flex justify-between items-center transition-colors h-[50px]">
                <span className="flex items-center gap-2">
                    <span className="hidden sm:inline">Optimizado</span>
                    <span className="sm:hidden">Nuevo</span>
                    <span className="inline-block w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                </span>

                <div className="flex items-center gap-2">
                  {/* Format Selector */}
                  <div className="flex bg-white dark:bg-[#1a191a] rounded-md p-0.5 border border-green-200 dark:border-green-900/40">
                    <button 
                      onClick={() => setFormat('markdown')}
                      title="Markdown (Chat)"
                      className={`p-1.5 rounded ${format === 'markdown' ? 'bg-green-100 dark:bg-green-900/50 text-green-700 dark:text-green-400' : 'text-slate-400 hover:text-slate-600'}`}
                    >
                      <FileText className="w-3.5 h-3.5" />
                    </button>
                    <button 
                      onClick={() => setFormat('json')}
                      title="JSON (API)"
                      className={`p-1.5 rounded ${format === 'json' ? 'bg-green-100 dark:bg-green-900/50 text-green-700 dark:text-green-400' : 'text-slate-400 hover:text-slate-600'}`}
                    >
                      <Code className="w-3.5 h-3.5" />
                    </button>
                    <button 
                      onClick={() => setFormat('text')}
                      title="Texto Simple"
                      className={`p-1.5 rounded ${format === 'text' ? 'bg-green-100 dark:bg-green-900/50 text-green-700 dark:text-green-400' : 'text-slate-400 hover:text-slate-600'}`}
                    >
                      <AlignLeft className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  
                  <div className="relative">
                      <button 
                          onClick={handleCopy}
                          className={`flex items-center gap-1.5 transition-all duration-300 px-3 py-1.5 rounded-md border 
                          ${copied 
                              ? 'bg-green-500 text-white border-green-500' 
                              : 'bg-white dark:bg-[#1a191a] text-green-600 dark:text-green-400 border-green-200 dark:border-green-900/50 hover:border-green-400'
                          }`}
                      >
                          {copied ? <CheckCircle className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                          <span className="text-[10px] font-bold hidden sm:inline">{copied ? 'Copiado' : 'Copiar'}</span>
                      </button>
                      
                      {/* Floating Tooltip Confirmation */}
                      <div className={`absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 bg-brand-dark text-white text-[10px] py-1 px-2 rounded shadow-lg pointer-events-none transition-all duration-300 whitespace-nowrap z-20
                          ${copied ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'}`}>
                          ¡Copiado!
                          <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-brand-dark"></div>
                      </div>
                  </div>
                </div>
            </div>
            
            <div className="bg-slate-50 dark:bg-[#2d2b2c] p-6 rounded-b-lg border border-green-200 dark:border-green-900/30 text-brand-dark dark:text-green-50 text-sm flex-grow h-full font-mono relative transition-colors overflow-auto max-h-[500px]">
                <pre className="whitespace-pre-wrap font-mono text-xs sm:text-sm">
                  {formattedContent}
                </pre>
                <div className="absolute top-0 left-0 w-1 h-full bg-green-500 rounded-l"></div>
            </div>
        </div>

      </div>
    </div>
  );
};

export default AnalysisResults;