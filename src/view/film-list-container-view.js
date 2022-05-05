import View from './view-class-preset';

const createFilmListContainerTemplate = () =>
  `<div class="films-list__container"> 
  </div>`;

export default class FilmsListContainerView extends View {

  constructor() {
    super();
  }

  getTemplate() {
    return createFilmListContainerTemplate();
  }

}
