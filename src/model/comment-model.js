import Observable from '../framework/observable';


export default class CommentModel extends Observable {
  #comments = [];
  #apiService = null;

  constructor(apiService) {
    super();
    this.#apiService = apiService;
  }


  getCommentsById = async (filmId) => {
    try {
      const comments = await this.#apiService.getCommets(filmId);
      this.#comments = comments;
    }
    catch (err) {
      this.#comments = [];
    }
    return this.#comments;
  };

  get comments() {
    return this.#comments;
  }

  addComment = async (filmId, update) => {
    const updatedData = await this.#apiService.addComment(filmId, update);
    this.#comments = updatedData.comments;
    return updatedData.film;
  };

  deleteComment = async (id) => {
    await this.#apiService.deleteComment(id);
    this.#comments = this.#comments.filter((comment) => comment.id !== id);
  };

}
