import dayjs from 'dayjs';


const getRandomInteger = (a = 0, b = 1) => {
  const lower = Math.ceil(Math.min(a, b));
  const upper = Math.floor(Math.max(a, b));

  return Math.floor(lower + Math.random() * (upper - lower + 1));
};

const humanizeReleaseDate = (dueDate, dateFormat) => dayjs(dueDate).format(dateFormat);

const getRuntimeFromMins = (mins) => {
  const hour = Math.trunc(mins/60);
  const min = mins % 60;
  return `${hour}h ${min}m`;
};

const isEscKeyPressed = (evt) => evt.key === 'Esc' || evt.key === 'Escape';


const getRandomArrayElement = (array) => array[getRandomInteger(0, array.length - 1)];

const updateItem = (items, update) => items.map((item) => item.id === update.id ? update : item);

const generateDate = () => {
  const daysGap = getRandomInteger(-1, -10000);

  return dayjs().add(daysGap, 'day').toDate();
};

const getWeightForNullDate = (dateA, dateB) => {
  if (dateA === null && dateB === null) {
    return 0;
  }

  if (dateA === null) {
    return 1;
  }

  if (dateB === null) {
    return -1;
  }

  return null;
};

const sortFilm = (filmA, filmB) => {
  const weight = getWeightForNullDate(filmA.filmInfo.release.date, filmB.filmInfo.release.date);

  return weight ?? dayjs(filmB.filmInfo.release.date).diff(dayjs(filmA.filmInfo.release.date));
};

export {getRandomInteger, humanizeReleaseDate, getRuntimeFromMins, getRandomArrayElement, isEscKeyPressed, updateItem, generateDate, sortFilm};
