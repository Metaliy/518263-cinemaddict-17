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

export {getRandomInteger, humanizeReleaseDate, getRuntimeFromMins, getRandomArrayElement, isEscKeyPressed};
