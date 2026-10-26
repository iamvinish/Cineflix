import { useState, useEffect } from 'react';

export function useFavourites() {
  // Initialize favourites state from browser localStorage
  const [favourites, setFavourites] = useState(() => {
    try {
      const saved = localStorage.getItem('cineflix_favourites');
      const parsed = saved ? JSON.parse(saved) : [];
      return Array.isArray(parsed) ? parsed : [];
    } catch (error) {
      console.error('Failed to load favourites from localStorage', error);
      return [];
    }
  });

  // Sync favourites changes to localStorage whenever the list updates
  useEffect(() => {
    try {
      localStorage.setItem('cineflix_favourites', JSON.stringify(favourites));
    } catch (error) {
      console.error('Failed to save favourites to localStorage', error);
    }
  }, [favourites]);

  // Toggle favourite handler (adds if missing, removes if already present)
  const toggleFavourite = (movie) => {
    setFavourites((prevFavourites) => {
      const exists = prevFavourites.some((fav) => fav.id === movie.id);
      if (exists) {
        return prevFavourites.filter((fav) => fav.id !== movie.id);
      } else {
        return [...prevFavourites, movie];
      }
    });
  };

  return { favourites, toggleFavourite };
}