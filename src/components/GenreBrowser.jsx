import React, { useEffect, useState } from 'react';
import { getMovieGenres, getMoviesByGenre } from '../services/movieApi';
import { BROWSE_LANGUAGES } from '../services/languages';
import MovieCard from './MovieCard';
import '../styles/GenreBrowser.css';

const LANGUAGE_STORAGE_KEY = 'cineflix_browse_language';
const LANGUAGE_CODES = new Set(BROWSE_LANGUAGES.map(({ code }) => code));

function GenreBrowser({ favourites, onMovieClick, onToggleFavourite }) {
  const [genres, setGenres] = useState([]);
  const [selectedGenre, setSelectedGenre] = useState('');
  const [selectedLanguage, setSelectedLanguage] = useState(() => {
    try {
      const savedLanguage = localStorage.getItem(LANGUAGE_STORAGE_KEY);
      return savedLanguage && LANGUAGE_CODES.has(savedLanguage) ? savedLanguage : '';
    } catch (error) {
      console.error('Failed to load browse language from localStorage:', error);
      return '';
    }
  });
  const [movies, setMovies] = useState([]);
  const [loadingGenres, setLoadingGenres] = useState(true);
  const [loadingMovies, setLoadingMovies] = useState(false);
  const [genreError, setGenreError] = useState(null);
  const [moviesError, setMoviesError] = useState(null);

  useEffect(() => {
    try {
      if (selectedLanguage) {
        localStorage.setItem(LANGUAGE_STORAGE_KEY, selectedLanguage);
      } else {
        localStorage.removeItem(LANGUAGE_STORAGE_KEY);
      }
    } catch (error) {
      console.error('Failed to save browse language to localStorage:', error);
    }
  }, [selectedLanguage]);

  useEffect(() => {
    let cancelled = false;

    const loadGenres = async () => {
      try {
        const result = await getMovieGenres();
        if (cancelled) return;
        setGenres(result);
      } catch (error) {
        console.error('Failed to load movie genres:', error);
        if (!cancelled) setGenreError('Could not load genres. Please try again later.');
      } finally {
        if (!cancelled) setLoadingGenres(false);
      }
    };

    loadGenres();
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (loadingGenres) return undefined;
    let cancelled = false;

    const loadMovies = async () => {
      setLoadingMovies(true);
      setMoviesError(null);
      try {
        const result = await getMoviesByGenre(selectedGenre, selectedLanguage);
        if (!cancelled) setMovies(result);
      } catch (error) {
        console.error('Failed to load movies by genre and language:', error);
        if (!cancelled) setMoviesError('Could not load movies for these filters. Please try again later.');
      } finally {
        if (!cancelled) setLoadingMovies(false);
      }
    };

    loadMovies();
    return () => {
      cancelled = true;
    };
  }, [loadingGenres, selectedGenre, selectedLanguage]);

  const selectedGenreName = genres.find((genre) => String(genre.id) === selectedGenre)?.name;
  const selectedLanguageName = BROWSE_LANGUAGES.find(
    (language) => language.code === selectedLanguage
  )?.name;

  return (
    <section className="genre-browser">
      <div className="genre-browser-heading">
        <div>
          <p className="genre-eyebrow">Find your next favorite</p>
          <h1>Browse Movies</h1>
        </div>
        <div className="genre-browser-filters">
          <label className="genre-select-label">
            <span>Genre</span>
            <select
              aria-label="Filter movies by genre"
              value={selectedGenre}
              onChange={(event) => setSelectedGenre(event.target.value)}
              disabled={loadingGenres || genres.length === 0}
            >
              <option value="">All genres</option>
              {genres.map((genre) => (
                <option key={genre.id} value={genre.id}>{genre.name}</option>
              ))}
            </select>
          </label>
          <label className="genre-select-label">
            <span>Original language</span>
            <select
              aria-label="Filter movies by original language"
              value={selectedLanguage}
              onChange={(event) => setSelectedLanguage(event.target.value)}
            >
              <option value="">All languages</option>
              {BROWSE_LANGUAGES.map((language) => (
                <option key={language.code} value={language.code}>
                  {language.name}
                </option>
              ))}
            </select>
          </label>
        </div>
      </div>

      {genreError && <p className="genre-message" role="alert">{genreError}</p>}
      {!genreError && !loadingGenres && genres.length === 0 && (
        <p className="genre-message">No genres are available right now.</p>
      )}
      {moviesError && <p className="genre-message" role="alert">{moviesError}</p>}
      {!genreError && !moviesError && (
        <>
          {(selectedGenreName || selectedLanguageName) && (
            <h2 className="genre-results-title">
              {[selectedLanguageName, selectedGenreName].filter(Boolean).join(' · ')} Movies
            </h2>
          )}
          {loadingMovies ? (
            <p className="genre-message" role="status">Loading movies...</p>
          ) : movies.length === 0 ? (
            <p className="genre-message">No movies found for these filters.</p>
          ) : (
            <div className="genre-movie-grid">
              {movies.map((movie) => (
                <MovieCard
                  key={movie.id}
                  movie={movie}
                  onClick={onMovieClick}
                  isFavourite={favourites.some((favourite) => favourite.id === movie.id)}
                  onToggleFavourite={onToggleFavourite}
                />
              ))}
            </div>
          )}
        </>
      )}
    </section>
  );
}

export default GenreBrowser;
