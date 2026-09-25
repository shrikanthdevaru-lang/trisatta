import React from 'react';
import { Volume2 } from 'lucide-react';

export function WordCard({ word, progress, onMaster, onPractice }) {
  const isMastered = progress.mastered.includes(word.word);
  const isPractice = progress.needsPractice.includes(word.word);

  const speak = (text) => {
    if ('speechSynthesis' in window) {
      // Cancel any ongoing speech
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'en-US';
      utterance.rate = 0.9; // Slightly slower for better comprehension
      window.speechSynthesis.speak(utterance);
    }
  };

  return (
    <div className="glass-card p-6 flex flex-col h-full relative overflow-hidden group">
      {/* Decorative gradient blob */}
      <div className="absolute -top-12 -right-12 w-32 h-32 bg-blue-500/10 rounded-full blur-2xl group-hover:bg-blue-500/20 transition-all duration-500" />
      
      <div className="flex justify-between items-start mb-4 z-10">
        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-blue-400 mb-1 block">
            {word.category}
          </span>
          <h3 className="text-2xl font-bold text-slate-100 flex items-center gap-2">
            {word.word}
            <button 
              onClick={() => speak(`${word.word}. ${word.example}`)}
              className="p-1.5 rounded-full hover:bg-slate-700/50 text-slate-400 hover:text-blue-400 transition-colors"
              title="Listen to pronunciation and example"
            >
              <Volume2 className="w-5 h-5" />
            </button>
          </h3>
          <p className="text-sm font-mono text-slate-400 mt-1">/{word.pronunciation}/</p>
        </div>
        <div className="bg-indigo-500/20 text-indigo-300 px-3 py-1 rounded-full text-sm font-bold border border-indigo-500/30">
          {word.kannada}
        </div>
      </div>

      <div className="flex-1 z-10">
        <p className="text-slate-300 italic text-sm leading-relaxed border-l-2 border-blue-500/50 pl-4 py-1 my-4">
          "{word.example}"
        </p>
      </div>

      <div className="mt-4 pt-4 border-t border-slate-700/50 flex gap-2 z-10">
        <button 
          onClick={() => onMaster(word.word)}
          className={`flex-1 py-2 text-sm font-medium rounded-lg transition-all ${
            isMastered 
              ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' 
              : 'bg-slate-800/50 text-slate-400 hover:bg-slate-700 hover:text-emerald-400'
          }`}
        >
          {isMastered ? 'Mastered' : 'Mark Mastered'}
        </button>
        <button 
          onClick={() => onPractice(word.word)}
          className={`flex-1 py-2 text-sm font-medium rounded-lg transition-all ${
            isPractice 
              ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30' 
              : 'bg-slate-800/50 text-slate-400 hover:bg-slate-700 hover:text-amber-400'
          }`}
        >
          {isPractice ? 'Needs Practice' : 'Needs Practice'}
        </button>
      </div>
    </div>
  );
}
