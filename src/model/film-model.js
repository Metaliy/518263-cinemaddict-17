import { generateFilm} from '../mock/film';
import { generateComment } from '../mock/comment';


export default class FilmModel {
  films = Array.from({length: 5}, generateFilm);
  comments = Array.from({length: 25}, generateComment);
  getComment = () => this.comments;
  getFilm = () => this.films;
}
