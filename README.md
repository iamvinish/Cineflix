# CineFlix

CineFlix is a React movie-discovery app powered by TMDB. Browse movie collections, search titles, filter by genre and original language, save a local My List, and review recently viewed titles. The Browse page remembers the selected language in this browser. Title details include available genres, original language, cast, and similar movies. When TMDB has a
YouTube trailer, opening a title's details starts that trailer; if TMDB has no
usable YouTube trailer, CineFlix can search YouTube Data API v3 for a strict
movie-title, year, embeddability, and production-channel match. The production
channel name is checked against TMDB metadata as a conservative heuristic; the
YouTube Data API does not expose a channel verification badge, so this is not
proof of channel ownership. Closing the details destroys the player. Audio and
captions are controlled by YouTube and appear only when available for the
selected trailer. CineFlix does not stream full movies.

## Setup

1. Install dependencies with `npm install`.
2. Copy `.env.example` to `.env` and add your required TMDB API key. Add the
   YouTube key if you want trailer search when TMDB has no video:

   ```env
   VITE_TMDB_API_KEY=your_tmdb_api_key
   VITE_YOUTUBE_API_KEY=your_youtube_data_api_v3_key
   ```

3. Enable YouTube Data API v3 in your Google Cloud project, create an API key,
   and add it as `VITE_YOUTUBE_API_KEY`. The app checks TMDB videos first, then
   searches YouTube only when TMDB has no usable YouTube trailer. The fallback
   accepts only public, embeddable videos whose title matches the movie and
   contains “official trailer,” and whose channel matches a TMDB production
   company. Candidates that fail those checks are not played.
   A narrowly matched, manually verified fallback is also included for the
   official Telugu Ranabaali trailer from Mythri Movie Makers; it is used only
   for the matching movie title, release year, and TMDB production company.
4. Start the development server with `npm run dev`.

`VITE_` environment variables are bundled into the browser app and are visible
to users; neither API key is a frontend secret. Restrict the TMDB key to the
required API and appropriate site/domain controls. Restrict the YouTube key to
YouTube Data API v3 and the app's HTTP referrers (localhost for development and
your production domain). Monitor and limit the Google Cloud quota. For stronger
key protection, proxy YouTube API requests through a server-side service rather
than exposing a key in this browser-only app. Never commit `.env`.

## Available scripts

- `npm run dev` — start the Vite development server
- `npm run build` — create a production build
- `npm run preview` — preview the production build
- `npm run lint` — run Oxlint

My List and recently viewed history are stored in the current browser only; they are not synced between devices. CineFlix does not provide full-movie playback, user accounts, or profiles.

Movie metadata and artwork are provided by TMDB. This product uses the TMDB API
but is not endorsed or certified by TMDB.
