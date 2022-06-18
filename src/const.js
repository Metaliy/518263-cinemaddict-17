
const SortType = {
  DEFAULT: 'default',
  DATE: 'date',
  RATING: 'rating',
};

const AUTHORS = [
  'Iván Jara',
  'J Silva',
  'Naruto',
  'RATIOO',
  'Borko Milenkovic'
];


const TEXTS = [
  'As a manga reader I am gonna say that this anime will be good if they did not change anything from the manga',
  'The animation looks so insane and this is one of my favorite mangas I dont want to wait any longer!',
  'got caught up with the manga within a day after seeing the trailer, cant wait for this to come out',
  'Finally something looks good',
  'Gracias por los subtitulos en español',
];


const EMOJIS = [
  'smile',
  'sleeping',
  'puke',
  'angry',
];

const UserAction = {
  UPDATE_FILM: 'UPDATE_FILM',
  ADD_COMMENT: 'ADD_COMMENT',
  DELETE_COMMENT: 'DELETE_COMMENT',
};

const UpdateType = {
  PATCH: 'PATCH',
  MINOR: 'MINOR',
  MAJOR: 'MAJOR',
};

const FilterType = {
  ALL: 'all',
  WATCH_LIST: 'watchlist',
  HISTORY: 'history',
  FAVORITES: 'favorites',
};

const FILM_COUNT_PER_STEP = 5;
const ADDITIONAL_FILM_COUNT = 2;

export {SortType, FILM_COUNT_PER_STEP, ADDITIONAL_FILM_COUNT, AUTHORS, TEXTS, EMOJIS, UserAction, UpdateType, FilterType};
