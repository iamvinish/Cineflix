import React from 'react';
import '../styles/Footer.css';

function Footer() {
  return (
    <footer className="cineflix-footer">
      <div className="footer-content">
        <p>
          This product uses the TMDB API but is not endorsed or certified by TMDB.
        </p>
        <div className="footer-links">
          <a href="https://www.themoviedb.org/" target="_blank" rel="noreferrer">
            The Movie Database
          </a>
          <a href="https://developer.themoviedb.org/docs" target="_blank" rel="noreferrer">
            TMDB API documentation
          </a>
        </div>
      </div>
    </footer>
  );
}

export default Footer;