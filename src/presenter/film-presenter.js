
import FilmsCardView from '../view/film-card-view';
import PopupFilmDetailsView from '../view/popup-film-details-view';
import {render, remove, replace} from '../framework/render';
import {isEscKeyPressed} from '../util';
import { UserAction, UpdateType } from '../const';

const Mode = {
  DEFAULT: 'DEFAULT',
  OPENED: 'OPENED',
};

export default class FilmPresenter {

  #commentModel;
  filteredArray;
  #changeData;
  #filmCardComponent;
  #popupComponent;
  #filmItem;
  #containerBlock;
  #comments;
  #mode = Mode.DEFAULT;
  #prevFilmCardComponent;
  #prevPopupComponent;

  constructor(commentModel, containerBlock, changeData) {
    this.#commentModel = commentModel;
    this.#changeData = changeData;
    this.#containerBlock = containerBlock;

  }

  init = (film) => {
    this.#filmItem = film;

    this.#prevFilmCardComponent = this.#filmCardComponent;
    this.#prevPopupComponent = this.#popupComponent;
    this.#filmCardComponent = new FilmsCardView(this.#filmItem);
    this.#filmCardComponent.setFilmClickHandler(this.#onCardClick);
    this.#filmCardComponent.setWatchlistClickHandler(this.#handleControlClick);
    this.#filmCardComponent.setAlreadyWatchedClickHandler(this.#handleControlClick);
    this.#filmCardComponent.setFavoriteClickHandler(this.#handleControlClick);

    if(!this.#prevFilmCardComponent && !this.#prevPopupComponent) {
      return render(this.#filmCardComponent, this.#containerBlock);
    }

    //   if(this.#containerBlock.contains(this.#prevFilmCardComponent.element)) {
    //     replace(this.#filmCardComponent, this.#prevFilmCardComponent);
    //     remove(this.#prevFilmCardComponent);
    //   }

  };

  destroy = () => {
    remove(this.#filmCardComponent);
  };


  #onCardClick = () => {
    if(document.querySelector('.film-details')) {
      document.querySelector('.film-details').remove();
    }
    this.#RRRenderPopup();
  };

  #RRRenderPopup =  () => {
    this.#popupComponent = new PopupFilmDetailsView(this.#filmItem, []);
    render(this.#popupComponent, document.querySelector('body'));
    this.#mode = Mode.OPENED;
    document.addEventListener('keydown', this.#onEscKeyDown);
    this.#updatePopup();

  };

  #updatePopup = async () => {
    const commentsArray = await this.#commentModel.getCommentsById(this.#filmItem.id);
    this.#prevPopupComponent = this.#popupComponent;
    this.#replacePopup(commentsArray);
  };

  #replacePopup = (comments) => {
    const popupScroll = this.#prevPopupComponent.element.scrollTop;
    this.#popupComponent = new PopupFilmDetailsView(this.#filmItem, comments);
    this.#setPopupHandlers();
    replace(this.#popupComponent, this.#prevPopupComponent);
    this.#popupComponent.element.scrollTop = popupScroll;
    remove(this.#prevPopupComponent);
  };

  #setPopupHandlers = () => {
    this.#popupComponent.setWatchlistClickHandler(this.#handleControlClick);
    this.#popupComponent.setAlreadyWatchedClickHandler(this.#handleControlClick);
    this.#popupComponent.setFavoriteClickHandler(this.#handleControlClick);
    this.#popupComponent.setCommentDeleteClickHandler(this.#handleCommentDeleteClick);
  };

  isOpen = () => this.#mode === Mode.OPENED;


  #onEscKeyDown = (evt) => {
    if(isEscKeyPressed(evt)) {
      this.#mode = Mode.DEFAULT;
      this.#popupComponent.element.remove();
      document.body.classList.remove('hide-overflow');
      document.removeEventListener('keydown', this.#onEscKeyDown);
    }
  };

  #handleControlClick = async (controlName) => {
    await this.#changeData(UserAction.UPDATE_FILM, UpdateType.MINOR, {...this.#filmItem, userDetails: {...this.#filmItem.userDetails, [controlName]: !this.#filmItem.userDetails[controlName]}});
    if(this.#popupComponent) {
      remove(this.#popupComponent);
      this.#RRRenderPopup();
    }
  };

  #handleCommentDeleteClick = (commentId) => {
    this.#commentModel.deleteComment(
      UpdateType.MINOR,
      commentId
    );

  };
}
