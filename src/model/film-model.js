import { generateFilm} from '../mock/film';
import { generateComment } from '../mock/comment';
import Observable from '../framework/observable';


export default class FilmModel extends Observable {
  #films = Array.from({length: 12}, generateFilm);
  #comments = Array.from({length: 50}, generateComment);

  get films () {
    return this.#films;
  }

  get comments () {
    return this.#comments;
  }
}
