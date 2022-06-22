import AbstractView from '../framework/view/abstract-view';

const createFilmsCounsTemplate = (filmsCount) =>
  `<p>${filmsCount} movies inside</p>`;

export default class FilmsCounsView extends AbstractView {

  #filmsCount;

  constructor(filmsCount) {
    super();
    this.#filmsCount = filmsCount;
  }

  get template() {
    return createFilmsCounsTemplate(this.#filmsCount);
  }


}
