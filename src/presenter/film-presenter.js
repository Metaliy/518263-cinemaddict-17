
import FilmsCardView from '../view/film-card-view';
import PopupFilmDetailsView from '../view/popup-film-details-view';
import {render, remove, replace} from '../framework/render';
import {isEscKeyPressed} from '../util';
import { UserAction, UpdateType } from '../const';


export default class FilmPresenter {

  #commentModel;
  filteredArray;
  #changeData;
  #filmCardComponent;
  #popupComponent;
  #filmItem;
  #containerBlock;
  #changeMode;
  #comments;

  constructor(commentModel, containerBlock, changeData, changeMode) {
    this.#commentModel = commentModel;
    this.#changeData = changeData;
    this.#changeMode = changeMode;
    this.#containerBlock = containerBlock;

  }

  init = (film) => {
    this.#filmItem = film;

    const prevFilmCardComponent = this.#filmCardComponent;

    this.#filmCardComponent = new FilmsCardView(film);

    this.#filmCardComponent.setFilmClickHandler(this.#onCardClick);
    this.#filmCardComponent.setWatchlistClickHandler(this.#handleControlClick);
    this.#filmCardComponent.setAlreadyWatchedClickHandler(this.#handleControlClick);
    this.#filmCardComponent.setFavoriteClickHandler(this.#handleControlClick);

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
    this.#getComments();
  };

  #getComments = async () => {
    const comments = await this.#commentModel.getCommentsById(this.#filmItem.id);
    this.#renderPopup(comments);
  };

  #renderPopup = (comments) => {

    document.body.classList.add('hide-overflow');
    this.#popupComponent = new PopupFilmDetailsView(this.#filmItem, comments);
    this.#popupComponent.setWatchlistClickHandler(this.#handleControlClick);
    this.#popupComponent.setAlreadyWatchedClickHandler(this.#handleControlClick);
    this.#popupComponent.setFavoriteClickHandler(this.#handleControlClick);
    this.#popupComponent.setCommentDeleteClickHandler(this.#handleCommentDeleteClick);

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


    this.#popupComponent.setCloseButtonClickHandler(onCloseButtonClick);
    document.addEventListener('keydown', onEscKeyDown);
  };

  #rerenderPopup = () => {
    const popupScroll = this.#popupComponent.element.scrollTop;
    remove(this.#popupComponent);
    this.#renderPopup();
    this.#popupComponent.element.scrollTo(0, popupScroll);
  };

  #handleControlClick = (controlName) => {
    this.#changeData(UserAction.UPDATE_FILM, UpdateType.MINOR, {...this.#filmItem, userDetails: {...this.#filmItem.userDetails, [controlName]: !this.#filmItem.userDetails[controlName]}});
    if(this.#popupComponent) {
      this.#rerenderPopup();
    }
  };

  #handleCommentDeleteClick = (commentId) => {
    this.#commentModel.deleteComment(
      UpdateType.MINOR,
      commentId
    );

  };
}
