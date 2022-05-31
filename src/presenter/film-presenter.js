
import FilmsCardView from '../view/film-card-view';
import PopupFilmDetailsView from '../view/popup-film-details-view';
import FilmsPopupCommentView from '../view/film-popup-comment-view';
import {render, remove} from '../framework/render';
import {isEscKeyPressed} from '../util';

const getIdFilteredArray = (filmiD, commentsArray) => {
  const fillteredArray = commentsArray.filter((item) => item.id === filmiD);
  return fillteredArray;
};


export default class FilmPresenter {

  #FILM_COUNT_PER_STEP = 5;
  #commentList;
  #filteredArray;
  #changeData;
  #film;

  constructor(commentList, changeData) {
    this.#commentList = commentList;
    this.#changeData = changeData;
  }

  init = (filmList, containerBlock) => {

    this.#renderFilms(filmList, this.#commentList, containerBlock);

  };


  #renderFilms = (film, commentsArray, parentContainer) => {
    const filmCardComponent = new FilmsCardView(film);
    render(filmCardComponent, parentContainer);


    const renderPopup = () => {

      if(document.querySelector('.film-details')) {
        document.querySelector('.film-details').remove();
      }

      document.body.classList.add('hide-overflow');

      const popupComponent = new PopupFilmDetailsView(film);
      render(popupComponent, document.querySelector('body'));

      const onEscKeyDown = (evt) => {
        if(isEscKeyPressed(evt)) {
          remove(popupComponent);
          document.body.classList.remove('hide-overflow');
          document.removeEventListener('keydown', onEscKeyDown);
        }
      };

      const onCloseButtonClick = () => {
        remove(popupComponent);
        document.body.classList.remove('hide-overflow');
        document.removeEventListener('keydown', onEscKeyDown);
      };

      this.#filteredArray = getIdFilteredArray(film.id, commentsArray);

      for (let i = 0; i < this.#filteredArray.length; i++) {
        render( new FilmsPopupCommentView (this.#filteredArray[i]), popupComponent.element.querySelector('.film-details__comments-list'));
      }

      popupComponent.setCloseButtonClickHandler(onCloseButtonClick);
      document.addEventListener('keydown', onEscKeyDown);
    };

    const handleWatchListClick  = () => {
      this.#changeData(film);
    };


    filmCardComponent.setFilmClickHandler(renderPopup);
    filmCardComponent.setWatchlistClickHandler(handleWatchListClick);
  };

}
