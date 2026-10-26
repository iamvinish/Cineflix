import React, { useRef } from 'react';
import MovieCard from './MovieCard';
import '../styles/MovieRow.css';

function MovieRow({ id, title, movies, onMovieClick, favourites = [], onToggleFavourite }) {
  const rowRef = useRef(null);

  const handleScroll = (direction) => {
    const { current } = rowRef;
    if (current) {
      const scrollAmount = direction === 'left' ? -window.innerWidth / 2 : window.innerWidth / 2;
      current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  if (!movies || movies.length === 0) {
    return null;
  }

  return (
    <div className="movie-row-container" id={id}>
      <h3 className="movie-row-title">{title}</h3>
      <div className="movie-row-wrapper">
        <button className="row-scroll-btn left" type="button" onClick={() => handleScroll('left')} aria-label={`Scroll ${title} left`}>
          ‹
        </button>

        <div className="movie-row-list" ref={rowRef} aria-label={title} role="region" tabIndex={0}>
          {movies.map((movie) => {
            const isFav = favourites.some((fav) => fav.id === movie.id);
            return (
              <MovieCard
                key={movie.id}
                movie={movie}
                onClick={onMovieClick}
                isFavourite={isFav}
                onToggleFavourite={onToggleFavourite}
              />
            );
          })}
        </div>

        <button className="row-scroll-btn right" type="button" onClick={() => handleScroll('right')} aria-label={`Scroll ${title} right`}>
          ›
        </button>
      </div>
    </div>
  );
}

export default MovieRow;