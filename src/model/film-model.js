import { generateFilm} from '../mock/film';
import { generateComment } from '../mock/comment';


export default class FilmModel {
  #films = Array.from({length: 12}, generateFilm);
  #comments = Array.from({length: 50}, generateComment);

  get films () {
    return this.#films;
  }

  get comments () {
    return this.#comments;
  }
}
