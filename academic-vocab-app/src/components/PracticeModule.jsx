import React, { useState, useEffect } from 'react';
import { wordsData } from '../data/words';
import { CheckCircle2, XCircle, ArrowRight } from 'lucide-react';

export function PracticeModule() {
  const [currentWord, setCurrentWord] = useState(null);
  const [input, setInput] = useState('');
  const [status, setStatus] = useState('typing'); // 'typing', 'correct', 'incorrect'
  const [hintsUsed, setHintsUsed] = useState(0);

  const getNewWord = () => {
    const randomIndex = Math.floor(Math.random() * wordsData.length);
    setCurrentWord(wordsData[randomIndex]);
    setInput('');
    setStatus('typing');
    setHintsUsed(0);
  };

  useEffect(() => {
    getNewWord();
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    if (input.trim().toLowerCase() === currentWord.word.toLowerCase()) {
      setStatus('correct');
    } else {
      setStatus('incorrect');
      setHintsUsed(h => h + 1);
    }
  };

  if (!currentWord) return null;

  return (
    <div className="max-w-2xl mx-auto mt-12 animate-in slide-in-from-bottom-8 fade-in duration-500">
      <div className="glass-panel rounded-3xl p-8 sm:p-12 relative overflow-hidden">
        {/* Animated background highlights */}
        <div className={`absolute inset-0 opacity-20 transition-colors duration-500 ${
          status === 'correct' ? 'bg-emerald-500' : status === 'incorrect' ? 'bg-rose-500' : 'bg-transparent'
        }`} />

        <div className="relative z-10 text-center">
          <div className="mb-8">
            <span className="inline-block px-4 py-1 rounded-full bg-indigo-500/20 text-indigo-300 text-sm font-bold border border-indigo-500/30 mb-6">
              Meaning: {currentWord.kannada}
            </span>
            <p className="text-xl md:text-2xl text-slate-300 italic font-light leading-relaxed">
              "{currentWord.example.replace(currentWord.word, '_________').replace(currentWord.word.toLowerCase(), '_________')}"
            </p>
          </div>

          <form onSubmit={handleSubmit} className="mt-8 relative">
            <input
              type="text"
              value={input}
              onChange={(e) => {
                setInput(e.target.value);
                setStatus('typing');
              }}
              placeholder="Type the English word..."
              className={`w-full text-center text-3xl font-bold bg-slate-800/80 border-2 rounded-2xl py-4 px-6 focus:outline-none transition-all ${
                status === 'correct' 
                  ? 'border-emerald-500 text-emerald-400' 
                  : status === 'incorrect'
                    ? 'border-rose-500 text-rose-400 focus:border-rose-400'
                    : 'border-slate-700 text-slate-100 focus:border-blue-500'
              }`}
              disabled={status === 'correct'}
              autoFocus
            />

            <div className="mt-6 h-12 flex items-center justify-center">
              {status === 'typing' && (
                <button type="submit" className="bg-blue-600 hover:bg-blue-500 text-white px-8 py-3 rounded-xl font-semibold transition-all shadow-lg hover:shadow-blue-500/25">
                  Check Answer
                </button>
              )}
              {status === 'correct' && (
                <div className="flex flex-col items-center gap-4 animate-in zoom-in">
                  <div className="flex items-center gap-2 text-emerald-400 font-bold text-xl">
                    <CheckCircle2 className="w-6 h-6" />
                    Correct!
                  </div>
                  <button 
                    onClick={getNewWord}
                    className="flex items-center gap-2 bg-slate-800 hover:bg-slate-700 text-white px-6 py-2 rounded-xl transition-all"
                  >
                    Next Word <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              )}
              {status === 'incorrect' && (
                <div className="flex items-center gap-4 text-rose-400 animate-in shake">
                  <XCircle className="w-6 h-6" />
                  <span className="font-semibold">Not quite right. Try again!</span>
                </div>
              )}
            </div>
          </form>

          {hintsUsed > 0 && status !== 'correct' && (
            <div className="mt-8 animate-in fade-in">
              <p className="text-slate-400 text-sm">
                Hint: The word starts with <strong className="text-blue-400 text-lg uppercase">{currentWord.word.substring(0, hintsUsed)}</strong>
                {Array(currentWord.word.length - hintsUsed).fill('_').join(' ')}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
