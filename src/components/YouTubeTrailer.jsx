import React, { useEffect, useRef, useState } from 'react';
import '../styles/MovieDetails.css';

let iframeApiPromise;

const loadYouTubeIframeApi = () => {
  if (window.YT?.Player) return Promise.resolve(window.YT);
  if (iframeApiPromise) return iframeApiPromise;

  iframeApiPromise = new Promise((resolve, reject) => {
    const timeout = window.setTimeout(() => {
      reject(new Error('YouTube player took too long to load.'));
    }, 15000);
    const existingCallback = window.onYouTubeIframeAPIReady;

    window.onYouTubeIframeAPIReady = () => {
      existingCallback?.();
      window.clearTimeout(timeout);
      if (window.YT?.Player) {
        resolve(window.YT);
      } else {
        reject(new Error('YouTube player is unavailable.'));
      }
    };

    if (!document.querySelector('script[src="https://www.youtube.com/iframe_api"]')) {
      const script = document.createElement('script');
      script.src = 'https://www.youtube.com/iframe_api';
      script.async = true;
      script.onerror = () => {
        window.clearTimeout(timeout);
        reject(new Error('Could not load the YouTube player.'));
      };
      document.head.appendChild(script);
    }
  }).catch((error) => {
    iframeApiPromise = null;
    throw error;
  });

  return iframeApiPromise;
};

function YouTubeTrailer({ videoId, title, onUnavailable }) {
  const playerContainerRef = useRef(null);
  const playerRef = useRef(null);
  const onUnavailableRef = useRef(onUnavailable);
  const [playerReadyVideoId, setPlayerReadyVideoId] = useState(null);
  const playerReady = playerReadyVideoId === videoId;

  useEffect(() => {
    onUnavailableRef.current = onUnavailable;
  }, [onUnavailable]);

  useEffect(() => {
    let cancelled = false;

    loadYouTubeIframeApi()
      .then((YouTube) => {
        if (cancelled || !playerContainerRef.current) return;

        playerRef.current = new YouTube.Player(playerContainerRef.current, {
          width: '100%',
          height: '100%',
          videoId,
          playerVars: {
            autoplay: 1,
            controls: 1,
            enablejsapi: 1,
            origin: window.location.origin,
            playsinline: 1,
            rel: 0,
            modestbranding: 1
          },
          events: {
            onReady: (event) => {
              if (cancelled) {
                event.target.destroy();
                return;
              }
              setPlayerReadyVideoId(videoId);
              event.target.playVideo();
            },
            onError: () => {
              if (!cancelled) onUnavailableRef.current();
            }
          }
        });
      })
      .catch((error) => {
        if (!cancelled) {
          console.error('Failed to initialize the YouTube trailer player:', error);
          onUnavailableRef.current();
        }
      });

    return () => {
      cancelled = true;
      playerRef.current?.destroy();
      playerRef.current = null;
    };
  }, [videoId]);

  return (
    <div className="youtube-player-frame">
      {!playerReady && <p className="trailer-player-loading" role="status">Loading trailer…</p>}
      <div
        className="youtube-player-container"
        ref={playerContainerRef}
        title={`${title} trailer`}
      />
    </div>
  );
}

export default YouTubeTrailer;
