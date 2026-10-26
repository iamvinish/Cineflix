// Base configuration for TMDB API
const API_KEY = import.meta.env.VITE_TMDB_API_KEY;
const BASE_URL = 'https://api.themoviedb.org/3';

// Helper function to handle fetch requests and error checking
const fetchFromTMDB = async (endpoint, params = {}) => {
  if (!API_KEY || API_KEY === 'your_actual_tmdb_api_key_here') {
    throw new Error('TMDB API Key is missing or invalid. Please check your .env file.');
  }

  const url = new URL(`${BASE_URL}${endpoint}`);
  url.searchParams.set('api_key', API_KEY);
  url.searchParams.set('language', 'en-US');

  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      url.searchParams.set(key, value);
    }
  });

  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`API Request failed with status ${response.status}`);
  }

  const data = await response.json();
  return data.results || data; // Return results array or object data
};

// 1. Get Trending Movies (Today)
export const getTrendingMovies = async () => {
  return await fetchFromTMDB('/trending/movie/day');
};

// 2. Get Popular Movies
export const getPopularMovies = async () => {
  return await fetchFromTMDB('/movie/popular');
};

// 3. Get Top Rated Movies
export const getTopRatedMovies = async () => {
  return await fetchFromTMDB('/movie/top_rated');
};

// 4. Get Upcoming Movies
export const getUpcomingMovies = async () => {
  return await fetchFromTMDB('/movie/upcoming');
};

export const getMovieGenres = async () => {
  const data = await fetchFromTMDB('/genre/movie/list');
  return data.genres || [];
};

export const getMoviesByGenre = async (genreId, languageCode) => {
  return fetchFromTMDB('/discover/movie', {
    with_genres: genreId || undefined,
    with_original_language: languageCode || undefined,
    sort_by: 'popularity.desc'
  });
};

// 5. Search Movies by Query
export const searchMovies = async (query) => {
  if (!query.trim()) return [];
  return fetchFromTMDB('/search/movie', { query: query.trim() });
};

// 6. Get Movie Details by ID
export const getMovieDetails = async (movieId) => {
  return fetchFromTMDB(`/movie/${movieId}`, {
    append_to_response: 'videos'
  });
};

// 7. Get Movie Cast / Credits
export const getMovieCredits = async (movieId) => {
  const data = await fetchFromTMDB(`/movie/${movieId}/credits`);
  return data.cast || [];
};

// 8. Get Similar Movies
export const getSimilarMovies = async (movieId) => {
  return await fetchFromTMDB(`/movie/${movieId}/similar`);
};