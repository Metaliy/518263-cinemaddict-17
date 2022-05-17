import { createElement } from '../render';

export default class View {
  #element = null;

  get element() {
    if (!this.#element) {
      this.#element = createElement(this.template);
    }

    return this.#element;
  }


  removeElement() {
    this.#element = null;
  }
}
