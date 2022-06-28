
import FilmsCardView from '../view/film-card-view';
import PopupFilmDetailsView from '../view/popup-film-details-view';
import {render, remove} from '../framework/render';
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
  #prevFilmCardComponent;
  #savePopup;
  #changeModelData;


  constructor(
    commentModel,
    containerBlock,
    changeData,
    changeModelData,
    savePopup,
    popupComponent = null
  ) {
    this.#commentModel = commentModel;
    this.#changeData = changeData;
    this.#containerBlock = containerBlock;
    this.#savePopup = savePopup;
    this.#changeModelData = changeModelData;

    if (popupComponent) {
      this.#popupComponent = popupComponent;
      this.#savePopup(this.#popupComponent);
    }
  }

  init = (film) => {
    this.#filmItem = film;
    this.#prevFilmCardComponent = this.#filmCardComponent;
    this.#filmCardComponent = new FilmsCardView(this.#filmItem);
    this.#filmCardComponent.setFilmClickHandler(this.#onCardClick);
    this.#filmCardComponent.setWatchlistClickHandler(this.#handleControlClick);
    this.#filmCardComponent.setAlreadyWatchedClickHandler(this.#handleControlClick);
    this.#filmCardComponent.setFavoriteClickHandler(this.#handleControlClick);

    if (this.#popupComponent) {
      this.rerenderPopup();
    }

    if(!this.#prevFilmCardComponent) {
      return render(this.#filmCardComponent, this.#containerBlock);
    }
  };

  destroy = () => {
    remove(this.#filmCardComponent);
  };


  #onCardClick = () => {
    if(this.#popupComponent) {
      remove(this.#popupComponent);
    }
    this.#updatePopup();
  };

  #updatePopup = async () => {
    const commentsArray = await this.#commentModel.getCommentsById(this.#filmItem.id);
    this.#popupComponent = new PopupFilmDetailsView(this.#filmItem, commentsArray);
    this.#savePopup(this.#popupComponent);
    document.addEventListener('keydown', this.#onEscKeyDown);
    this.#popupComponent.setCloseButtonClickHandler(this.#onCloseButtonClick);
    this.#replacePopup(commentsArray);
  };

  #replacePopup = () => {
    render(this.#popupComponent, document.querySelector('body'));
    const popupScroll = this.#popupComponent.element.scrollTop;

    this.#setPopupHandlers(this.#popupComponent);
    this.#popupComponent.element.scrollTop = popupScroll;
  };

  #setPopupHandlers = (popup) => {
    popup.setWatchlistClickHandler(this.#handleControlClick);
    popup.setAlreadyWatchedClickHandler(this.#handleControlClick);
    popup.setFavoriteClickHandler(this.#handleControlClick);
    popup.setCommentDeleteClickHandler(this.#handleCommentDeleteClick);
    popup.setCommentAddHandler(this.#handleAddComment);
  };

  #onEscKeyDown = (evt) => {
    if(isEscKeyPressed(evt)) {
      this.#popupComponent.element.remove();
      document.body.classList.remove('hide-overflow');
      document.removeEventListener('keydown', this.#onEscKeyDown);
    }
  };

  #onCloseButtonClick = () => {
    remove(this.#popupComponent);
    document.body.classList.remove('hide-overflow');
    document.removeEventListener('keydown', this.#onEscKeyDown);
  };

  #handleControlClick = async (controlName) => {
    const update = {...this.#filmItem, userDetails: {...this.#filmItem.userDetails, [controlName]: !this.#filmItem.userDetails[controlName]}};
    await this.#changeData(UserAction.UPDATE_FILM, UpdateType.MINOR, update);
    await this.#changeModelData(UpdateType.MINOR, update);
  };

  rerenderPopup = () => {
    console.log("RE RENDER POPUP")
    if (this.#popupComponent) {
      const popupScroll = this.#popupComponent?.element?.scrollTop ?? 0;
      remove(this.#popupComponent);
      this.#updatePopup();
      this.#popupComponent.element.scrollTo(0, popupScroll);
    }
  };

  #handleAddComment = async (update) => {
    const commentedFilm = await this.#commentModel.addComment(this.#filmItem, update);
    this.#changeData(UserAction.ADD_COMMENT, UpdateType.MINOR, commentedFilm);
    this.rerenderPopup();
  };

  #handleCommentDeleteClick = (commentId) => {
    this.#commentModel.deleteComment(commentId);
    this.rerenderPopup();
  };
}
