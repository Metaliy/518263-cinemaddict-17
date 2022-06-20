import {render} from './framework/render';
import UserRaitingView from './view/user-raiting-view';
import FilmSectionPresenter from './presenter/film-section-presenter';
import FilmModel from './model/film-model';
import CommentModel from './model/comment-model';
import FilterModel from './model/filter-model';
import FilterPresenter from './presenter/filter-presenter';
import FilmsApiService from './api-service';

const AUTHORIZATION = 'Basic SJ2jk3i20932hnbu';
const END_POINT = 'https://17.ecmascript.pages.academy/cinemaddict/';

const api = new FilmsApiService(END_POINT, AUTHORIZATION);

const filmModel = new FilmModel(api);

const commentModel = new CommentModel(api);
const filterModel = new FilterModel();
const mainBlock = document.querySelector('.main');
const header = document.querySelector('.header');

const filmSectionPresenter = new FilmSectionPresenter(mainBlock, filmModel, commentModel, filterModel);
const filterPresenter = new FilterPresenter(mainBlock, filterModel, filmModel);


render(new UserRaitingView(), header);

filterPresenter.init();
filmSectionPresenter.init();
filmModel.init();
