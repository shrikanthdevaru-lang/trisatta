import React, { useState } from 'react';
import { wordsData } from '../data/words';
import { ChevronLeft, ChevronRight, RotateCw } from 'lucide-react';

export function Flashcards({ progress, markMastered, markNeedsPractice }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);

  const word = wordsData[currentIndex];
  const isMastered = progress.mastered.includes(word.word);
  const isPractice = progress.needsPractice.includes(word.word);

  const nextCard = () => {
    setIsFlipped(false);
    setTimeout(() => {
      setCurrentIndex((prev) => (prev + 1) % wordsData.length);
    }, 150);
  };

  const prevCard = () => {
    setIsFlipped(false);
    setTimeout(() => {
      setCurrentIndex((prev) => (prev - 1 + wordsData.length) % wordsData.length);
    }, 150);
  };

  return (
    <div className="max-w-3xl mx-auto mt-8 flex flex-col items-center animate-in fade-in duration-500">
      
      <div className="text-slate-400 mb-6 font-mono">
        Card {currentIndex + 1} of {wordsData.length}
      </div>

      {/* 3D Flashcard Container */}
      <div className="relative w-full aspect-[4/3] md:aspect-[16/9] perspective-1000">
        <div 
          className={`w-full h-full absolute transition-all duration-700 [transform-style:preserve-3d] cursor-pointer ${
            isFlipped ? '[transform:rotateY(180deg)]' : ''
          }`}
          onClick={() => setIsFlipped(!isFlipped)}
        >
          
          {/* Front of card */}
          <div className="absolute inset-0 backface-hidden [backface-visibility:hidden]">
            <div className="w-full h-full glass-panel rounded-3xl p-8 flex flex-col items-center justify-center relative overflow-hidden group hover:border-blue-500/30 transition-colors">
              <div className="absolute top-6 right-6 text-slate-500 group-hover:text-blue-400 transition-colors">
                <RotateCw className="w-6 h-6 animate-[spin_4s_linear_infinite]" />
              </div>
              <span className="text-sm font-semibold tracking-widest text-blue-400 uppercase mb-4">{word.category}</span>
              <h2 className="text-5xl md:text-7xl font-bold text-slate-50 tracking-tight">{word.word}</h2>
              <p className="mt-8 text-slate-400">Click to reveal definition</p>
            </div>
          </div>

          {/* Back of card */}
          <div className="absolute inset-0 backface-hidden [backface-visibility:hidden] [transform:rotateY(180deg)]">
            <div className="w-full h-full glass-panel bg-slate-800/80 rounded-3xl p-8 flex flex-col items-center justify-center relative border-indigo-500/30 border-2">
              <div className="text-center space-y-6 max-w-xl">
                <div>
                  <h3 className="text-3xl font-bold text-slate-100">{word.word}</h3>
                  <p className="text-blue-400 font-mono mt-1">/{word.pronunciation}/</p>
                </div>
                
                <div className="inline-block bg-indigo-500/20 text-indigo-300 px-6 py-2 rounded-full text-xl font-bold border border-indigo-500/30">
                  {word.kannada}
                </div>

                <div className="pt-6 border-t border-slate-700">
                  <p className="text-xl text-slate-300 italic leading-relaxed">
                    "{word.example}"
                  </p>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* Controls */}
      <div className="flex items-center gap-8 mt-12 w-full justify-center">
        <button 
          onClick={prevCard}
          className="p-4 rounded-full glass-panel hover:bg-slate-800/80 transition-all hover:scale-110 active:scale-95"
        >
          <ChevronLeft className="w-8 h-8 text-slate-300" />
        </button>
        
        <div className="flex gap-4">
          <button 
            onClick={() => markNeedsPractice(word.word)}
            className={`px-6 py-3 rounded-xl font-bold transition-all ${
              isPractice 
                ? 'bg-amber-500 text-slate-900 shadow-[0_0_20px_rgba(245,158,11,0.4)]' 
                : 'glass-panel text-amber-400 hover:bg-amber-500/10 border border-amber-500/30'
            }`}
          >
            Needs Practice
          </button>
          <button 
            onClick={() => markMastered(word.word)}
            className={`px-6 py-3 rounded-xl font-bold transition-all ${
              isMastered 
                ? 'bg-emerald-500 text-slate-900 shadow-[0_0_20px_rgba(16,185,129,0.4)]' 
                : 'glass-panel text-emerald-400 hover:bg-emerald-500/10 border border-emerald-500/30'
            }`}
          >
            Mastered
          </button>
        </div>

        <button 
          onClick={nextCard}
          className="p-4 rounded-full glass-panel hover:bg-slate-800/80 transition-all hover:scale-110 active:scale-95"
        >
          <ChevronRight className="w-8 h-8 text-slate-300" />
        </button>
      </div>

    </div>
  );
}
