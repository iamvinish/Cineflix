import React, { useState } from 'react';
import '../styles/MovieCard.css';

function MovieCard({ movie, onClick, isFavourite, onToggleFavourite }) {
  const [posterFailed, setPosterFailed] = useState(false);
  const posterUrl = movie.poster_path
    ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
    : null;

  const handleFavouriteClick = () => {
    if (onToggleFavourite) {
      onToggleFavourite(movie);
    }
  };

  const title = movie.title || movie.name || 'Untitled movie';

  return (
    <article className="movie-card">
      <div className="movie-poster-wrapper">
        <button
          className="movie-poster-action"
          type="button"
          onClick={() => onClick && onClick(movie)}
          aria-label={`View details and trailer for ${title}`}
        >
          {posterUrl && !posterFailed ? (
            <img
              src={posterUrl}
              alt={`${title} poster`}
              className="movie-poster"
              loading="lazy"
              onError={() => setPosterFailed(true)}
            />
          ) : (
            <span className="movie-poster-fallback">
              <span>{title}</span>
            </span>
          )}
        </button>
        
        <button 
          className={`favourite-btn ${isFavourite ? 'active' : ''}`}
          onClick={handleFavouriteClick}
          type="button"
          aria-label={isFavourite ? `Remove ${title} from My List` : `Add ${title} to My List`}
          aria-pressed={isFavourite}
          title={isFavourite ? 'Remove from My List' : 'Add to My List'}
        >
          {isFavourite ? '✓' : '+'}
        </button>
      </div>
      
      <button
        className="movie-info movie-info-action"
        type="button"
        onClick={() => onClick && onClick(movie)}
        aria-label={`View details for ${title}`}
      >
        <h4 className="movie-card-title">{title}</h4>
        <div className="movie-meta">
          <span className="movie-year">
            {movie.release_date ? movie.release_date.split('-')[0] : '—'}
          </span>
          <span className="movie-rating">
            {movie.vote_average != null ? `★ ${Number(movie.vote_average).toFixed(1)}` : 'Not rated'}
          </span>
        </div>
      </button>
    </article>
  );
}

export default MovieCard;