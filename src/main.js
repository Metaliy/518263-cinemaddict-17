import {render} from './framework/render';
import UserRaitingView from './view/user-raiting-view';
import FilmSectionPresenter from './presenter/film-section-presenter';
import FilmModel from './model/film-model';
import CommentModel from './model/comment-model';
import FilterModel from './model/filter-model';
import FilterPresenter from './presenter/filter-presenter';

const filmModel = new FilmModel();

const commentModel = new CommentModel();
const filterModel = new FilterModel();
const mainBlock = document.querySelector('.main');
const header = document.querySelector('.header');

const filmSectionPresenter = new FilmSectionPresenter(mainBlock, filmModel, commentModel, filterModel);
const filterPresenter = new FilterPresenter(mainBlock, filterModel, filmModel);


render(new UserRaitingView(), header);
filterPresenter.init();
filmSectionPresenter.init(mainBlock, filmModel);

