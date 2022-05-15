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
      render(new FilmsCardView(this.#filmsList[i]), this.#filmListContainer.element);
      this.#filmsList[i].id = i;
    }

    this.filteredArray = getIdFilteredArray(this.#filmsList[0].id, this.#commentList);

  };

  #renderPopup = (film) => {
    render(new PopupFilmDetailsView(film), document.querySelector('body'));

    for (let i = 0; i < this.filteredArray.length; i++) {
      render(new FilmsPopupCommentView(this.filteredArray[i]), document.querySelector('.film-details__comments-list'));
    }
  };
}
