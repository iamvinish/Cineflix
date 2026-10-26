import React from 'react';
import '../styles/Loading.css';

function Loading({ message = "Loading cinematic experiences..." }) {
  return (
    <div className="cineflix-loading">
      <div className="spinner"></div>
      <p role="status">{message}</p>
      <div className="loading-skeleton-row" aria-hidden="true">
        {Array.from({ length: 7 }, (_, index) => (
          <div className="loading-skeleton-card" key={index}>
            <div className="loading-skeleton-poster"></div>
            <div className="loading-skeleton-title"></div>
            <div className="loading-skeleton-meta"></div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Loading;