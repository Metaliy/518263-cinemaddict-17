import FilmSectionPresenter from './presenter/film-section-presenter';
import FilmModel from './model/film-model';
import CommentModel from './model/comment-model';
import FilterModel from './model/filter-model';
import FilterPresenter from './presenter/filter-presenter';
import FilmsApiService from './api-service';
import ProfilePresenter from './presenter/profile-presenter';

const AUTHORIZATION = 'Basic SJ2jk3i20932hbnu';
const END_POINT = 'https://17.ecmascript.pages.academy/cinemaddict/';

const api = new FilmsApiService(END_POINT, AUTHORIZATION);

const filmModel = new FilmModel(api);

const commentModel = new CommentModel(api);
const filterModel = new FilterModel();
const mainBlock = document.querySelector('.main');
const headerElement = document.querySelector('.header');
const footerStatisticElement = document.querySelector('.footer__statistics');

const filmSectionPresenter = new FilmSectionPresenter(mainBlock, filmModel, commentModel, filterModel, footerStatisticElement);
const filterPresenter = new FilterPresenter(mainBlock, filterModel, filmModel);
const profileProsenter = new ProfilePresenter(headerElement, filmModel);


filterPresenter.init();
filmSectionPresenter.init();
filmModel.init();
profileProsenter.init();
