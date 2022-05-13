import View from './view-class-preset';
import { humanizeReleaseDate } from '../util';


const createFilmPopupComment = (commentArrayItem) => {
  const {comment, author, emotion, date} = commentArrayItem;

  const commentDate = date !== null
    ? humanizeReleaseDate(date, 'YYYY/M/D H:m')
    : '';

  return `<li class="film-details__comment">
  <span class="film-details__comment-emoji">
    <img src="./images/emoji/${emotion}.png" width="55" height="55" alt="emoji-${emotion}">
  </span>
  <div>
    <p class="film-details__comment-text">${comment}</p>
    <p class="film-details__comment-info">
      <span class="film-details__comment-author">${author}</span>
      <span class="film-details__comment-day">${commentDate}</span>
      <button class="film-details__comment-delete">Delete</button>
    </p>
  </div>
</li>`;
};

export default class FilmsPopupCommentView extends View {

  constructor(commentArrayItem) {
    super();
    this.commentArrayItem = commentArrayItem;
  }

  getTemplate() {
    return createFilmPopupComment(this.commentArrayItem);
  }

}
