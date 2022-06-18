import {render, remove} from '../framework/render';
import ShowMoreButtonView from '../view/show-more-button-view';
import FilmsView from '../view/films-view';
import FilmsListView from '../view/film-list-view';
import FilmsTopRatedView from '../view/films-top-rated-view';
import FilmsMostCommentedView from '../view/films-most-commented-view';
import EmptyFilmListView from '../view/film-list-empry-title';
import SortView from '../view/sort-view';
import FilmPresenter from './film-presenter';
import { sortFilm, filter } from '../util';
import { FILM_COUNT_PER_STEP, SortType, UserAction, UpdateType } from '../const';

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
  #commentModel = null;
  #commentList = null;
  #filterModel;
  #filmPresenter = new Map();
  #topRatedFilmPresenter = new Map();
  #mostCommentedFilmPresenter = new Map();
  #renderedFilmCount = null;
  #FILM_COUNT_PER_STEP = FILM_COUNT_PER_STEP;
  #currentSortType = SortType.DEFAULT;
  #sourcedFilmSection = [];

  constructor(filmSectionContainer, filmModel, commentModel, filterModel) {
    this.#mainBlock = filmSectionContainer;
    this.#filmsModel = filmModel;
    this.#commentModel = commentModel;
    this.#filterModel = filterModel;
    this.#filmsModel.addObserver(this.#handleModelEvent);
    this.#filterModel.addObserver(this.#handleModelEvent);
  }

  get films() {


    const filterType = this.#filterModel.filter;
    const films = this.#filmsModel.films;
    let filteredFilms = filter[filterType](films);
    this.#sourcedFilmSection = filteredFilms.slice();

    switch (this.#currentSortType) {
      case SortType.DATE:
        filteredFilms.sort(sortFilm);
        break;
      case SortType.RATING:
        filteredFilms.sort((a, b) => b.filmInfo.totalRating - a.filmInfo.totalRating);
        break;
      default:
        filteredFilms = [...this.#sourcedFilmSection];
    }
    return filteredFilms;
  }


  init = () => {
    this.#commentList = this.#commentModel.comments;
    this.#renderedFilmCount = this.#FILM_COUNT_PER_STEP;
    this.#renderMainSection();
  };

  #renderMainSection = () => {
    this.#renderSort();

    render(this.#filmContainer, this.#mainBlock);
    render(this.#filmList, this.#filmContainer.element);

    if (this.films.length === 0) {
      render(new EmptyFilmListView, this.#filmList.element);
    } else {

      for (let i = 0; i < this.films.length; i++) {
        this.films[i].id = i;
      }

    }

    this.#renderFilmList();
    this.#additionalFilmTops(this.films);
  };

  #renderSort = () => {
    render(this.#sortComponent, this.#mainBlock);
    this.#sortComponent.setSortTypeChangeHandler(this.#handleSortTypeChange);
  };

  #handleSortTypeChange = (sortType) => {
    this.#currentSortType = sortType;
    this.#clearFilmList();
    this.#renderFilmList();
  };

  #handleViewAction = (actionType, updateType, update) => {
    switch (actionType) {
      case UserAction.UPDATE_FILM:
        this.#filmsModel.updateFilm(updateType, update);
        break;
      case UserAction.ADD_COMMENT:
        this.#filmsModel.updateFilm(updateType, update);
        break;
      case UserAction.DELETE_COMMENT:
        this.#commentModel.deleteComment(updateType, update);
        break;
    }

  };

  #handleModelEvent = (updateType, data) => {
    switch (updateType) {

      case UpdateType.PATCH:

        if (this.#topRatedFilmPresenter.get(data.id)) {
          this.#topRatedFilmPresenter.get(data.id).init(data);
        }

        if (this.#mostCommentedFilmPresenter.get(data.id)) {
          this.#mostCommentedFilmPresenter.get(data.id).init(data);
        }

        if (this.#filmPresenter.get(data.id)) {
          this.#filmPresenter.get(data.id).init(data);
        }
        break;
      case UpdateType.MINOR:
        this.#clearFilmList();
        this.#renderFilmList();
        break;
      case UpdateType.MAJOR:
        this.#clearFilmList();
        this.#renderFilmList();
        break;
    }

  };

  #renderFilm = (film, container, map) => {
    const filmPresenter = new FilmPresenter(this.#commentList, this.#filmsModel, container, this.#handleViewAction, this.#handleModelEvent);
    filmPresenter.init(film);
    map.set(film.id, filmPresenter);
  };

  #renderFilms = (list, container, map) => {
    list.forEach((film) => this.#renderFilm(film, container, map));
  };

  #renderFilmList = () => {
    const filmsCount = this.films.length;
    const films =  this.films.slice(0, Math.min(filmsCount, this.#FILM_COUNT_PER_STEP));

    this.#renderFilms(films, this.#filmListContainer, this.#filmPresenter);

    if (this.films.length > this.#FILM_COUNT_PER_STEP) {
      render(this.#showMoreFilmComponent, this.#filmListContainer, 'afterend');
      this.#showMoreFilmComponent.setClickHandler(this.#handleShowMoreButtonClick);
    }
  };

  #additionalFilmTops = () => {
    render(this.#mostCommentedFilms, this.#filmList.element, 'afterend');
    render(this.#topRatedFilms, this.#filmList.element, 'afterend');

    this.#renderFilms(this.#filmsModel.mostCommentedFilms, this.#mostCommentedFilms.element.querySelector('.films-list__container'), this.#topRatedFilmPresenter);
    this.#renderFilms(this.#filmsModel.topRatedFilms, this.#topRatedFilms.element.querySelector('.films-list__container'), this.#mostCommentedFilmPresenter);


  };


  #clearFilmList = () => {
    this.#filmPresenter.forEach((presenter) => presenter.destroy());
    this.#filmPresenter.clear();
    this.#renderedFilmCount = FILM_COUNT_PER_STEP;
    remove(this.#showMoreFilmComponent);
  };

  #handleShowMoreButtonClick = () => {
    const filmCount = this.films.length;
    const newRenderFilmCount = Math.min(filmCount, this.#renderedFilmCount + this.#FILM_COUNT_PER_STEP);
    const films = this.films.slice(this.#renderedFilmCount, newRenderFilmCount);

    this.#renderFilms(films, this.#filmListContainer, this.#filmPresenter);
    this.#renderedFilmCount = newRenderFilmCount;


    if (this.#renderedFilmCount >= filmCount) {
      remove(this.#showMoreFilmComponent);
    }
  };

}
