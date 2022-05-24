import AbstractView from '../framework/view/abstract-view';

const createEmptyFilmListTemplate = () =>
  '<h2 class="films-list__title">There are no movies in our database</h2>';

export default class EmptyFilmListView extends AbstractView {

  get template() {
    return createEmptyFilmListTemplate();
  }

}
