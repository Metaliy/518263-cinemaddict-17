
import FilmsCardView from '../view/film-card-view';
import PopupFilmDetailsView from '../view/popup-film-details-view';
import FilmsPopupCommentView from '../view/film-popup-comment-view';
import {render, remove, replace} from '../framework/render';
import {isEscKeyPressed} from '../util';

const getIdFilteredArray = (filmiD, commentsArray) => {
  const fillteredArray = commentsArray.filter((item) => item.id === filmiD);
  return fillteredArray;
};


export default class FilmPresenter {

  #commentList;
  #filteredArray;
  #changeData;
  #filmCardComponent;
  #popupComponent;
  #filmItem;
  #containerBlock;
  #updateMainNav;

  constructor(commentList, changeData, containerBlock, updateMainNav) {
    this.#commentList = commentList;
    this.#changeData = changeData;
    this.#containerBlock = containerBlock;
    this.#updateMainNav = updateMainNav;
  }

  init = (film) => {

    this.#filmItem = film;

    const prevFilmCardComponent = this.#filmCardComponent;

    this.#filmCardComponent = new FilmsCardView(film);

    this.#filmCardComponent.setFilmClickHandler(this.#onCardClick);
    this.#filmCardComponent.setWatchlistClickHandler(this.#handleWatchListClick);
    this.#filmCardComponent.setAlreadyWatchedClickHandler(this.#handleAlreadyWatchedClick);
    this.#filmCardComponent.setFavoriteClickHandler(this.#handleFavoriteWatchedClick);

    if(!prevFilmCardComponent) {
      render(this.#filmCardComponent, this.#containerBlock);
      return;
    }

    if(this.#containerBlock.contains(prevFilmCardComponent.element)) {
      replace(this.#filmCardComponent, prevFilmCardComponent);
    }
    remove(prevFilmCardComponent);

  };

  destroy = () => {
    remove(this.#filmCardComponent);
  };

  copyItem = (anoyherTops) => {
    render(this.#filmCardComponent, anoyherTops);
  };

  #onCardClick = () => {
    if(document.querySelector('.film-details')) {
      document.querySelector('.film-details').remove();
    }
    this.#renderPopup();
  };

  #renderPopup = () => {

    document.body.classList.add('hide-overflow');

    this.#popupComponent = new PopupFilmDetailsView(this.#filmItem);
    this.#popupComponent.setWatchlistClickHandler(this.#handleWatchListClick);
    this.#popupComponent.setAlreadyWatchedClickHandler(this.#handleAlreadyWatchedClick);
    this.#popupComponent.setFavoriteClickHandler(this.#handleFavoriteWatchedClick);

    render(this.#popupComponent, document.querySelector('body'));

    const onEscKeyDown = (evt) => {
      if(isEscKeyPressed(evt)) {
        remove(this.#popupComponent);
        document.body.classList.remove('hide-overflow');
        document.removeEventListener('keydown', onEscKeyDown);
      }
    };

    const onCloseButtonClick = () => {
      remove(this.#popupComponent);
      document.body.classList.remove('hide-overflow');
      document.removeEventListener('keydown', onEscKeyDown);
    };

    this.#filteredArray = getIdFilteredArray(this.#filmItem.id, this.#commentList);

    for (let i = 0; i < this.#filteredArray.length; i++) {
      render( new FilmsPopupCommentView (this.#filteredArray[i]), this.#popupComponent.element.querySelector('.film-details__comments-list'));
    }

    this.#popupComponent.setCloseButtonClickHandler(onCloseButtonClick);
    document.addEventListener('keydown', onEscKeyDown);
  };


  #handleWatchListClick  = () => {
    this.#changeData({...this.#filmItem, userDetails: {...this.#filmItem.userDetails, watchlist: !this.#filmItem.userDetails.watchlist}});
    this.#updateMainNav();
  };

  #handleAlreadyWatchedClick = () => {
    this.#changeData({...this.#filmItem, userDetails: {...this.#filmItem.userDetails, alreadyWatched: !this.#filmItem.userDetails.alreadyWatched}});
    this.#updateMainNav();
  };

  #handleFavoriteWatchedClick = () => {
    this.#changeData({...this.#filmItem, userDetails: {...this.#filmItem.userDetails, favorite: !this.#filmItem.userDetails.favorite}});
    this.#updateMainNav();
  };

}
