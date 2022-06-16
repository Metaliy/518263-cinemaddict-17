import { generateComment } from '../mock/comment';
import Observable from '../framework/observable';


export default class FilmModel extends Observable {
  #comments = Array.from({length: 50}, generateComment);

  get comments () {
    return this.#comments;
  }
}
