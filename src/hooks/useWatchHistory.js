import { useEffect, useState } from 'react';

const STORAGE_KEY = 'cineflix_watch_history';
const HISTORY_LIMIT = 20;

export function useWatchHistory() {
  const [history, setHistory] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      const parsed = saved ? JSON.parse(saved) : [];
      return Array.isArray(parsed) ? parsed : [];
    } catch (error) {
      console.error('Failed to load viewing history from localStorage', error);
      return [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(history));
    } catch (error) {
      console.error('Failed to save viewing history to localStorage', error);
    }
  }, [history]);

  const recordViewed = (movie) => {
    setHistory((previous) => [
      { ...movie, viewedAt: Date.now() },
      ...previous.filter((item) => item.id !== movie.id)
    ].slice(0, HISTORY_LIMIT));
  };

  const clearHistory = () => setHistory([]);

  return { history, recordViewed, clearHistory };
}
