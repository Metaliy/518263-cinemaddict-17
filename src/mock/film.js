import { getRandomInteger, generateDate } from '../util';


const generateDescription = () => {
  const description = `
Lorem ipsum dolor sit amet, consectetur adipiscing elit.
Cras aliquet varius magna, non porta ligula feugiat eget.
Fusce tristique felis at fermentum pharetra. Aliquam id orci ut lectus varius viverra.
Nullam nunc ex, convallis sed finibus eget, sollicitudin eget ante.
Phasellus eros mauris, condimentum sed nibh vitae, sodales efficitur ipsum.
Sed blandit, eros vel aliquam faucibus, purus ex euismod diam, eu luctus nunc ante ut dui.
Sed sed nisi sed augue convallis suscipit in sed felis. Aliquam erat volutpat.
Nunc fermentum tortor ac porta dapibus. In rutrum ac purus sit amet tempus.
`.split('.');

  const randomIndex = getRandomInteger(0, description.length - 1);

  return description[randomIndex];
};

const generatePoster = () => {
  const postersName = [
    'made-for-each-other.png',
    'popeye-meets-sinbad.png',
    'sagebrush-trail.jpg',
    'santa-claus-conquers-the-martians.jpg',
    'the-dance-of-life.jpg',
    'the-great-flamarion.jpg',
    'the-man-with-the-golden-arm.jpg'
  ];
  return postersName[getRandomInteger(0, postersName.length - 1)];
};

export const generateFilm = () => ({
  _id: '0',
  filmInfo: {
    title: 'A Little Pony Without The Carpet',
    alternativeTitle: 'Laziness Who Sold Themselves',
    totalRating: getRandomInteger(0, 100) / 10,
    poster: generatePoster(),
    ageRating: 0,
    director: 'Tom Ford',
    writers: [
      'Takeshi Kitano'
    ],
    actors: [
      'Morgan Freeman'
    ],
    release: {
      date: generateDate(),
      releaseCountry: 'Finland'
    },
    runtime: 77,
    genre: [
      'Comedy'
    ],
    description: generateDescription(),
    commentCount: getRandomInteger(0, 100)
  },
  userDetails: {
    watchlist: Boolean(getRandomInteger(0, 1)),
    alreadyWatched: Boolean(getRandomInteger(0, 1)),
    watchingDate: '2019-04-12T16:12:32.554Z',
    favorite: Boolean(getRandomInteger(0, 1))
  },

  get id() {
    return this._id ;
  },

  set id(newValue) {
    this._id = newValue;
  }
});
