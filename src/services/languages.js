export const BROWSE_LANGUAGES = [
  { code: 'en', name: 'English' },
  { code: 'hi', name: 'Hindi' },
  { code: 'te', name: 'Telugu' },
  { code: 'ta', name: 'Tamil' },
  { code: 'kn', name: 'Kannada' },
  { code: 'ml', name: 'Malayalam' },
  { code: 'ko', name: 'Korean' },
  { code: 'ja', name: 'Japanese' },
  { code: 'es', name: 'Spanish' }
];

const languageNames = new Intl.DisplayNames(['en'], { type: 'language' });
const languageNameFallbacks = new Map(
  BROWSE_LANGUAGES.map(({ code, name }) => [code, name])
);

export const getLanguageName = (languageCode) => {
  if (!languageCode) return null;
  return languageNameFallbacks.get(languageCode) || languageNames.of(languageCode) || languageCode;
};
