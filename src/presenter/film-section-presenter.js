import { render } from '../render';
import FilmsView from '../view/films-view';
import FilmsListView from '../view/film-list-view';
import FilmsListContainerView from '../view/film-list-container-view';
import FilmsCardView from '../view/film-card-view';
import FilmsTopRatedView from '../view/films-top-rated-view';
import FilmsMostCommentedView from '../view/films-most-commented-view';
import ShowMoreButtonView from '../view/show-more-button-view';
import PopupFilmDetailsView from '../view/popup-film-details-view';
import FilmsPopupCommentView from '../view/film-popup-comment-view';
import {escKeyPressed} from '../util';

const getIdFilteredArray = (filmiD, commentsArray) => {
  const fillteredArray = commentsArray.filter((item) => item.id === filmiD);
  return fillteredArray;
};

export default class FilmSectionPresenter {

  #filmContainer = new FilmsView();
  #filmList = new FilmsListView();
  #filmListContainer = new FilmsListContainerView();
  #mainBlock = null;
  #filmsModel = null;
  #filmsList = null;
  #commentList = null;
  #filteredArray = null;
  #commentContainer = null;

  init = (mainBlock, filmsModel) => {

    this.#mainBlock = mainBlock;
    this.#filmsModel = filmsModel;
    this.#filmsList = this.#filmsModel.films;
    this.#commentList = this.#filmsModel.comments;

    render(this.#filmContainer, this.#mainBlock);
    render(this.#filmList, this.#filmContainer.element);
    render(this.#filmListContainer, this.#filmList.element);
    render(new ShowMoreButtonView(), this.#filmContainer.element);

    render(new FilmsTopRatedView(), this.#filmContainer.element);
    render(new FilmsMostCommentedView(), this.#filmContainer.element);

    for (let i = 0; i <this.#filmsList.length; i++) {
      this.#filmsList[i].id = i;
      this.#filteredArray = getIdFilteredArray(this.#filmsList[i].id, this.#commentList);
      this.#renderFilms(this.#filmsList[i], this.#filteredArray);
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
        if(escKeyPressed(evt)) {
          popupComponent.element.remove();
          document.body.classList.remove('hide-overflow');
          document.removeEventListener('keydown', onEscKeyDown);
        }
      };

      const onCloseButtonClick = () => {
        popupComponent.element.remove();
        document.body.classList.remove('hide-overflow');
        document.removeEventListener('keydown', onEscKeyDown);
      };

      for (let i = 0; i < commentsArray.length; i++) {
        render( new FilmsPopupCommentView (commentsArray[i]), popupComponent.element.querySelector('.film-details__comments-list'));
      }

      popupComponent.element.querySelector('.film-details__close-btn').addEventListener('click', onCloseButtonClick);
      document.addEventListener('keydown', onEscKeyDown);
    };


    filmCardComponent.element.querySelector('.film-card__link').addEventListener('click', renderPopup);

  };

}
