import { getRandomInteger, getRandomArrayElement, generateDate } from '../util';


import { AUTHORS,  TEXTS,  EMOJIS} from '../const';


export const generateComment = () => ({
  id: getRandomInteger(0, 11),
  author: getRandomArrayElement(AUTHORS),
  comment: getRandomArrayElement(TEXTS),
  date: generateDate(),
  emotion: getRandomArrayElement(EMOJIS)
}
);
