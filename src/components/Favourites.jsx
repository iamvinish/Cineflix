import React from 'react';
import MovieCard from './MovieCard';
import '../styles/Favourites.css';

function Favourites({ favourites, onMovieClick, onToggleFavourite }) {
  return (
    <div className="favourites-page">
      <h2 className="favourites-heading">My List</h2>
      {favourites.length === 0 ? (
        <div className="favourites-empty">
          <p>Your list is currently empty.</p>
          <span>Explore movies and click the '+' button on any poster to save them here!</span>
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