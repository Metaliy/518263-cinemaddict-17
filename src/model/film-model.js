import { generateFilm} from '../mock/film';
import Observable from '../framework/observable';
import { ADDITIONAL_FILM_COUNT } from '../const';


export default class FilmModel extends Observable {
  #films = Array.from({length: 12}, generateFilm);
  #topRatedFilms;
  #mostCommentedFilms;

  get films () {
    return this.#films;
  }

  set films (films) {
    this.#films = films;
  }

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

  updateFilm = (updateType, update) => {
    const index = this.#films.findIndex((film) => film.id === update.id);
    if (index === -1) {
      throw new Error('Can\'t update unexisting task');
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

}
