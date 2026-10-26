import React, { useState, useEffect, useMemo } from 'react';
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

  // Handle Search Submission
  const handleSearch = async (query) => {
    if (!query.trim()) return;
    setSearchQuery(query);
    setActivePage('search');
    try {
      setLoading(true);
      setError(null);

      const results = await searchMovies(query);
      setSearchResults(results);
    } catch (err) {
      console.error('Search failed:', err);
      setError('Failed to fetch search results. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const openMovie = (movie) => {
    recordViewed(movie);
    setSelectedMovie(movie);
  };

  const handleToggleFavourite = toggleFavourite;
  const heroMovie = useMemo(
    () => trending.find((movie) => movie.backdrop_path) ?? trending[0] ?? null,
    [trending]
  );

  const isSelectedFav = selectedMovie ? favourites.some((fav) => fav.id === selectedMovie.id) : false;

  return (
    <div className="app">
      <Header 
        onNavigate={(page) => { setActivePage(page); setSearchQuery(''); setError(null); }} 
        activePage={activePage} 
        onSearch={handleSearch} 
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
                  <p className="search-empty">No movies found matching your search.</p>
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

      <Footer />
    </div>
  );
}

export default App;