import React from 'react';
import MovieCard from './MovieCard';
import '../styles/RecentlyViewed.css';

function RecentlyViewed({ history, favourites, onMovieClick, onToggleFavourite, onClearHistory }) {
  return (
    <section className="recently-viewed-page">
      <div className="recently-viewed-heading">
        <h1>Recently Viewed</h1>
        {history.length > 0 && (
          <button className="clear-history-button" type="button" onClick={onClearHistory}>
            Clear history
          </button>
        )}
      </div>
      {history.length === 0 ? (
        <p className="recently-viewed-empty">
          Movies you open will appear here. Your history is saved only in this browser.
        </p>
      ) : (
        <div className="recently-viewed-grid">
          {history.map((movie) => (
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
    </section>
  );
}

export default RecentlyViewed;
