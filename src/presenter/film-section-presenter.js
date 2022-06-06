import {render, remove, replace} from '../framework/render';
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
  #topRatedFilmPresenter = new Map();
  #mostCommentedFilmPresenter = new Map();
  #renderedFilmCount = null;
  #FILM_COUNT_PER_STEP = FILM_COUNT_PER_STEP;
  #ADDITIONAL_FILM_COUNT = ADDITIONAL_FILM_COUNT;
  #currentSortType = SortType.DEFAULT;
  #sourcedFilmSection = [];
  #mainNavView = null;

  constructor(filmSectionContainer, filmModel) {
    this.#mainBlock = filmSectionContainer;
    this.#filmsModel = filmModel;
  }

  updateMainNav = () => {
    const mainNav = new MainNavView(this.#filmsList);
    replace(mainNav, this.#mainNavView);
    this.#mainNavView = mainNav;
  };


  init = () => {
    this.#filmsList = this.#filmsModel.films;
    this.#commentList = this.#filmsModel.comments;
    this.#renderedFilmCount = this.#FILM_COUNT_PER_STEP;
    this.#sourcedFilmSection = this.#filmsList.slice();
    this.#mainNavView = new MainNavView(this.#filmsList);
    render(this.#mainNavView, this.#mainBlock);
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

  #renderFilm = (film, container, map) => {
    const filmPresenter = new FilmPresenter(this.#commentList, this.#changeData, container, this.updateMainNav);
    filmPresenter.init(film);
    map.set(film.id, filmPresenter);
  };

  #renderFilms = (from, to, list, container, map) => {
    list
      .slice(from, to)
      .forEach((film) => this.#renderFilm(film, container, map));
  };

  #renderFilmList = () => {
    this.#renderFilms(0, Math.min(this.#filmsList.length, this.#FILM_COUNT_PER_STEP), this.#filmsList, this.#filmListContainer, this.#filmPresenter);

    if (this.#filmsList.length > this.#FILM_COUNT_PER_STEP) {
      render(this.#showMoreFilmComponent, this.#filmListContainer, 'afterend');
      this.#showMoreFilmComponent.setClickHandler(this.#handleShowMoreButtonClick);
    }
  };


  #changeData = (film) => {
    this.#filmsList = updateItem(this.#filmsList, film);


    try {
      this.#topRatedFilmPresenter.get(film.id).init(film);
    } finally {
      try {
        this.#mostCommentedFilmPresenter.get(film.id).init(film);
      }finally {
        this.#filmPresenter.get(film.id).init(film);
      }
    }
  };

  #additionalFilmTops = (filmsList) => {
    render(this.#mostCommentedFilms, this.#filmList.element, 'afterend');
    render(this.#topRatedFilms, this.#filmList.element, 'afterend');

    const mostCommentedFilms = [...filmsList.sort((a, b) => b.filmInfo.commentCount - a.filmInfo.commentCount)];
    const topRatedFilms = [...filmsList.sort((a, b) => b.filmInfo.totalRating - a.filmInfo.totalRating)];

    this.#renderFilms(0, this.#ADDITIONAL_FILM_COUNT, mostCommentedFilms, this.#mostCommentedFilms.element.querySelector('.films-list__container'), this.#topRatedFilmPresenter);
    this.#renderFilms(0, this.#ADDITIONAL_FILM_COUNT, topRatedFilms, this.#topRatedFilms.element.querySelector('.films-list__container'), this.#mostCommentedFilmPresenter);


  };


  #clearTaskList = () => {
    this.#filmPresenter.forEach((presenter) => presenter.destroy());
    this.#filmPresenter.clear();
    this.#renderedFilmCount = FILM_COUNT_PER_STEP;
    remove(this.#showMoreFilmComponent);
  };

  #handleShowMoreButtonClick = () => {
    this.#renderFilms(this.#renderedFilmCount, this.#renderedFilmCount + this.#FILM_COUNT_PER_STEP, this.#filmsList, this.#filmListContainer, this.#filmPresenter);

    this.#renderedFilmCount += this.#FILM_COUNT_PER_STEP;

    if (this.#renderedFilmCount >= this.#filmsList.length) {
      remove(this.#showMoreFilmComponent);
    }
  };

}
