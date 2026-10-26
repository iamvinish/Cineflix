import React from 'react';
import MovieCard from './MovieCard';
import '../styles/Favourites.css';

function Favourites({ favourites, onMovieClick, onToggleFavourite, onBrowse }) {
  return (
    <div className="favourites-page">
      <h2 className="favourites-heading">My List</h2>
      {favourites.length === 0 ? (
        <div className="favourites-empty">
          <span className="favourites-empty-icon" aria-hidden="true">+</span>
          <h3>Your list is waiting for its first movie</h3>
          <p>Save movies you want to watch by selecting the plus button on any poster. They’ll stay in My List on this browser.</p>
          <button className="favourites-browse-button" type="button" onClick={onBrowse}>
            Explore movies
          </button>
        </div>
      ) : (
        <div className="favourites-grid">
          {favourites.map((movie) => (
            <MovieCard
              key={movie.id}
              movie={movie}
              onClick={onMovieClick}
              isFavourite={true}
              onToggleFavourite={onToggleFavourite}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default Favourites;