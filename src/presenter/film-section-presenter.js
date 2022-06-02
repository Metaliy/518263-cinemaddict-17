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
import { updateItem } from '../util';

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
  #ADDITIONAL_FILM_COUNT = 2;


  init = (mainBlock, filmsModel) => {

    this.#mainBlock = mainBlock;
    this.#filmsModel = filmsModel;
    this.#filmsList = this.#filmsModel.films;
    this.#commentList = this.#filmsModel.comments;
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

      this.#renderFilmList();

    }
    this.#additionalFilmTops(this.#filmsList);

  };

  #renderFilm = (film, container) => {
    const filmPresenter = new FilmPresenter(this.#commentList, this.#changeData);
    filmPresenter.init(film, container);
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
    this.#filmPresenter.get(film.id).init(film, this.#filmListContainer);
  };

  #additionalFilmTops = (filmsList) => {
    const mostCommentedFilms = filmsList.slice();
    const topRatedFilms = filmsList.slice();

    mostCommentedFilms.sort((a, b) => b.filmInfo.commentCount - a.filmInfo.commentCount);
    topRatedFilms.sort((a, b) => b.filmInfo.totalRating - a.filmInfo.totalRating);

    render(this.#mostCommentedFilms, this.#filmList.element, 'afterend');
    render(this.#topRatedFilms, this.#filmList.element, 'afterend');

  };

  #handleShowMoreButtonClick = () => {
    this.#renderFilms(this.#renderedFilmCount, this.#renderedFilmCount + this.#FILM_COUNT_PER_STEP, this.#filmsList, this.#filmListContainer );

    this.#renderedFilmCount += this.#FILM_COUNT_PER_STEP;

    if (this.#renderedFilmCount >= this.#filmsList.length) {
      remove(this.#showMoreFilmComponent);
    }
  };

}
