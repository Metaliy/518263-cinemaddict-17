import AbstractStatefulView from '../framework/view/abstract-stateful-view';
import FilmsPopupCommentView from './film-popup-comment-view';
import { humanizeReleaseDate, getRuntimeFromMins } from '../util';


const createPopupFilmDetailsTemplate = (film, filteredCommentsArray) => {
  const {newCommentEmoji} = film;
  const {title, alternativeTitle, totalRating, poster, description, director, writers, actors, release, runtime, genre} = film.filmInfo;
  const {watchlist, alreadyWatched, favorite} = film.userDetails;

  const releaseDate = release.date !== null
    ? humanizeReleaseDate(release.date, 'D MMMM YYYY')
    : '';

  const checkFilmControlsCondition = (controlType) => controlType ? 'film-details__control-button--active' : '';

  const createReactionImage = (emoji) => `<img src="images/emoji/${emoji}.png" width="55" height="55" alt="emoji-smile">`;


  const renderComemnts = filteredCommentsArray.map((comment) =>  new FilmsPopupCommentView(comment).template).join('');
  return (
    `<section class="film-details">
  <form class="film-details__inner" action="" method="get">
    <div class="film-details__top-container">
      <div class="film-details__close">
        <button class="film-details__close-btn" type="button">close</button>
      </div>
      <div class="film-details__info-wrap">
        <div class="film-details__poster">
          <img class="film-details__poster-img" src="./images/posters/${poster}" alt="">

          <p class="film-details__age">18+</p>
        </div>

        <div class="film-details__info">
          <div class="film-details__info-head">
            <div class="film-details__title-wrap">
              <h3 class="film-details__title">${title}</h3>
              <p class="film-details__title-original">${alternativeTitle}</p>
            </div>

            <div class="film-details__rating">
              <p class="film-details__total-rating">${totalRating}</p>
            </div>
          </div>

          <table class="film-details__table">
            <tr class="film-details__row">
              <td class="film-details__term">Director</td>
              <td class="film-details__cell">${director}</td>
            </tr>
            <tr class="film-details__row">
              <td class="film-details__term">Writers</td>
              <td class="film-details__cell">${writers}</td>
            </tr>
            <tr class="film-details__row">
              <td class="film-details__term">Actors</td>
              <td class="film-details__cell">${actors}</td>
            </tr>
            <tr class="film-details__row">
              <td class="film-details__term">Release Date</td>
              <td class="film-details__cell">${releaseDate}</td>
            </tr>
            <tr class="film-details__row">
              <td class="film-details__term">Runtime</td>
              <td class="film-details__cell">${getRuntimeFromMins(runtime)}</td>
            </tr>
            <tr class="film-details__row">
              <td class="film-details__term">Country</td>
              <td class="film-details__cell">${release.releaseCountry}</td>
            </tr>
            <tr class="film-details__row">
              <td class="film-details__term">Genre</td>
              <td class="film-details__cell">
                <span class="film-details__genre">${genre}</span>
            </tr>
          </table>

          <p class="film-details__film-description">
            ${description}
          </p>
        </div>
      </div>

      <section class="film-details__controls">
        <button type="button" class="film-details__control-button film-details__control-button--watchlist ${checkFilmControlsCondition(watchlist)}" id="watchlist" name="watchlist">Add to watchlist</button>
        <button type="button" class="film-details__control-button film-details__control-button--watched ${checkFilmControlsCondition(alreadyWatched)}" id="watched" name="watched">Already watched</button>
        <button type="button" class="film-details__control-button film-details__control-button--favorite ${checkFilmControlsCondition(favorite)}" id="favorite" name="favorite">Add to favorites</button>
      </section>
    </div>

    <div class="film-details__bottom-container">
      <section class="film-details__comments-wrap">
        <h3 class="film-details__comments-title">Comments <span class="film-details__comments-count"></span></h3>

        <ul class="film-details__comments-list">
        ${renderComemnts}
        </ul>

        <div class="film-details__new-comment">
          <div class="film-details__add-emoji-label">
            ${newCommentEmoji ? createReactionImage(newCommentEmoji) : ''}
          </div>

          <label class="film-details__comment-label">
            <textarea class="film-details__comment-input" placeholder="Select reaction below and write comment here" name="comment"></textarea>
          </label>

          <div class="film-details__emoji-list">
            <input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-smile" value="smile" ${newCommentEmoji === 'smile' ? 'checked' : ' '}>
            <label class="film-details__emoji-label" for="emoji-smile" data="smile">
              <img src="./images/emoji/smile.png" width="30" height="30" alt="emoji">
            </label>

            <input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-sleeping" value="sleeping" ${newCommentEmoji === 'sleeping' ? 'checked' : ' '}>
            <label class="film-details__emoji-label" for="emoji-sleeping" data-emoji-type="sleeping">
              <img src="./images/emoji/sleeping.png" width="30" height="30" alt="emoji">
            </label>

            <input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-puke" value="puke" ${newCommentEmoji === 'puke' ? 'checked' : ' '}>
            <label class="film-details__emoji-label" for="emoji-puke" data-emoji-type="puke">
              <img src="./images/emoji/puke.png" width="30" height="30" alt="emoji">
            </label>

            <input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-angry" value="angry" ${newCommentEmoji === 'angry' ? 'checked' : ' '}>
            <label class="film-details__emoji-label" for="emoji-angry" data-emoji-type="angry">
              <img src="./images/emoji/angry.png" width="30" height="30" alt="emoji">
            </label>
          </div>
        </div>
      </section>
    </div>
  </form>
</section>`);

};

