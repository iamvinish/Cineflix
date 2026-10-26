import React, { useState } from 'react';
import '../styles/SearchBar.css';

function SearchBar({ onSearch }) {
  const [query, setQuery] = useState('');
  const [validationMessage, setValidationMessage] = useState('');
  const [isSearching, setIsSearching] = useState(false);

  const handleInputChange = (e) => {
    setQuery(e.target.value);
    if (validationMessage) setValidationMessage('');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isSearching) return;
    if (query.trim() === '') {
      setValidationMessage('Enter a movie title to search.');
      return;
    }
    setValidationMessage('');
    setIsSearching(true);
    Promise.resolve(onSearch(query.trim())).finally(() => setIsSearching(false));
  };

  return (
    <form className="search-bar-form" onSubmit={handleSubmit} role="search">
      <div className="search-input-wrapper">
        <input
          type="text"
          className="search-input"
          placeholder="Search movies..."
          aria-label="Search movies by title"
          aria-invalid={Boolean(validationMessage)}
          aria-describedby={validationMessage ? 'search-validation-message' : undefined}
          aria-busy={isSearching}
          value={query}
          onChange={handleInputChange}
        />
        <button
          type="submit"
          className={`search-button${isSearching ? ' is-searching' : ''}`}
          aria-label={isSearching ? 'Searching movies' : 'Search movies'}
          aria-busy={isSearching}
          disabled={isSearching}
        >
          {isSearching ? (
            <span className="search-spinner" aria-hidden="true" />
          ) : (
            <svg aria-hidden="true" viewBox="0 0 24 24" focusable="false">
              <circle cx="10.8" cy="10.8" r="6.8" />
              <path d="m16 16 5 5" />
            </svg>
          )}
        </button>
      </div>
      {(validationMessage || isSearching) && (
        <span
          className={validationMessage ? 'search-validation-message' : 'search-progress-message'}
          id={validationMessage ? 'search-validation-message' : undefined}
          role="status"
        >
          {validationMessage || 'Searching movies…'}
        </span>
      )}
    </form>
  );
}

export default SearchBar;