import UserRaitingView from '../view/user-raiting-view';
import { render, remove } from '../framework/render.js';


export default class ProfilePresenter {
  #mainHeader = document.querySelector('.header');
  #filmModel;
  #userRaitingComponent;
  #watchedFilmsCount;
  #userRank;

  constructor(container, filmModel) {
    this.#mainHeader = container;
    this.#filmModel = filmModel;
  }

  init() {
    if(this.#userRaitingComponent) {
      remove(this.#userRaitingComponent);
    }
    this.#watchedFilmsCount = this.#getWatchedFilmsCount(this.#filmModel.films);
    if (this.#watchedFilmsCount > 0) {
      this.#userRank = this.#getUserRank();
      this.#userRaitingComponent = new UserRaitingView(this.#userRank);
      render(this.#userRaitingComponent, this.#mainHeader);
    }
    this.#filmModel.addObserver(this.#handleModelEvent);

  }

  #getWatchedFilmsCount = (films) => films.filter((film) => film.userDetails.alreadyWatched).length;

  #getUserRank = () => {
    let userRank = '';
    if (this.#watchedFilmsCount >= 1 && this.#watchedFilmsCount <= 10){
      userRank = 'Novice';
    }
    if (this.#watchedFilmsCount >= 11 && this.#watchedFilmsCount <= 20){
      userRank = 'Fan';
    }
    if (this.#watchedFilmsCount >= 21){
      userRank = 'Movie Buff';
    }
    return userRank;
  };

  #handleModelEvent = () => {
    this.init();
  };

}
