import AbstractView from '../framework/view/abstract-view';

const createFilmsMostCommentedTemplate = () =>


  `<section class="films-list films-list--extra">
  <h2 class="films-list__title">Most commented</h2>

  <div class="films-list__container">
    
  </div>
</section>`;


export default class FilmsMostCommentedView extends AbstractView {


  get template() {
    return createFilmsMostCommentedTemplate();
  }

}
