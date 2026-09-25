import React from 'react';
import { BookOpen, Edit3, Layers, Settings } from 'lucide-react';

export function Layout({ children, currentTab, setCurrentTab }) {
  const tabs = [
    { id: 'dashboard', name: 'Catalog', icon: BookOpen },
    { id: 'practice', name: 'Practice', icon: Edit3 },
    { id: 'flashcards', name: 'Flashcards', icon: Layers },
  ];

  return (
    <div className="min-h-screen flex flex-col text-slate-50">
      <header className="glass-panel sticky top-0 z-50 py-4 px-6 sm:px-12 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="bg-gradient-to-tr from-blue-500 to-indigo-500 p-2 rounded-xl shadow-lg shadow-blue-500/20">
            <BookOpen className="w-6 h-6 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-gradient hidden sm:block tracking-tight">Academic Vocab</h1>
        </div>
        <nav className="flex gap-2">
          {tabs.map(tab => {
            const Icon = tab.icon;
            const isActive = currentTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setCurrentTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-300 ${
                  isActive 
                  ? 'bg-blue-500/20 text-blue-300 shadow-[0_0_15px_rgba(59,130,246,0.2)]' 
                  : 'hover:bg-slate-700/50 text-slate-400 hover:text-slate-200'
                }`}
              >
                <Icon className="w-5 h-5" />
                <span className="hidden md:block font-medium">{tab.name}</span>
              </button>
            );
          })}
        </nav>
      </header>
      
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>
    </div>
  );
}
