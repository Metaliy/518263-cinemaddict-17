import { getRandomInteger, getRandomArrayElement, generateDate } from '../util';


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

export const generateComment = () => ({
  id: getRandomInteger(0, 11),
  author: getRandomArrayElement(AUTHORS),
  comment: getRandomArrayElement(TEXTS),
  date: generateDate(),
  emotion: getRandomArrayElement(EMOJIS)
}
);
