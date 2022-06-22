import AbstractView from '../framework/view/abstract-view';

const createRatingTemplate = (rank) =>
  `<section class="header__profile profile">
  <p class="profile__rating">${rank}</p>
  <img class="profile__avatar" src="images/bitmap@2x.png" alt="Avatar" width="35" height="35">
</section>`;

export default class UserRaitingView extends AbstractView {

  #userRank;

  constructor(userRank) {
    super();
    this.#userRank = userRank;
  }

  get template() {
    return createRatingTemplate(this.#userRank);
  }

}
