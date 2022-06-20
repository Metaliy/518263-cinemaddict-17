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

}
