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
import { updateItem, sortFilm } from '../util';
import { FILM_COUNT_PER_STEP, ADDITIONAL_FILM_COUNT, SortType } from '../const';

export default class FilmSectionPresenter {

  #filmContainer = new FilmsView();
  #filmList = new FilmsListView();
  #filmListContainer = this.#filmList.element.querySelector('.films-list__container');
  #showMoreFilmComponent = new ShowMoreButtonView();
  #topRatedFilms = new FilmsTopRatedView();
  #mostCommentedFilms = new FilmsMostCommentedView();
  #sortComponent = new SortView();
  #mainBlock = null;
  #filmsModel = null;
  #filmsList = null;
  #commentList = null;
  #filmPresenter = new Map();
  #renderedFilmCount = null;
  #FILM_COUNT_PER_STEP = FILM_COUNT_PER_STEP;
  #ADDITIONAL_FILM_COUNT = ADDITIONAL_FILM_COUNT;
  #currentSortType = SortType.DEFAULT;
  #sourcedFilmSection = [];

  constructor(filmSectionContainer, filmModel) {
    this.#mainBlock = filmSectionContainer;
    this.#filmsModel = filmModel;
  }


  init = () => {
    this.#filmsList = this.#filmsModel.films;
    this.#commentList = this.#filmsModel.comments;
    this.#renderedFilmCount = this.#FILM_COUNT_PER_STEP;
    this.#sourcedFilmSection = this.#filmsList.slice();

    render(new MainNavView(this.#filmsList), this.#mainBlock);
    this.#renderSort();

    render(this.#filmContainer, this.#mainBlock);
    render(this.#filmList, this.#filmContainer.element);

    if (this.#filmsList.length === 0) {
      render(new EmptyFilmListView, this.#filmList.element);
    } else {

      for (let i = 0; i < this.#filmsList.length; i++) {
        this.#filmsList[i].id = i;
      }

      this.#renderFilmList();

    }
    this.#additionalFilmTops(this.#filmsList);

  };

  #renderSort = () => {
    render(this.#sortComponent, this.#mainBlock);
    this.#sortComponent.setSortTypeChangeHandler(this.#handleSortTypeChange);
  };

  #handleSortTypeChange = (sortType) => {
    if (this.#currentSortType === sortType) {
      return;
    }
    this.#sortFilms(sortType);
    this.#clearTaskList();
    this.#renderFilmList();
  };

  #sortFilms = (sortType) => {
    switch (sortType) {
      case SortType.DATE:
        this.#filmsList.sort(sortFilm);
        break;
      case SortType.RATING:
        this.#filmsList.sort((a, b) => b.filmInfo.totalRating - a.filmInfo.totalRating);
        break;
      default:
        this.#filmsList = [...this.#sourcedFilmSection];
    }

    this.#currentSortType = sortType;
  };

  #renderFilm = (film, container) => {
    const filmPresenter = new FilmPresenter(this.#commentList, this.#changeData, container);
    filmPresenter.init(film);
    this.#filmPresenter.set(film.id, filmPresenter);
  };

  #renderFilms = (from, to, list, container) => {
    list
      .slice(from, to)
      .forEach((film) => this.#renderFilm(film, container));
  };

  #renderFilmList = () => {
    this.#renderFilms(0, Math.min(this.#filmsList.length, this.#FILM_COUNT_PER_STEP), this.#filmsList, this.#filmListContainer);

    if (this.#filmsList.length > this.#FILM_COUNT_PER_STEP) {
      render(this.#showMoreFilmComponent, this.#filmListContainer, 'afterend');
      this.#showMoreFilmComponent.setClickHandler(this.#handleShowMoreButtonClick);
    }
  };


  #changeData = (film) => {
    this.#filmsList = updateItem(this.#filmsList, film);
    this.#filmPresenter.get(film.id).init(film);
  };

  #additionalFilmTops = (filmsList) => {
    const mostCommentedFilms = filmsList;
    const topRatedFilms = filmsList;

    mostCommentedFilms.sort((a, b) => b.filmInfo.commentCount - a.filmInfo.commentCount);
    topRatedFilms.sort((a, b) => b.filmInfo.totalRating - a.filmInfo.totalRating);

    render(this.#mostCommentedFilms, this.#filmList.element, 'afterend');
    render(this.#topRatedFilms, this.#filmList.element, 'afterend');


    this.#renderFilms(0, this.#ADDITIONAL_FILM_COUNT, mostCommentedFilms, this.#mostCommentedFilms.element.querySelector('.films-list__container'));
    this.#renderFilms(0, this.#ADDITIONAL_FILM_COUNT, topRatedFilms, this.#topRatedFilms.element.querySelector('.films-list__container'));


  };

  #clearTaskList = () => {
    this.#filmPresenter.forEach((presenter) => presenter.destroy());
    this.#filmPresenter.clear();
    this.#renderedFilmCount = FILM_COUNT_PER_STEP;
    remove(this.#showMoreFilmComponent);
  };

  #handleShowMoreButtonClick = () => {
    this.#renderFilms(this.#renderedFilmCount, this.#renderedFilmCount + this.#FILM_COUNT_PER_STEP, this.#filmsList, this.#filmListContainer );

    this.#renderedFilmCount += this.#FILM_COUNT_PER_STEP;

    if (this.#renderedFilmCount >= this.#filmsList.length) {
      remove(this.#showMoreFilmComponent);
    }
  };

}
