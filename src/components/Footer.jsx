import React from 'react';
import '../styles/Footer.css';

const repositoryUrl = 'https://github.com/iamvinish/Cineflix';
const supportUrl = `${repositoryUrl}/issues`;

function Footer({ onNavigate }) {
  return (
    <footer className="cineflix-footer">
      <div className="footer-content">
        <p className="footer-contact">
          Questions or need help?{' '}
          <a href={supportUrl} target="_blank" rel="noopener noreferrer">
            Visit our GitHub support page
          </a>
        </p>

        <nav className="footer-link-columns" aria-label="Footer navigation">
          <section className="footer-link-group" aria-labelledby="footer-explore">
            <h2 id="footer-explore">Explore</h2>
            <ul>
              <li>
                <a href={`${repositoryUrl}#readme`} target="_blank" rel="noopener noreferrer">
                  About CineFlix
                </a>
              </li>
              <li><button type="button" onClick={() => onNavigate('browse')}>Browse Movies</button></li>
              <li>
                <a href="#popular-movies" onClick={(event) => {
                  event.preventDefault();
                  onNavigate('home', 'popular-movies');
                }}>
                  Popular Movies
                </a>
              </li>
              <li>
                <a href="#upcoming-releases" onClick={(event) => {
                  event.preventDefault();
                  onNavigate('home', 'upcoming-releases');
                }}>
                  Upcoming Releases
                </a>
              </li>
            </ul>
          </section>

          <section className="footer-link-group" aria-labelledby="footer-library">
            <h2 id="footer-library">Your CineFlix</h2>
            <ul>
              <li><button type="button" onClick={() => onNavigate('favourites')}>My List</button></li>
              <li><button type="button" onClick={() => onNavigate('history')}>Recently Viewed</button></li>
            </ul>
          </section>

          <section className="footer-link-group" aria-labelledby="footer-support">
            <h2 id="footer-support">Support</h2>
            <ul>
              <li><a href={supportUrl} target="_blank" rel="noopener noreferrer">Help</a></li>
              <li><a href={supportUrl} target="_blank" rel="noopener noreferrer">Contact</a></li>
            </ul>
          </section>

          <section className="footer-link-group" aria-labelledby="footer-more">
            <h2 id="footer-more">More</h2>
            <ul>
              <li><a href={repositoryUrl} target="_blank" rel="noopener noreferrer">GitHub Repository</a></li>
              <li><a href="https://www.themoviedb.org/" target="_blank" rel="noopener noreferrer">TMDB</a></li>
            </ul>
          </section>
        </nav>

        <div className="footer-brand">
          <span className="footer-wordmark">CINEFLIX</span>
          <p>Discover your next favorite story.</p>
        </div>

      </div>
    </footer>
  );
}

export default Footer;