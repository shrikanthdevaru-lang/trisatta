import React, { useState } from 'react';
import { Layout } from './components/Layout';
import { Dashboard } from './components/Dashboard';
import { PracticeModule } from './components/PracticeModule';
import { Flashcards } from './components/Flashcards';
import { useProgress } from './hooks/useProgress';

function App() {
  const [currentTab, setCurrentTab] = useState('dashboard');
  const { progress, markMastered, markNeedsPractice } = useProgress();

  return (
    <Layout currentTab={currentTab} setCurrentTab={setCurrentTab}>
      {currentTab === 'dashboard' && (
        <Dashboard 
          progress={progress} 
          markMastered={markMastered} 
          markNeedsPractice={markNeedsPractice} 
        />
      )}
      {currentTab === 'practice' && (
        <PracticeModule />
      )}
      {currentTab === 'flashcards' && (
        <Flashcards 
          progress={progress}
          markMastered={markMastered}
          markNeedsPractice={markNeedsPractice}
        />
      )}
    </Layout>
  );
}

export default App;
