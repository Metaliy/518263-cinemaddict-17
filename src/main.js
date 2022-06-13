import {render} from './framework/render';
import UserRaitingView from './view/user-raiting-view';
import FilmSectionPresenter from './presenter/film-section-presenter';
import FilmModel from './model/film-model';

const filmModel = new FilmModel();

const mainBlock = document.querySelector('.main');
const header = document.querySelector('.header');

const filmSectionPresenter = new FilmSectionPresenter(mainBlock, filmModel);


render(new UserRaitingView(), header);


filmSectionPresenter.init(mainBlock, filmModel);
