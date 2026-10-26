import React, { useEffect, useRef, useState } from 'react';
import { getMovieCredits, getMovieDetails, getSimilarMovies } from '../services/movieApi';
import { getLanguageName } from '../services/languages';
import { findYouTubeTrailer } from '../services/youtubeTrailerApi';
import MovieRow from './MovieRow';
import YouTubeTrailer from './YouTubeTrailer';
import '../styles/MovieDetails.css';

const isYouTubeVideoId = (key) => typeof key === 'string' && /^[\w-]{11}$/.test(key);

function MovieDetails({
  movie,
  onClose,
  isFavourite,
  favourites,
  onToggleFavourite,
  onMovieClick
}) {
  const movieId = movie?.id;
  const [details, setDetails] = useState(null);
  const [cast, setCast] = useState([]);
  const [similarMovies, setSimilarMovies] = useState([]);
  const [loadedMovieId, setLoadedMovieId] = useState(null);
  const [loadingDetails, setLoadingDetails] = useState(true);
  const [detailsError, setDetailsError] = useState(null);
  const [trailerState, setTrailerState] = useState({ movieId: null, status: 'loading' });
  const [failedPosterMovieId, setFailedPosterMovieId] = useState(null);
  const modalRef = useRef(null);
  const closeButtonRef = useRef(null);
  const onCloseRef = useRef(onClose);

  useEffect(() => {
    onCloseRef.current = onClose;
  }, [onClose]);

  useEffect(() => {
    if (movieId == null) return undefined;
    let cancelled = false;

    const loadDetails = async () => {
      setLoadingDetails(true);
      setDetailsError(null);
      setLoadedMovieId(null);
      setCast([]);
      setSimilarMovies([]);
      setTrailerState({ movieId, status: 'loading' });

      const results = await Promise.allSettled([
        getMovieDetails(movieId),
        getMovieCredits(movieId),
        getSimilarMovies(movieId)
      ]);

      if (cancelled) return;
      let movieDetails = null;
      if (results[0].status === 'fulfilled') {
        movieDetails = results[0].value;
        setDetails(movieDetails);
        setLoadedMovieId(movieId);
      }
      if (results[1].status === 'fulfilled') setCast(results[1].value.slice(0, 8));
      if (results[2].status === 'fulfilled') {
        setSimilarMovies(results[2].value.filter((item) => item.id !== movieId));
      }

      const failures = results.filter((result) => result.status === 'rejected');
      if (failures.length > 0) {
        console.error('Failed to load some movie details:', failures.map((failure) => failure.reason));
        setDetailsError('Some title information could not be loaded. Please try again later.');
      }

      const tmdbTrailer = movieDetails?.videos?.results
        ?.filter((video) => video.site === 'YouTube'
          && video.type === 'Trailer'
          && isYouTubeVideoId(video.key))
        .sort((first, second) => Number(second.official) - Number(first.official))[0];

      if (tmdbTrailer) {
        setTrailerState({ movieId, status: 'found', video: tmdbTrailer });
      } else {
        try {
          const result = await findYouTubeTrailer({ ...movie, ...movieDetails });
          if (cancelled) return;
          setTrailerState({
            movieId,
            status: result.status,
            video: result.video
          });
        } catch (error) {
          console.error('Failed to find a verified YouTube trailer:', error);
          if (!cancelled) setTrailerState({ movieId, status: 'error' });
        }
      }
      setLoadingDetails(false);
    };

    loadDetails();
    return () => {
      cancelled = true;
    };
  }, [movie, movieId]);

  useEffect(() => {
    const previousFocus = document.activeElement;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    closeButtonRef.current?.focus();

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        onCloseRef.current();
        return;
      }

      if (event.key !== 'Tab' || !modalRef.current) return;
      const focusable = modalRef.current.querySelectorAll(
        'button:not([disabled]), [href], iframe, [tabindex]:not([tabindex="-1"])'
      );
      if (focusable.length === 0) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];

      if (event.shiftKey && (document.activeElement === first || !modalRef.current.contains(document.activeElement))) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && (document.activeElement === last || !modalRef.current.contains(document.activeElement))) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener('keydown', handleKeyDown);
      if (previousFocus instanceof HTMLElement) previousFocus.focus();
    };
  }, []);

  if (!movie) return null;

  const currentDetails = loadedMovieId === movieId ? details : null;
  const title = currentDetails?.title || movie.title || movie.name;
  const backdropPath = currentDetails?.backdrop_path || movie.backdrop_path;
  const backdropUrl = backdropPath
    ? `https://image.tmdb.org/t/p/original${backdropPath}`
    : null;
  const posterPath = currentDetails?.poster_path || movie.poster_path;
  const posterUrl = posterPath
    ? `https://image.tmdb.org/t/p/w500${posterPath}`
    : null;
  const releaseDate = currentDetails?.release_date || movie.release_date;
  const genres = currentDetails?.genres || [];
  const rating = currentDetails?.vote_average ?? movie.vote_average;
  const languageCode = currentDetails?.original_language || movie.original_language;
  const languageName = getLanguageName(languageCode);
  const currentTrailerState = trailerState.movieId === movieId
    ? trailerState
    : { status: 'loading' };
  const trailer = currentTrailerState.status === 'found' ? currentTrailerState.video : null;
  const handleTrailerUnavailable = () => {
    setTrailerState((previous) => previous.movieId === movieId
      ? { movieId, status: 'unavailable' }
      : previous);
  };

  return (
    <div className="movie-details-backdrop" onClick={onClose}>
      <div
        className="movie-details-modal"
        ref={modalRef}
        role="dialog"
        aria-modal="true"
        aria-label={`${title} details`}
        tabIndex={-1}
        onClick={(event) => event.stopPropagation()}
      >
        <button
          className="details-close-btn"
          ref={closeButtonRef}
          type="button"
          onClick={onClose}
          aria-label="Close details"
        >
          ✕
        </button>

        <div
          className="details-header"
          style={{ backgroundImage: backdropUrl ? `url(${backdropUrl})` : 'none' }}
        >
          <div className="details-gradient"></div>
          <div className="details-header-content">
            <h2 className="details-title">{title}</h2>
            <div className="details-actions">
              <button
                className={`details-btn list-btn ${isFavourite ? 'active' : ''}`}
                type="button"
                aria-pressed={isFavourite}
                onClick={() => onToggleFavourite(movie)}
              >
                {isFavourite ? '✓ In My List' : '+ Add to My List'}
              </button>
            </div>
          </div>
        </div>

        <div className="details-body">
          <div className="details-main-info">
            <div className="details-trailer" aria-label="Movie trailer">
              {trailer ? (
                <YouTubeTrailer
                  key={`${movieId}-${trailer.key}`}
                  videoId={trailer.key}
                  title={title}
                  onUnavailable={handleTrailerUnavailable}
                />
              ) : currentTrailerState.status === 'loading' || currentTrailerState.status === 'found' ? (
                <p className="trailer-message" role="status">Finding the trailer…</p>
              ) : (
                <div className="trailer-message">
                  <strong>Trailer currently unavailable</strong>
                  <p>
                    {currentTrailerState.status === 'not-configured'
                      ? 'TMDB has no video listed, and YouTube trailer search is not configured.'
                      : currentTrailerState.status === 'error'
                        ? 'We could not check for a trailer right now. Please try again later.'
                        : 'No matching, embeddable trailer was found for this title.'}
                  </p>
                </div>
              )}
            </div>
            {trailer && (
              <details className="audio-subtitles-control">
                <summary>Audio &amp; Subtitles</summary>
                <p>
                  Track options are provided by YouTube for this trailer. Open the player settings
                  to select available audio or captions; options vary by video.
                </p>
              </details>
            )}

            <div className="details-meta-row">
              <span className="details-rating">
                ★ {rating != null ? Number(rating).toFixed(1) : 'Not rated'}
              </span>
              {releaseDate && <span className="details-year">{releaseDate}</span>}
              {languageName && <span>Original language: {languageName}</span>}
              {currentDetails?.runtime > 0 && <span>{currentDetails.runtime} min</span>}
              {currentDetails?.adult && <span className="details-badge">18+</span>}
            </div>
            {genres.length > 0 && (
              <div className="details-genres" aria-label="Genres">
                {genres.map((genre) => <span key={genre.id}>{genre.name}</span>)}
              </div>
            )}
            <p className="details-overview">
              {currentDetails?.overview || movie.overview || 'No overview available.'}
            </p>
          </div>
          {posterUrl && failedPosterMovieId !== movieId && (
            <div className="details-poster-preview">
              <img
                src={posterUrl}
                alt={`${title} poster`}
                onError={() => setFailedPosterMovieId(movieId)}
              />
            </div>
          )}
        </div>

        <div className="details-extra-info">
          {loadingDetails && <p className="details-status" role="status">Loading movie details and cast...</p>}
          {detailsError && <p className="details-status" role="alert">{detailsError}</p>}
          {cast.length > 0 && (
            <section className="details-cast">
              <h3>Cast</h3>
              <ul>
                {cast.map((person) => (
                  <li key={person.cast_id || `${person.id}-${person.character}`}>
                    <strong>{person.name}</strong>
                    {person.character && <span>{person.character}</span>}
                  </li>
                ))}
              </ul>
            </section>
          )}
          {similarMovies.length > 0 && (
            <MovieRow
              title="More Like This"
              movies={similarMovies}
              onMovieClick={onMovieClick}
              favourites={favourites}
              onToggleFavourite={onToggleFavourite}
            />
          )}
        </div>
      </div>
    </div>
  );
}

export default MovieDetails;
