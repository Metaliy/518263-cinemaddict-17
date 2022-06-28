import {render, remove} from '../framework/render';

import ShowMoreButtonView from '../view/show-more-button-view';
import FilmsView from '../view/films-view';
import FilmsListView from '../view/film-list-view';
import EmptyFilmListView from '../view/film-list-empry-title';
import SortView from '../view/sort-view';
import FilmPresenter from './film-presenter';
import FilmsCounsView from '../view/film-count-view';
import { sortFilm, filter } from '../util';
import { FILM_COUNT_PER_STEP, SortType, UserAction, UpdateType } from '../const';

export default class FilmSectionPresenter {

  #filmContainer = new FilmsView();
  #filmList = new FilmsListView();
  #filmListContainer = this.#filmList.element.querySelector('.films-list__container');
  #showMoreFilmComponent = new ShowMoreButtonView();
  #sortComponent = new SortView();
  #userRaitingComponent = null;
  #emptyFilmsComponent = null;
  #mainBlock = null;
  #filmsModel = null;
  #commentModel = null;
  #filterModel;
  #footerElement;
  #filmsCountComponent;
  #filmPresenter = new Map();
  #topRatedFilmPresenter = new Map();
  #mostCommentedFilmPresenter = new Map();
  #renderedFilmCount = FILM_COUNT_PER_STEP;
  #currentSortType = SortType.DEFAULT;
  #sourcedFilmSection = [];
  #popupComponent = null;

  constructor(filmSectionContainer, filmModel, commentModel, filterModel, footerElement) {
    this.#mainBlock = filmSectionContainer;
    this.#filmsModel = filmModel;
    this.#commentModel = commentModel;
    this.#filterModel = filterModel;
    this.#footerElement = footerElement;
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
    this.#renderMainSection();
  };

  #renderMainSection = () => {
    this.#filmsCountComponent = new FilmsCounsView(this.films.length);
    render(this.#filmsCountComponent, this.#footerElement);
    this.#renderSort();
    render(this.#filmContainer, this.#mainBlock);
    render(this.#filmList, this.#filmContainer.element);

    const films = this.films;
    const filmsCount = films.length;

    if (this.films.length === 0) {
      this.#emptyFilmsComponent = new EmptyFilmListView();
      render(this.#emptyFilmsComponent, this.#filmList.element);
    }

    this.#renderFilms(this.films.slice(0, Math.min(filmsCount, this.#renderedFilmCount)), this.#filmListContainer, this.#filmPresenter);

    if (this.films.length > FILM_COUNT_PER_STEP) {
      render(this.#showMoreFilmComponent, this.#filmListContainer, 'afterend');
      this.#showMoreFilmComponent.setClickHandler(this.#handleShowMoreButtonClick);
    }

  };

  #clearSection = ({resetRenderedFilmCount = false, resetSortType = false} = {}) => {
    const filmCount = this.films.length;
    this.#filmPresenter.forEach((presenter) => presenter.destroy());
    this.#filmPresenter.clear();
    remove(this.#userRaitingComponent);
    remove(this.#sortComponent);
    remove(this.#showMoreFilmComponent);
    remove(this.#filmsCountComponent);

    if(this.#emptyFilmsComponent) {
      remove(this.#emptyFilmsComponent);
    }

    if(resetRenderedFilmCount) {
      this.#renderedFilmCount = FILM_COUNT_PER_STEP;
    } else {
      this.#renderedFilmCount = Math.min(filmCount, this.#renderedFilmCount);
    }

    if (resetSortType) {
      this.#currentSortType = SortType.DEFAULT;
    }
  };

  #renderSort = () => {
    render(this.#sortComponent, this.#mainBlock);
    this.#sortComponent.setSortTypeChangeHandler(this.#handleSortTypeChange);
  };

  #handleSortTypeChange = (sortType) => {
    if (this.#currentSortType === sortType) {
      return;
    }
    this.#currentSortType = sortType;
    this.#clearSection({resetRenderedTaskCount: true});
    this.#renderMainSection();
  };

  #handleViewAction = async (actionType, updateType, update) => {
    switch (actionType) {
      case UserAction.UPDATE_FILM:

        await this.#filmsModel.updateFilm(updateType, update);
        break;
      case UserAction.ADD_COMMENT:
        await this.#filmsModel.updateLocalFilm(updateType, update);
        break;
      case UserAction.DELETE_COMMENT:
        await this.#filmsModel.updateLocalFilm(updateType, update);
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
        this.#clearSection();
        this.#renderMainSection();
        break;
      case UpdateType.MAJOR:
        this.#clearSection({resetRenderedFilmCount: true, resetSortType: true});
        this.#renderMainSection();
        break;
      case UpdateType.INIT:
        this.#clearSection();
        this.#renderMainSection();
        break;
    }
  };

  #savePopup = (popup) => {
    this.#popupComponent = popup;
  };

  #renderFilm =  (film, container, map) => {
    const filmPresenter = new FilmPresenter(
      this.#commentModel,
      container,
      this.#handleViewAction,
      this.#handleModelEvent,
      this.#savePopup,
      this.#popupComponent?.filmItem?.id === film.id ? this.#popupComponent : null,
    );
    filmPresenter.init(film);
    map.set(film.id, filmPresenter);
  };

  #renderFilms = (list, container, map) => {
    list.forEach((film) => this.#renderFilm(film, container, map));
  };

  #handleShowMoreButtonClick = () => {
    const filmCount = this.films.length;
    const newRenderFilmCount = Math.min(filmCount, this.#renderedFilmCount + FILM_COUNT_PER_STEP);
    const films = this.films.slice(this.#renderedFilmCount, newRenderFilmCount);

    this.#renderFilms(films, this.#filmListContainer, this.#filmPresenter);
    this.#renderedFilmCount = newRenderFilmCount;


    if (this.#renderedFilmCount >= filmCount) {
      remove(this.#showMoreFilmComponent);
    }
  };

}
