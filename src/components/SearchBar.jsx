import React, { useRef, useState } from 'react';
import '../styles/SearchBar.css';

function SearchBar({ onSearch, onClear }) {
  const inputRef = useRef(null);
  const [query, setQuery] = useState('');
  const [validationMessage, setValidationMessage] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const submissionRef = useRef(0);

  const handleInputChange = (e) => {
    setQuery(e.target.value);
    if (validationMessage) setValidationMessage('');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (query.trim() === '') {
      setValidationMessage('Enter a movie title to search.');
      return;
    }
    setValidationMessage('');
    setIsSearching(true);
    const submissionId = ++submissionRef.current;
    Promise.resolve(onSearch(query.trim())).finally(() => {
      if (submissionId === submissionRef.current) setIsSearching(false);
    });
  };

  const handleClear = () => {
    submissionRef.current += 1;
    setQuery('');
    setValidationMessage('');
    setIsSearching(false);
    onClear();
    window.requestAnimationFrame(() => inputRef.current?.focus());
  };

  const handleInputKeyDown = (event) => {
    if (event.key === 'Escape' && (query || isSearching || validationMessage)) {
      event.preventDefault();
      handleClear();
    }
  };

  return (
    <form className="search-bar-form" onSubmit={handleSubmit} role="search">
      <div className="search-input-wrapper">
        <input
          ref={inputRef}
          type="text"
          className="search-input"
          placeholder="Search movies..."
          aria-label="Search movies by title"
          aria-invalid={Boolean(validationMessage)}
          aria-describedby={validationMessage ? 'search-validation-message' : undefined}
          aria-keyshortcuts="Escape"
          aria-busy={isSearching}
          value={query}
          onChange={handleInputChange}
          onKeyDown={handleInputKeyDown}
        />
        <button
          type="submit"
          className={`search-button${isSearching ? ' is-searching' : ''}`}
          aria-label={isSearching ? 'Searching movies' : 'Search movies'}
          aria-busy={isSearching}
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
        {query && (
          <button
            className="search-clear-button"
            type="button"
            onClick={handleClear}
            onMouseDown={(event) => event.preventDefault()}
            aria-label="Clear search"
          >
            <span aria-hidden="true">×</span>
          </button>
        )}
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