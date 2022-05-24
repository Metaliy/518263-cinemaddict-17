import AbstractView from '../framework/view/abstract-view';

const watchlistFilmCount = (filmLists) => filmLists.filter((item) => !!item.userDetails.watchlist).length;
const historyFilmCount = (filmLists) => filmLists.filter((item) => !!item.userDetails.alreadyWatched).length;
const favoriteFilmCount = (filmLists) => filmLists.filter((item) => !!item.userDetails.favorite).length;


const createNavTemplate = (filmList) => {

  favoriteFilmCount(filmList);
  return `<nav class="main-navigation">
  <a href="#all" class="main-navigation__item main-navigation__item--active">All movies</a>
  <a href="#watchlist" class="main-navigation__item">Watchlist <span class="main-navigation__item-count">${watchlistFilmCount(filmList)}</span></a>
  <a href="#history" class="main-navigation__item">History <span class="main-navigation__item-count">${historyFilmCount(filmList)}</span></a>
 <a href="#favorites" class="main-navigation__item">Favorites <span class="main-navigation__item-count">${favoriteFilmCount(filmList)}</span></a>
</nav>`;
};

export default class MainNavView extends AbstractView {

  constructor(filmList) {
    super();
    this.filmList = filmList;
  }

  get template() {
    return createNavTemplate(this.filmList);
  }

}

