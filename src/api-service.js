import ApiService from './framework/api-service.js';

const Method = {
  GET: 'GET',
  PUT: 'PUT',
  POST: 'POST',
  DELETE: 'DELETE'
};

export default class FilmsApiService extends ApiService {
  get films() {
    return this._load({url: 'movies'})
      .then(ApiService.parseResponse);
  }

  getCommets = (filmId) => this._load({url: `comments/${filmId}`})
    .then(ApiService.parseResponse);

  updateFilm = async (film) => {
    const response = await this._load({
      url: `tasks/${film.id}`,
      method: Method.PUT,
      body: JSON.stringify(this.#adaptToServer(film)),
      headers: new Headers({'Content-Type': 'application/json'}),
    });

    const parsedResponse = await ApiService.parseResponse(response);

    return parsedResponse;
  };

  #adaptToServer = (film) => {
    const adaptedFilm = { ...film,
      'film_info': {...film.filmInfo,
        'age_rating': film.filmInfo.ageRating,
        'alternative_title': film.filmInfo.alternativeTitle,
        'total_rating': film.filmInfo.totalRating
      },
      'user_details': {...film.userDetails,
        'already_watched': film.userDetails.alreadyWatched,
        'watching_date': film.userDetails.watchingDate
      }
    };

    delete adaptedFilm['filmInfo'];
    delete adaptedFilm.film.filmInfo.ageRating;
    delete adaptedFilm.filmInfo.alternativeTitle;
    delete adaptedFilm.filmInfo.totalRating;
    delete adaptedFilm['userDetails'];
    delete adaptedFilm.film.userDetails.alreadyWatched;
    delete adaptedFilm.film.userDetails.watchingDate;
    return adaptedFilm;
  };
}