export default class PopupFilmDetailsView extends AbstractStatefulView {


  constructor(film, filteredCommentsArray) {
    super();
    this.filteredCommentsArray = filteredCommentsArray;
    this._state = PopupFilmDetailsView.parseFilmToState(film);
    this.#setInnerHandlers();
  }

  get template() {
    return createPopupFilmDetailsTemplate(this._state, this.filteredCommentsArray);
  }

  static parseFilmToState = (film) => ({...film, newCommentEmoji: '' });

  static parseStateToFilm = (state) => {
    const film = {...state};

    delete film.newCommentEmoji;

    return film;
  };

  #emojiClickHandler = (evt) => {
    const scrollPosition = this.element.scrollTop;
    evt.preventDefault();
    const evtTarget = evt.target.parentNode.previousElementSibling;
    switch (evtTarget.id) {
      case 'emoji-smile':
        this._state.newCommentEmoji = 'smile';
        evtTarget.checked = 'true';
        break;

      case 'emoji-sleeping':
        this._state.newCommentEmoji = 'sleeping';
        break;

      case 'emoji-puke':
        this._state.newCommentEmoji = 'puke';
        break;

      case 'emoji-angry':
        this._state.newCommentEmoji = 'angry';
        break;
    }

    this.updateElement({newCommentEmoji: this._state.newCommentEmoji});
    this.element.scrollTop = scrollPosition;
  };

  #setInnerHandlers = () => {
    this.element.querySelector('.film-details__emoji-list').addEventListener('click', this.#emojiClickHandler);
  };

  _restoreHandlers = () => {
    this.#setInnerHandlers();
    this.setCloseButtonClickHandler(this._callback.click);
    this.setWatchlistClickHandler(this._callback.watchlistClick);
    this.setAlreadyWatchedClickHandler(this._callback.alreadyWatched);
    this.setFavoriteClickHandler(this._callback.favorite);
  };


  setCloseButtonClickHandler = (callback) => {
    this._callback.click = callback;
    this.element.querySelector('.film-details__close-btn').addEventListener('click', this.#CloseButtonClickHandler);
  };

  #CloseButtonClickHandler = (evt) => {
    evt.preventDefault();
    this._callback.click();
  };

  #filmControlClickHandler = (evt, callback, controlName) => {
    evt.preventDefault();
    callback([controlName]);
  };

  setWatchlistClickHandler = (callback) => {
    this._callback.watchlistClick = callback;
    this.element.querySelector('.film-details__control-button--watchlist').addEventListener('click', (evt) => this.#filmControlClickHandler(evt, callback, 'watchlist'));
  };


  setAlreadyWatchedClickHandler = (callback) => {
    this._callback.alreadyWatched = callback;
    this.element.querySelector('.film-details__control-button--watched').addEventListener('click', (evt) => this.#filmControlClickHandler(evt, callback, 'alreadyWatched'));
  };


  setFavoriteClickHandler = (callback) => {
    this._callback.favorite = callback;
    this.element.querySelector('.film-details__control-button--favorite').addEventListener('click', (evt) => this.#filmControlClickHandler(evt, callback, 'callback'));
  };


}
