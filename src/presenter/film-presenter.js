
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

  constructor(commentList, changeData) {
    this.#commentList = commentList;
    this.#changeData = changeData;
  }

  init = (film, containerBlock) => {

    this.#filmItem = film;

    const prevFilmCardComponent = this.#filmCardComponent;

    this.#filmCardComponent = new FilmsCardView(film);

    this.#filmCardComponent.setFilmClickHandler(this.#renderPopup);
    this.#filmCardComponent.setWatchlistClickHandler(this.#handleWatchListClick);
    this.#filmCardComponent.setAlreadyWatchedClickHandler(this.#handleAlreadyWatchedClick);
    this.#filmCardComponent.setFavoriteClickHandler(this.#handleFavoriteWatchedClick);

    if(!prevFilmCardComponent) {
      render(this.#filmCardComponent, containerBlock);
      return;
    }

    if(containerBlock.contains(prevFilmCardComponent.element)) {
      replace(this.#filmCardComponent, prevFilmCardComponent);
    }
    remove(prevFilmCardComponent);

  };

  #renderPopup = () => {

    if(document.querySelector('.film-details')) {
      document.querySelector('.film-details').remove();
    }

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
  };

  #handleAlreadyWatchedClick = () => {
    this.#changeData({...this.#filmItem, userDetails: {...this.#filmItem.userDetails, alreadyWatched: !this.#filmItem.userDetails.alreadyWatched}});
  };

  #handleFavoriteWatchedClick = () => {
    this.#changeData({...this.#filmItem, userDetails: {...this.#filmItem.userDetails, favorite: !this.#filmItem.userDetails.favorite}});
  };

}
