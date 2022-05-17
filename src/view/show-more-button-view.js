import View from './view-class-preset';

const createShowMoreButtonTemplate = () =>
  `<button class="films-list__show-more">Show more
  </button>`;

export default class ShowMoreButtonView extends View {

  constructor() {
    super();
  }

  get template() {
    return createShowMoreButtonTemplate();
  }

}
