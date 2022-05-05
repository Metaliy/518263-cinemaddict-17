import View from './view-class-preset';

const createFilmsTemplate = () =>
  `<section class="films">
    
    </section>`;

export default class FilmsView extends View {

  constructor() {
    super();
  }

  getTemplate() {
    return createFilmsTemplate();
  }


}
