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

  filmContainer = new FilmsView();
  filmList = new FilmsListView();
  filmListContainer = new FilmsListContainerView();

  init = (mainBlock, filmsModel) => {

    this.mainBlock = mainBlock;
    this.filmsModel = filmsModel;
    this.filmsList = [...this.filmsModel.getFilm()];
    this.commentList = [...this.filmsModel.getComment()];

    render(this.filmContainer, this.mainBlock);
    render(this.filmList, this.filmContainer.getElement());
    render(this.filmListContainer, this.filmList.getElement());
    render(new ShowMoreButtonView(), this.filmContainer.getElement());

    render(new FilmsTopRatedView(), this.filmContainer.getElement());
    render(new FilmsMostCommentedView(), this.filmContainer.getElement());

    for (let i = 0; i <this.filmsList.length; i++) {
      render(new FilmsCardView(this.filmsList[i]), this.filmListContainer.getElement());
      this.filmsList[i].id = i;
    }

    this.filteredArray = getIdFilteredArray(this.filmsList[0].id, this.commentList);

    render(new PopupFilmDetailsView(this.filmsList[0]), document.querySelector('body'));

    for (let i = 0; i < this.filteredArray.length; i++) {
      render(new FilmsPopupCommentView(this.filteredArray[i]), document.querySelector('.film-details__comments-list'));
    }
  };
}
