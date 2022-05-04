import { render } from '../render';
import FilmsView from '../view/films-view';
import FilmsListView from '../view/film-list-view';
import FilmsListContainerView from '../view/film-list-container-view';
import FilmsCardView from '../view/film-card-view';
import FilmsTopRatedView from '../view/films-top-rated-view';
import FilmsMostCommentedView from '../view/films-most-commented-view';
import ShowMoreButtonView from '../view/show-more-button-view';

const CARD_COUNT = 5;


export default class FilmSectionPresenter {

  filmContainer = new FilmsView();
  filmList = new FilmsListView();
  filmListContainer = new FilmsListContainerView();

  init = (mainBlock) => {

    this.mainBlock = mainBlock;

    render(this.filmContainer, this.mainBlock);
    render(this.filmList, this.filmContainer.getElement());
    render(this.filmListContainer, this.filmList.getElement());
    render(new ShowMoreButtonView(), this.filmContainer.getElement());

    render(new FilmsTopRatedView(), this.filmContainer.getElement());
    render(new FilmsMostCommentedView(), this.filmContainer.getElement());

    for (let i = 0; i <CARD_COUNT; i++) {
      render(new FilmsCardView(), this.filmListContainer.getElement());
    }


  };
}
