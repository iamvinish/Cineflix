import React from 'react';
import SearchBar from './SearchBar';
import '../styles/Header.css';

function Header({ onNavigate, activePage, onSearch }) {
  return (
    <header className="header">
      <div className="header-left">
        <button className="cineflix-logo" type="button" onClick={() => onNavigate('home')} aria-label="CineFlix home">
          CineFlix
        </button>

        <nav className="header-nav" aria-label="Main navigation">
          <button 
            className={`nav-link ${activePage === 'home' ? 'active' : ''}`}
            onClick={() => onNavigate('home')}
            aria-current={activePage === 'home' ? 'page' : undefined}
            type="button"
          >
            Home
          </button>
          <button
            className={`nav-link ${activePage === 'browse' ? 'active' : ''}`}
            onClick={() => onNavigate('browse')}
            aria-current={activePage === 'browse' ? 'page' : undefined}
            type="button"
          >
            Browse
          </button>
          <button 
            className={`nav-link ${activePage === 'favourites' ? 'active' : ''}`}
            onClick={() => onNavigate('favourites')}
            aria-current={activePage === 'favourites' ? 'page' : undefined}
            type="button"
          >
            My List
          </button>
          <button
            className={`nav-link ${activePage === 'history' ? 'active' : ''}`}
            onClick={() => onNavigate('history')}
            aria-current={activePage === 'history' ? 'page' : undefined}
            type="button"
          >
            History
          </button>
        </nav>
      </div>

      <div className="header-right">
        <SearchBar onSearch={onSearch} />
      </div>
    </header>
  );
}

export default Header;