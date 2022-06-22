import AbstractView from '../framework/view/abstract-view';

const createLoadingFilmsTemplate = () =>
  '<h2 class="films-list__title">Loading...</h2>';

export default class LoadingFilmsView extends AbstractView {

  get template() {
    return createLoadingFilmsTemplate();
  }

}
