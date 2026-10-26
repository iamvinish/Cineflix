const API_KEY = import.meta.env.VITE_YOUTUBE_API_KEY;
const API_BASE_URL = 'https://www.googleapis.com/youtube/v3';
const inFlightSearches = new Map();
const searchCache = new Map();
const knownTrailers = [
  {
    title: 'Ranabaali',
    releaseYear: '2026',
    videoId: 'W8EKIHOq9h8',
    channel: 'Mythri Movie Makers',
    productionCompany: 'Mythri Movie Makers'
  }
];

const normalize = (value) => value
  .normalize('NFKD')
  .replace(/[\u0300-\u036f]/g, '')
  .toLowerCase()
  .replace(/[^a-z0-9]+/g, ' ')
  .trim();

const channelMatchesProductionCompany = (channelTitle, companies = []) => {
  const channel = normalize(channelTitle);
  return companies.some(({ name }) => {
    const company = normalize(name || '');
    if (company.length < 5) return false;
    if (channel.includes(company)) return true;

    const significantWords = company.split(' ').filter((word) => word.length > 2);
    return significantWords.length >= 2
      && significantWords.every((word) => channel.includes(word));
  });
};

const matchesMovie = (video, movie, year) => {
  const title = normalize(movie.title || movie.name || '');
  const videoTitle = normalize(video.snippet?.title || '');
  const yearsInTitle = videoTitle.match(/\b(?:19|20)\d{2}\b/g) || [];
  const yearMatches = !year || yearsInTitle.length === 0 || yearsInTitle.includes(year);

  return title.length > 0
    && videoTitle.includes(title)
    && videoTitle.includes('official')
    && videoTitle.includes('trailer')
    && yearMatches
    && video.status?.embeddable === true
    && video.status?.privacyStatus === 'public'
    && channelMatchesProductionCompany(video.snippet?.channelTitle, movie.production_companies);
};

const findKnownTrailer = (movie) => {
  const movieTitle = normalize(movie.title || movie.name || '');
  const movieYear = movie.release_date?.slice(0, 4);
  const knownTrailer = knownTrailers.find((trailer) =>
    movieTitle === normalize(trailer.title)
    && (!movieYear || movieYear === trailer.releaseYear)
    && movie.production_companies?.some(
      ({ name }) => normalize(name || '') === normalize(trailer.productionCompany)
    )
  );

  if (!knownTrailer) return null;
  return {
    status: 'found',
    video: {
      key: knownTrailer.videoId,
      site: 'YouTube',
      type: 'Trailer',
      official: true,
      channel: knownTrailer.channel
    }
  };
};

const requestYouTube = async (endpoint, params) => {
  const url = new URL(`${API_BASE_URL}/${endpoint}`);
  Object.entries({ ...params, key: API_KEY }).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      url.searchParams.set(key, value);
    }
  });

  const response = await fetch(url);
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.error?.message || `YouTube API request failed (${response.status}).`);
  }
  return data;
};

const searchMovieTrailer = async (movie) => {
  if (!API_KEY) return { status: 'not-configured' };

  const title = movie.title || movie.name;
  if (!title) return { status: 'not-found' };
  const year = movie.release_date?.slice(0, 4);

  const searchResults = await requestYouTube('search', {
    part: 'snippet',
    type: 'video',
    videoEmbeddable: 'true',
    maxResults: 10,
    q: [title, year, 'official trailer'].filter(Boolean).join(' ')
  });
  const videoIds = searchResults.items
    ?.map((item) => item.id?.videoId)
    .filter((videoId) => typeof videoId === 'string' && /^[\w-]{11}$/.test(videoId)) || [];

  if (videoIds.length === 0) return { status: 'not-found' };

  const videoResults = await requestYouTube('videos', {
    part: 'snippet,status',
    id: videoIds.join(',')
  });
  const verifiedVideo = videoResults.items?.find((video) => matchesMovie(video, movie, year));

  if (!verifiedVideo?.id) return { status: 'not-found' };
  return {
    status: 'found',
    video: {
      key: verifiedVideo.id,
      site: 'YouTube',
      type: 'Trailer',
      official: true
    }
  };
};

export const findYouTubeTrailer = (movie) => {
  const cacheKey = [
    movie.id,
    normalize(movie.title || movie.name || ''),
    movie.release_date?.slice(0, 4) || '',
    ...(movie.production_companies || []).map(({ name }) => normalize(name || ''))
  ].join(':');
  if (searchCache.has(cacheKey)) return Promise.resolve(searchCache.get(cacheKey));
  if (inFlightSearches.has(cacheKey)) return inFlightSearches.get(cacheKey);

  const knownTrailer = findKnownTrailer(movie);
  if (knownTrailer) {
    searchCache.set(cacheKey, knownTrailer);
    return Promise.resolve(knownTrailer);
  }
  if (!API_KEY) return Promise.resolve({ status: 'not-configured' });

  const search = searchMovieTrailer(movie)
    .then((result) => {
      searchCache.set(cacheKey, result);
      return result;
    })
    .finally(() => {
      inFlightSearches.delete(cacheKey);
    });
  inFlightSearches.set(cacheKey, search);
  return search;
};
