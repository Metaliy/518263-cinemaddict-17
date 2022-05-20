import View from './view-class-preset';

const createEmptyFilmListTemplate = () =>
  '<h2 class="films-list__title">There are no movies in our database</h2>';

export default class EmptyFilmListView extends View {

  constructor() {
    super();
  }

  get template() {
    return createEmptyFilmListTemplate();
  }

}
