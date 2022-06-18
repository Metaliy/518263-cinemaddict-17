import { generateComment } from '../mock/comment';
import Observable from '../framework/observable';


export default class CommentModel extends Observable {
  #comments = Array.from({length: 50}, generateComment);

  get comments () {
    return this.#comments;
  }

  set comments(comments) {
    this.#comments = comments;
  }

  deleteComment = (updateType, id) => {
    this.#comments = this.#comments.filter((comment) => comment.id !== id);

    this._notify(updateType, id);
  };

  addComment = (updateType, update) => {
    this.#comments.push(update);

    this._notify(updateType, update);
  };
}
