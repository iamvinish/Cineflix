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

  return (
    <section 
      className={`hero${backdropUrl ? '' : ' hero-no-image'}`}
      style={backdropUrl ? { backgroundImage: `url("${backdropUrl}")` } : undefined}
      aria-labelledby="hero-title"
    >
      <div className="hero-fade-top"></div>
      <div className="hero-fade-bottom"></div>

      <div className="hero-content">
        <p className="hero-eyebrow">Featured film</p>
        <h1 className="hero-title" id="hero-title">{movie.title || movie.name}</h1>
        
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
            ▶ Watch trailer
          </button>
          <button className="hero-btn hero-btn-info" type="button" onClick={() => onInfoClick(movie)}>
            ℹ More Info
          </button>
        </div>
      </div>
    </section>
  );
}

export default Hero;