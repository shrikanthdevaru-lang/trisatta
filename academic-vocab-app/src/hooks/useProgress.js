import { useState, useEffect } from 'react';

export function useProgress() {
  const [progress, setProgress] = useState(() => {
    try {
      const item = window.localStorage.getItem('vocabProgress');
      return item ? JSON.parse(item) : { mastered: [], needsPractice: [] };
    } catch (error) {
      console.warn('Error reading localStorage', error);
      return { mastered: [], needsPractice: [] };
    }
  });

  useEffect(() => {
    try {
      window.localStorage.setItem('vocabProgress', JSON.stringify(progress));
    } catch (error) {
      console.warn('Error setting localStorage', error);
    }
  }, [progress]);

  const markMastered = (word) => {
    setProgress(prev => {
      const newNeedsPractice = prev.needsPractice.filter(w => w !== word);
      if (!prev.mastered.includes(word)) {
        return { mastered: [...prev.mastered, word], needsPractice: newNeedsPractice };
      }
      return prev;
    });
  };

  const markNeedsPractice = (word) => {
    setProgress(prev => {
      const newMastered = prev.mastered.filter(w => w !== word);
      if (!prev.needsPractice.includes(word)) {
        return { mastered: newMastered, needsPractice: [...prev.needsPractice, word] };
      }
      return prev;
    });
  };

  const clearProgress = () => {
    setProgress({ mastered: [], needsPractice: [] });
  };

  return { progress, markMastered, markNeedsPractice, clearProgress };
}
