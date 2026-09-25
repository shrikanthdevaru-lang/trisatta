import React, { useState, useMemo } from 'react';
import { Search, Filter } from 'lucide-react';
import { wordsData } from '../data/words';
import { WordCard } from './WordCard';

export function Dashboard({ progress, markMastered, markNeedsPractice }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  
  const categories = ['All', ...new Set(wordsData.map(w => w.category))];

  const filteredWords = useMemo(() => {
    return wordsData.filter(word => {
      const matchesSearch = 
        word.word.toLowerCase().includes(searchTerm.toLowerCase()) || 
        word.kannada.includes(searchTerm);
      const matchesCategory = selectedCategory === 'All' || word.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [searchTerm, selectedCategory]);

  // Calculate stats
  const totalWords = wordsData.length;
  const masteredCount = progress.mastered.length;
  const practiceCount = progress.needsPractice.length;
  const progressPercent = Math.round((masteredCount / totalWords) * 100) || 0;

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="glass-panel rounded-2xl p-6 flex flex-col justify-center items-center">
          <div className="text-4xl font-bold text-blue-400 mb-2">{progressPercent}%</div>
          <div className="text-slate-400 text-sm uppercase tracking-wider font-semibold">Mastery</div>
          <div className="w-full bg-slate-800 rounded-full h-2 mt-4 overflow-hidden">
            <div className="bg-gradient-to-r from-blue-500 to-indigo-500 h-2 rounded-full" style={{ width: `${progressPercent}%` }} />
          </div>
        </div>
        <div className="glass-panel rounded-2xl p-6 flex flex-col justify-center items-center">
          <div className="text-4xl font-bold text-emerald-400 mb-2">{masteredCount}</div>
          <div className="text-slate-400 text-sm uppercase tracking-wider font-semibold">Mastered</div>
        </div>
        <div className="glass-panel rounded-2xl p-6 flex flex-col justify-center items-center">
          <div className="text-4xl font-bold text-amber-400 mb-2">{practiceCount}</div>
          <div className="text-slate-400 text-sm uppercase tracking-wider font-semibold">Needs Practice</div>
        </div>
      </div>

      {/* Search and Filter */}
      <div className="glass-panel rounded-2xl p-4 flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
          <input 
            type="text" 
            placeholder="Search English word or Kannada meaning..."
            className="w-full bg-slate-800/50 border border-slate-700 rounded-xl py-3 pl-12 pr-4 text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="relative md:w-64">
          <Filter className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
          <select 
            className="w-full bg-slate-800/50 border border-slate-700 rounded-xl py-3 pl-12 pr-10 text-slate-100 appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all"
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
          >
            {categories.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
          <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
            ▼
          </div>
        </div>
      </div>

      {/* Word Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredWords.length > 0 ? (
          filteredWords.map((word, index) => (
            <div key={index} className="animate-in zoom-in-95 fade-in duration-300" style={{ animationDelay: `${index * 50}ms` }}>
              <WordCard 
                word={word} 
                progress={progress} 
                onMaster={markMastered} 
                onPractice={markNeedsPractice} 
              />
            </div>
          ))
        ) : (
          <div className="col-span-full py-12 text-center text-slate-500">
            <p className="text-lg">No words found matching your criteria.</p>
          </div>
        )}
      </div>
    </div>
  );
}
