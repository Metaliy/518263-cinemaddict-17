import Observable from '../framework/observable';
import { ADDITIONAL_FILM_COUNT } from '../const';
import {UpdateType} from '../const.js';


export default class FilmModel extends Observable {
  #topRatedFilms;
  #mostCommentedFilms;
  #apiService;
  #films = [];

  constructor(apiService) {
    super();
    this.#apiService = apiService;
  }

  get films () {
    return this.#films;
  }

  init = async () => {
    try {
      const films = await this.#apiService.films;
      this.#films = films.map(this.#adaptToClient);
    }
    catch (err) {
      this.#films = [];
    }
    this._notify(UpdateType.INIT);
  };


  get topRatedFilms () {
    if (!this.#topRatedFilms) {
      this.#topRatedFilms = [...this.films]
        .sort((a, b) => b.filmInfo.totalRating - a.filmInfo.totalRating)
        .slice(0, Math.min(this.films.length, ADDITIONAL_FILM_COUNT));
    }

    return this.#topRatedFilms;
  }

  get mostCommentedFilms () {
    if (!this.#mostCommentedFilms) {
      this.#mostCommentedFilms = [...this.films]
        .sort((a, b) => b.filmInfo.commentCount - a.filmInfo.commentCount)
        .slice(0, Math.min(this.films.length, ADDITIONAL_FILM_COUNT));
    }

    return this.#mostCommentedFilms;
  }

  updateFilm = async (updateType, update) => {
    const index = this.#checkFilmExisting(update);

    const response = await this.#apiService.updateFilm(update);
    const updatedFilm = this.#adaptToClient(response);
    this.#setLocalFilmAndNotify(index, updateType, updatedFilm);

  };

  updateLocalFilm = async (updateType, update) => {
    const index = this.#checkFilmExisting(update);
    this.#setLocalFilmAndNotify(index, updateType, update);
  };

  #checkFilmExisting = (update) => {
    const index = this.#films.findIndex((film) => film.id === update.id);
    if (index === -1) {
      throw new Error('Film not found');
    }
    return index;
  };

  #setLocalFilmAndNotify = (index, updateType, update) => {
    if (update.user_details) {
      update = this.#adaptToClient(update);
    }

    this.#films = [
      ...this.#films.slice(0, index),
      update,
      ...this.#films.slice(index + 1),
    ];


    this.#mostCommentedFilms = null;
    this.#topRatedFilms = null;

    this._notify(updateType, update);
  };

  #adaptToClient = (film) => {
    const adaptedFilm = { ...film,
      filmInfo: {...film.film_info,
        ageRating: film.film_info.age_rating,
        alternativeTitle: film.film_info.alternative_title,
        totalRating: film.film_info.total_rating
      },
      userDetails: {
        ...film.user_details,
        alreadyWatched: film.user_details.already_watched,
        watchingDate: film.user_details.watching_date
      }
    };

    delete adaptedFilm['film_info'];
    delete adaptedFilm.filmInfo.age_rating;
    delete adaptedFilm.filmInfo.alternative_title;
    delete adaptedFilm.filmInfo.total_rating;
    delete adaptedFilm['user_details'];
    delete adaptedFilm.userDetails.already_watched;
    delete adaptedFilm.userDetails.watching_date;

    return adaptedFilm;

  };

}
