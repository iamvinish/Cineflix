import React, { useState, useEffect, useMemo, useRef } from 'react';
import { useFavourites } from './hooks/useFavourites';
import { useWatchHistory } from './hooks/useWatchHistory';
import Header from './components/Header';
import Hero from './components/Hero';
import MovieRow from './components/MovieRow';
import MovieCard from './components/MovieCard';
import MovieDetails from './components/MovieDetails';
import Favourites from './components/Favourites';
import GenreBrowser from './components/GenreBrowser';
import RecentlyViewed from './components/RecentlyViewed';
import Loading from './components/Loading';
import ErrorMessage from './components/ErrorMessage';
import Footer from './components/Footer';

import { 
  getTrendingMovies, 
  getPopularMovies, 
  getTopRatedMovies, 
  getUpcomingMovies, 
  searchMovies 
} from './services/movieApi';

function App() {
  const [activePage, setActivePage] = useState('home');
  const [selectedMovie, setSelectedMovie] = useState(null);
  const { favourites, toggleFavourite } = useFavourites();
  const { history, recordViewed, clearHistory } = useWatchHistory();

  // Data states
  const [trending, setTrending] = useState([]);
  const [popular, setPopular] = useState([]);
  const [topRated, setTopRated] = useState([]);
  const [upcoming, setUpcoming] = useState([]);
  const [searchResults, setSearchResults] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');

  // UI state
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [favouriteFeedback, setFavouriteFeedback] = useState('');
  const searchRequestRef = useRef(0);
  const searchControllerRef = useRef(null);

  const cancelSearch = () => {
    searchRequestRef.current += 1;
    searchControllerRef.current?.abort();
    searchControllerRef.current = null;
  };

  // Fetch initial home page data on component mount
  useEffect(() => {
    const fetchHomeData = async () => {
      try {
        setLoading(true);
        setError(null);

        const [trendingData, popularData, topRatedData, upcomingData] = await Promise.all([
          getTrendingMovies(),
          getPopularMovies(),
          getTopRatedMovies(),
          getUpcomingMovies()
        ]);

        setTrending(trendingData);
        setPopular(popularData);
        setTopRated(topRatedData);
        setUpcoming(upcomingData);
      } catch (err) {
        console.error('Error fetching TMDB data:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchHomeData();
  }, []);

  useEffect(() => () => {
    searchRequestRef.current += 1;
    searchControllerRef.current?.abort();
  }, []);

  useEffect(() => {
    if (!favouriteFeedback) return undefined;
    const timeoutId = window.setTimeout(() => setFavouriteFeedback(''), 2800);
    return () => window.clearTimeout(timeoutId);
  }, [favouriteFeedback]);

  // Handle Search Submission
  const handleSearch = async (query) => {
    if (!query.trim()) return;
    cancelSearch();
    const requestId = searchRequestRef.current;
    const controller = new AbortController();
    searchControllerRef.current = controller;
    setSearchQuery(query);
    setActivePage('search');
    setSearchResults([]);
    try {
      setLoading(true);
      setError(null);

      const results = await searchMovies(query, { signal: controller.signal });
      if (requestId === searchRequestRef.current) setSearchResults(results);
    } catch (err) {
      if (err.name !== 'AbortError' && requestId === searchRequestRef.current) {
        console.error('Search failed:', err);
        setError('Failed to fetch search results. Please try again.');
      }
    } finally {
      if (requestId === searchRequestRef.current) {
        searchControllerRef.current = null;
        setLoading(false);
      }
    }
  };

  const handleClearSearch = () => {
    cancelSearch();
    if (activePage === 'search') setLoading(false);
    setSearchQuery('');
    setSearchResults([]);
    setError(null);
    setActivePage('home');
  };

  const openMovie = (movie) => {
    recordViewed(movie);
    setSelectedMovie(movie);
  };

  const handleToggleFavourite = (movie) => {
    const isAlreadyFavourite = favourites.some((favourite) => favourite.id === movie.id);
    toggleFavourite(movie);
    setFavouriteFeedback(
      isAlreadyFavourite
        ? `${movie.title || movie.name || 'Movie'} removed from My List`
        : `${movie.title || movie.name || 'Movie'} added to My List`
    );
  };
  const heroMovie = useMemo(
    () => trending.find((movie) => movie.backdrop_path) ?? trending[0] ?? null,
    [trending]
  );

  const isSelectedFav = selectedMovie ? favourites.some((fav) => fav.id === selectedMovie.id) : false;

  const handleNavigate = (page, sectionId) => {
    cancelSearch();
    if (activePage === 'search') setLoading(false);
    setActivePage(page);
    setSearchQuery('');
    setError(null);
    if (sectionId) {
      window.setTimeout(() => {
        document.getElementById(sectionId)?.scrollIntoView({ behavior: 'smooth' });
      }, 0);
    }
  };

  return (
    <div className="app">
      <Header 
        onNavigate={handleNavigate}
        activePage={activePage} 
        onSearch={handleSearch} 
        onClearSearch={handleClearSearch}
      />

      <main>
        {activePage === 'home' ? (
          <>
            <Hero movie={heroMovie} onInfoClick={openMovie} />
            {loading && <Loading message="Loading cinematic masterpieces from TMDB..." />}
            {error && <ErrorMessage message={error} />}
            {!loading && !error && (
              <div className="home-collections">
                <MovieRow
                  title="Recently Viewed"
                  movies={history}
                  onMovieClick={openMovie}
                  favourites={favourites}
                  onToggleFavourite={handleToggleFavourite}
                />
                <MovieRow 
                  title="Trending Now" 
                  movies={trending} 
                  onMovieClick={openMovie}
                  favourites={favourites}
                  onToggleFavourite={handleToggleFavourite}
                />
                <MovieRow 
                  id="popular-movies"
                  title="Popular on CineFlix" 
                  movies={popular} 
                  onMovieClick={openMovie}
                  favourites={favourites}
                  onToggleFavourite={handleToggleFavourite}
                />
                <MovieRow 
                  title="Top Rated Classics" 
                  movies={topRated} 
                  onMovieClick={openMovie}
                  favourites={favourites}
                  onToggleFavourite={handleToggleFavourite}
                />
                <MovieRow 
                  id="upcoming-releases"
                  title="Upcoming Releases" 
                  movies={upcoming} 
                  onMovieClick={openMovie}
                  favourites={favourites}
                  onToggleFavourite={handleToggleFavourite}
                />
              </div>
            )}
          </>
        ) : loading ? (
          <Loading message={activePage === 'search' ? 'Searching movies...' : 'Loading cinematic masterpieces from TMDB...'} />
        ) : error ? (
          <ErrorMessage message={error} />
        ) : (
          <>
            {activePage === 'search' && (
              <section className="search-results-page">
                <h1>Search Results for “{searchQuery}”</h1>
                {searchResults.length === 0 ? (
                  <div className="search-empty" role="status">
                    <h2>No movies found</h2>
                    <p>We couldn’t find a match for “{searchQuery}”. Try another title or check the spelling.</p>
                  </div>
                ) : (
                  <div className="search-results-grid">
                    {searchResults.map((movie) => (
                      <MovieCard 
                        key={movie.id}
                        movie={movie}
                        onClick={openMovie}
                        isFavourite={favourites.some((fav) => fav.id === movie.id)}
                        onToggleFavourite={handleToggleFavourite}
                      />
                    ))}
                  </div>
                )}
              </section>
            )}

            {activePage === 'favourites' && (
              <Favourites 
                favourites={favourites} 
                onMovieClick={openMovie} 
                onToggleFavourite={handleToggleFavourite} 
                onBrowse={() => setActivePage('browse')}
              />
            )}

            {activePage === 'browse' && (
              <GenreBrowser
                favourites={favourites}
                onMovieClick={openMovie}
                onToggleFavourite={handleToggleFavourite}
              />
            )}

            {activePage === 'history' && (
              <RecentlyViewed
                history={history}
                favourites={favourites}
                onMovieClick={openMovie}
                onToggleFavourite={handleToggleFavourite}
                onClearHistory={clearHistory}
              />
            )}
          </>
        )}
      </main>

      {favouriteFeedback && (
        <div className="favourite-feedback" role="status" aria-live="polite">
          <span aria-hidden="true">{favouriteFeedback.includes('added') ? '✓' : '−'}</span>
          {favouriteFeedback}
        </div>
      )}

      {/* Movie Details Modal */}
      {selectedMovie && (
        <MovieDetails 
          movie={selectedMovie} 
          onClose={() => setSelectedMovie(null)} 
          isFavourite={isSelectedFav}
          onToggleFavourite={handleToggleFavourite}
          favourites={favourites}
          onMovieClick={openMovie}
        />
      )}

      <Footer onNavigate={handleNavigate} />
    </div>
  );
}

export default App;