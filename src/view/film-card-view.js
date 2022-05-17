import View from './view-class-preset';
import { humanizeReleaseDate, getRuntimeFromMins } from '../util';


const createFilmCardTemplate = (film) => {
  const {title, totalRating, poster, description, release, runtime, genre} = film.filmInfo;

  const releaseYear = release.date !== null
    ? humanizeReleaseDate(release.date, 'YYYY')
    : '';


  return (
    `<article class="film-card">
    <a class="film-card__link">
    <h3 class="film-card__title">${title}</h3>
    <p class="film-card__rating">${totalRating}</p>
    <p class="film-card__info">
      <span class="film-card__year">${releaseYear}</span>
      <span class="film-card__duration">${getRuntimeFromMins(runtime)}</span>
      <span class="film-card__genre">${genre}</span>
    </p>
    <img src="./images/posters/${poster}" alt="" class="film-card__poster">
    <p class="film-card__description">${description}</p>
    <span class="film-card__comments">5 comments</span>
  </a>
  <div class="film-card__controls">
    <button class="film-card__controls-item film-card__controls-item--add-to-watchlist" type="button">Add to watchlist</button>
    <button class="film-card__controls-item film-card__controls-item--mark-as-watched" type="button">Mark as watched</button>
    <button class="film-card__controls-item film-card__controls-item--favorite" type="button">Mark as favorite</button>
  </div>
</article>`);

};

export default class FilmCardView extends View {

  constructor(film) {
    super();
    this.film = film;
  }

  get template() {
    return createFilmCardTemplate(this.film);
  }

}
