import AbstractView from '../framework/view/abstract-view';


const createNavTemplate = (watchlistCount, historyCount, favoritesCount) =>  `<nav class="main-navigation">
  <a href="#all" class="main-navigation__item main-navigation__item--active">All movies</a>
  <a href="#watchlist" class="main-navigation__item">Watchlist <span class="main-navigation__item-count">${watchlistCount}</span></a>
  <a href="#history" class="main-navigation__item">History <span class="main-navigation__item-count">${historyCount}</span></a>
 <a href="#favorites" class="main-navigation__item">Favorites <span class="main-navigation__item-count">${favoritesCount}</span></a>
</nav>`;

export default class MainNavView extends AbstractView {

  #watchlistCount;
  #historyCount;
  #favoritesCount;

  constructor(filmList) {
    super();
    this.filmList = filmList;

    let watchListCounter = 0;
    let historyCounter = 0;
    let favoritesCounter = 0;

    for (let i = 0; i < this.filmList.length; i++) {
      const movie = this.filmList[i];
      if (movie.userDetails.watchlist) {
        watchListCounter++;
      }
      if (movie.userDetails.alreadyWatched) {
        historyCounter++;
      }
      if (movie.userDetails.favorite) {
        favoritesCounter++;
      }
    }

    this.#watchlistCount = watchListCounter;
    this.#historyCount = historyCounter;
    this.#favoritesCount = favoritesCounter;
  }

  get template() {
    return createNavTemplate(this.#watchlistCount, this.#historyCount, this.#favoritesCount);
  }

}

