import React from 'react';
import '../styles/Hero.css';

function Hero({ movie, onInfoClick }) {
  if (!movie) {
    return (
      <section className="hero hero-loading" aria-label="Featured movie loading" />
    );
  }

  const imagePath = movie.backdrop_path || movie.poster_path;
  const backdropUrl = imagePath ? `https://image.tmdb.org/t/p/original${imagePath}` : null;
  const title = movie.title || movie.name || 'Featured movie';
  const releaseYear = movie.release_date?.slice(0, 4);

  return (
    <section 
      className={`hero${backdropUrl ? '' : ' hero-no-image'}`}
      style={backdropUrl ? { backgroundImage: `url("${backdropUrl}")` } : undefined}
      aria-labelledby="hero-title"
    >
      <div className="hero-fade-top" aria-hidden="true"></div>
      <div className="hero-fade-bottom" aria-hidden="true"></div>

      <div className="hero-content">
        <p className="hero-eyebrow"><span aria-hidden="true"></span> Featured film</p>
        <h1 className="hero-title" id="hero-title">{title}</h1>
        <div className="hero-meta" aria-label="Featured movie information">
          {movie.vote_average != null && (
            <span className="hero-rating">★ {Number(movie.vote_average).toFixed(1)} rating</span>
          )}
          {releaseYear && <span>{releaseYear}</span>}
          <span>Movie</span>
        </div>
        
        <p className="hero-overview">
          {movie.overview 
            ? movie.overview
            : 'No overview available.'}
        </p>

        <div className="hero-buttons">
          <button
            className="hero-btn hero-btn-play"
            type="button"
            onClick={() => onInfoClick(movie)}
          >
            <svg aria-hidden="true" viewBox="0 0 24 24" focusable="false">
              <path d="M8 5.5v13l11-6.5-11-6.5Z" />
            </svg>
            Play Trailer
          </button>
          <button className="hero-btn hero-btn-info" type="button" onClick={() => onInfoClick(movie)}>
            <svg aria-hidden="true" viewBox="0 0 24 24" focusable="false">
              <circle cx="12" cy="12" r="9" />
              <path d="M12 11v5m0-8h.01" />
            </svg>
            More Info
          </button>
        </div>
      </div>
    </section>
  );
}

export default Hero;