import { createElement } from '../render';

export default class View {
  getElement() {
    if (!this.element) {
      this.element = createElement(this.getTemplate());
    }

    return this.element;
  }


  removeElement() {
    this.element = null;
  }
}
