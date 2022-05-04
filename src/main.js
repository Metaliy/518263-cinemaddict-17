import MainNavView from './view/filters-view';
import { render } from './render';
import SortView from './view/sort-view';
import UserRaitingView from './view/user-raiting-view';
import FilmSectionPresenter from './presenter/film-section-presenter';
import PopupFilmDetailsView from './view/popup-film-details-view';

const mainBlock = document.querySelector('.main');
const header = document.querySelector('.header');

const filmSectionPresenter = new FilmSectionPresenter();


render(new MainNavView(), mainBlock);
render(new SortView(), mainBlock);
render(new UserRaitingView(), header);
render(new PopupFilmDetailsView(), document.querySelector('body'), document.querySelector('.footer'));


filmSectionPresenter.init(mainBlock);
