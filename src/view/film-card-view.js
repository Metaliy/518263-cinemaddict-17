import AbstractView from '../framework/view/abstract-view';
import { humanizeReleaseDate, getRuntimeFromMins } from '../util';

const checkDescriptionMaxLength = (description) => {
  let shortDescription = '';
  if(description.length >= 140) {
    shortDescription = description.slice(0, 139).concat('...');
  }
  return shortDescription;
};

const createFilmCardTemplate = (film) => {
  const {title, totalRating, poster, description, release, runtime, genre} = film.filmInfo;
  const {watchlist, alreadyWatched, favorite} = film.userDetails;

  const releaseYear = release.date !== null
    ? humanizeReleaseDate(release.date, 'YYYY')
    : '';
  const checkFilmControlsCondition = (controlType) => controlType ? 'film-card__controls-item--active' : '';

  return (
    `<article class="film-card">
    <a class="film-card__link">
    <h3 class="film-card__title">${title}</h3>
    <p class="film-card__rating">${totalRating}</p>
    <p class="film-card__info">
      <span class="film-card__year">${releaseYear}</span>
      <span class="film-card__duration">${getRuntimeFromMins(runtime)}</span>
      <span class="film-card__genre">${genre[0]}</span>
    </p>
    <img src="${poster}" alt="" class="film-card__poster">
    <p class="film-card__description">${checkDescriptionMaxLength(description)}</p>
    <span class="film-card__comments">${film.comments.length} comments</span>
  </a>
  <div class="film-card__controls">
    <button class="film-card__controls-item film-card__controls-item--add-to-watchlist ${checkFilmControlsCondition(watchlist)}" type="button">Add to watchlist</button>
    <button class="film-card__controls-item film-card__controls-item--mark-as-watched ${checkFilmControlsCondition(alreadyWatched)}" type="button">Mark as watched</button>
    <button class="film-card__controls-item film-card__controls-item--favorite ${checkFilmControlsCondition(favorite)}" type="button">Mark as favorite</button>
  </div>
</article>`);

};

export default class FilmCardView extends AbstractView {

  constructor(film) {
    super();
    this.film = film;
  }

  get template() {
    return createFilmCardTemplate(this.film);
  }

  setFilmClickHandler = (callback) => {
    this._callback.click = callback;
    this.element.querySelector('.film-card__link').addEventListener('click', this.#filmclickHandler);
  };

  #filmclickHandler = (evt) => {
    evt.preventDefault();
    this._callback.click();
  };

  #filmControlClickHandler = (evt, callback, controlName) => {
    evt.preventDefault();
    callback([controlName]);
  };

  setWatchlistClickHandler = (callback) => {
    this._callback.watchlistClick = callback;
    this.element.querySelector('.film-card__controls-item--add-to-watchlist').addEventListener('click', (evt) => this.#filmControlClickHandler(evt, callback, 'watchlist'));
  };

  setAlreadyWatchedClickHandler = (callback) => {
    this._callback.alreadyWatched = callback;
    this.element.querySelector('.film-card__controls-item--mark-as-watched').addEventListener('click', (evt) => this.#filmControlClickHandler(evt, callback, 'alreadyWatched'));
  };

  setFavoriteClickHandler = (callback) => {
    this._callback.favorite = callback;
    this.element.querySelector('.film-card__controls-item--favorite').addEventListener('click', (evt) => this.#filmControlClickHandler(evt, callback, 'favorite'));
  };


}
