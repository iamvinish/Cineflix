import React from 'react';
import '../styles/ErrorMessage.css';

function ErrorMessage({ message }) {
  return (
    <div className="cineflix-error">
      <h3>Oops! Something went wrong.</h3>
      <p>{message || "Failed to load movie data. Please check your connection."}</p>
    </div>
  );
}

export default ErrorMessage;