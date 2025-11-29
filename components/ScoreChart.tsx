import React from 'react';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, Tooltip } from 'recharts';
import { PromptAnalysis } from '../types';

interface ScoreChartProps {
  scores: PromptAnalysis['scores'];
  isDarkMode?: boolean;
}

const ScoreChart: React.FC<ScoreChartProps> = ({ scores, isDarkMode = true }) => {
  const data = [
    { subject: 'Objetivo', A: scores.objective, fullMark: 10 },
    { subject: 'Contexto', A: scores.context, fullMark: 10 },
    { subject: 'Rol', A: scores.role, fullMark: 10 },
    { subject: 'Formato', A: scores.format, fullMark: 10 },
    { subject: 'Instrucciones', A: scores.instructions, fullMark: 10 },
    { subject: 'Ejemplos', A: scores.examples, fullMark: 10 },
    { subject: 'Restricciones', A: scores.constraints, fullMark: 10 },
  ];

  const gridColor = isDarkMode ? "#475569" : "#e2e8f0";
  const textColor = isDarkMode ? "#94a3b8" : "#64748b";
  const tooltipBg = isDarkMode ? "#2d2b2c" : "#ffffff";
  const tooltipBorder = isDarkMode ? "#334155" : "#e2e8f0";
  const tooltipText = isDarkMode ? "#f1f5f9" : "#1e293b";
  const brandColor = "#1c89af";

  return (
    <div className="w-full h-64 sm:h-80 bg-white dark:bg-[#1a191a] rounded-xl p-4 shadow-lg border border-slate-200 dark:border-slate-700 transition-colors">
      <h3 className="text-center text-brand-dark dark:text-slate-300 font-semibold mb-2">Evaluación de Dimensiones</h3>
      <ResponsiveContainer width="100%" height="100%">
        <RadarChart cx="50%" cy="50%" outerRadius="70%" data={data}>
          <PolarGrid stroke={gridColor} />
          <PolarAngleAxis dataKey="subject" tick={{ fill: textColor, fontSize: 12 }} />
          <PolarRadiusAxis angle={30} domain={[0, 10]} tick={false} axisLine={false} />
          <Radar
            name="Puntaje"
            dataKey="A"
            stroke={brandColor}
            strokeWidth={2}
            fill={brandColor}
            fillOpacity={0.5}
          />
          <Tooltip 
            contentStyle={{ backgroundColor: tooltipBg, borderColor: tooltipBorder, color: tooltipText, borderRadius: '8px', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
            itemStyle={{ color: brandColor }}
          />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default ScoreChart;