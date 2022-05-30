import {render, remove} from '../framework/render';
import ShowMoreButtonView from '../view/show-more-button-view';
import FilmsView from '../view/films-view';
import MainNavView from '../view/main-nav-view';
import FilmsListView from '../view/film-list-view';
import FilmsTopRatedView from '../view/films-top-rated-view';
import FilmsMostCommentedView from '../view/films-most-commented-view';
import EmptyFilmListView from '../view/film-list-empry-title';
import SortView from '../view/sort-view';
import FilmPresenter from './film-presenter';

export default class FilmSectionPresenter {

  #filmContainer = new FilmsView();
  #filmList = new FilmsListView();
  #filmListContainer = this.#filmList.element.querySelector('.films-list__container');
  #showMoreFilmComponent = new ShowMoreButtonView();
  #topRatedFilms = new FilmsTopRatedView();
  #mostCommentedFilms = new FilmsMostCommentedView();
  #mainBlock = null;
  #filmsModel = null;
  #filmsList = null;
  #commentList = null;
  #filmPresenter = new Map();
  #renderedFilmCount = null;
  #FILM_COUNT_PER_STEP = 5;


  init = (mainBlock, filmsModel) => {

    this.#mainBlock = mainBlock;
    this.#filmsModel = filmsModel;
    this.#filmsList = this.#filmsModel.films;
    this.#commentList = this.#filmsModel.comments;
    this.#filmPresenter = new FilmPresenter(this.#commentList, this.#changeData);
    this.#renderedFilmCount = this.#FILM_COUNT_PER_STEP;


    render(new MainNavView(this.#filmsList), mainBlock);
    render(new SortView(), mainBlock);

    render(this.#filmContainer, this.#mainBlock);
    render(this.#filmList, this.#filmContainer.element);

    if (this.#filmsList.length === 0) {
      render(new EmptyFilmListView, this.#filmList.element);
    } else {

      for (let i = 0; i < this.#filmsList.length; i++) {
        this.#filmsList[i].id = i;
      }

      this.#filmPresenter.init(this.#filmsList, this.#filmListContainer);

      if (this.#filmsList.length > this.#FILM_COUNT_PER_STEP) {
        render(this.#showMoreFilmComponent, this.#filmListContainer, 'afterend');
        this.#showMoreFilmComponent.setClickHandler(this.#handleShowMoreButtonClick);
      }

    }
    this.#additionalFilmTops(this.#filmsList);

  };

  #changeData = (film) => {
    const updatedItem = this.#filmList.slice(film.id - 1, film.id);
    this.#filmPresenter.init(updatedItem);
  };

  #additionalFilmTops = (filmsList) => {
    const mostCommentedFilms = filmsList.slice();
    const topRatedFilms = filmsList.slice();

    mostCommentedFilms.sort((a, b) => b.filmInfo.commentCount - a.filmInfo.commentCount);
    topRatedFilms.sort((a, b) => b.filmInfo.totalRating - a.filmInfo.totalRating);

    render(this.#mostCommentedFilms, this.#filmList.element, 'afterend');
    render(this.#topRatedFilms, this.#filmList.element, 'afterend');

    this.#filmPresenter.init(mostCommentedFilms.slice(0, 2), this.#mostCommentedFilms.element.querySelector('.films-list__container'));
    this.#filmPresenter.init(topRatedFilms.slice(0, 2), this.#topRatedFilms.element.querySelector('.films-list__container'));
  };

  #handleShowMoreButtonClick = () => {
    this.#filmPresenter.init(this.#filmsList.slice(this.#renderedFilmCount, (this.#renderedFilmCount + this.#FILM_COUNT_PER_STEP)), this.#filmListContainer);

    this.#renderedFilmCount += this.#FILM_COUNT_PER_STEP;

    if (this.#renderedFilmCount >= this.#filmsList.length) {
      remove(this.#showMoreFilmComponent);
    }
  };

}
