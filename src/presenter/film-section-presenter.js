import {render, remove} from '../framework/render';
import FilmsView from '../view/films-view';
import FilmsListView from '../view/film-list-view';
import FilmsListContainerView from '../view/film-list-container-view';
import FilmsCardView from '../view/film-card-view';
import FilmsTopRatedView from '../view/films-top-rated-view';
import FilmsMostCommentedView from '../view/films-most-commented-view';
import ShowMoreButtonView from '../view/show-more-button-view';
import PopupFilmDetailsView from '../view/popup-film-details-view';
import FilmsPopupCommentView from '../view/film-popup-comment-view';
import EmptyFilmListView from '../view/film-list-empry-title';
import {isEscKeyPressed} from '../util';

const getIdFilteredArray = (filmiD, commentsArray) => {
  const fillteredArray = commentsArray.filter((item) => item.id === filmiD);
  return fillteredArray;
};

const FILM_COUNT_PER_STEP = 5;

export default class FilmSectionPresenter {

  #filmContainer = new FilmsView();
  #filmList = new FilmsListView();
  #filmListContainer = new FilmsListContainerView();
  #showMoreFilmComponent = new ShowMoreButtonView();
  #mainBlock = null;
  #filmsModel = null;
  #filmsList = null;
  #commentList = null;
  #filteredArray = null;
  #renderedFilmCount = FILM_COUNT_PER_STEP;


  init = (mainBlock, filmsModel) => {

    this.#mainBlock = mainBlock;
    this.#filmsModel = filmsModel;
    this.#filmsList = this.#filmsModel.films;
    this.#commentList = this.#filmsModel.comments;

    render(this.#filmContainer, this.#mainBlock);
    render(this.#filmList, this.#filmContainer.element);
    render(this.#filmListContainer, this.#filmList.element);
    render(new FilmsTopRatedView(), this.#filmContainer.element);
    render(new FilmsMostCommentedView(), this.#filmContainer.element);

    if (this.#filmsList.length === 0) {
      render(new EmptyFilmListView, this.#filmListContainer.element);
    } else {

      for (let i = 0; i < this.#filmsList.length; i++) {
        this.#filmsList[i].id = i;
      }


      for (let i = 0; i < Math.min(this.#filmsList.length, FILM_COUNT_PER_STEP); i++) {
        this.#renderFilms(this.#filmsList[i], this.#commentList);
      }

      if (this.#filmsList.length > FILM_COUNT_PER_STEP) {
        render(this.#showMoreFilmComponent, this.#filmList.element);
        this.#showMoreFilmComponent.setClickHandler(this.#handleShowMoreButtonClick);
      }

    }

  };

  #handleShowMoreButtonClick = () => {
    this.#filmsList
      .slice(this.#renderedFilmCount, (this.#renderedFilmCount + FILM_COUNT_PER_STEP))
      .forEach((film) => this.#renderFilms(film, this.#commentList));

    this.#renderedFilmCount += FILM_COUNT_PER_STEP;

    if (this.#renderedFilmCount >= this.#filmsList.length) {
      remove(this.#showMoreFilmComponent);
    }
  };


  #renderFilms = (film, commentsArray) => {
    const filmCardComponent = new FilmsCardView(film);
    render(filmCardComponent, this.#filmListContainer.element);


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


    filmCardComponent.setFilmClickHandler(renderPopup);

  };

}
