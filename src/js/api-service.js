const API_KEY = '83cba2c85d0df477852b094af9fbdddb';

export default class ApiService {
  constructor() {
    this.searchValue = '';
    this.page = 1;
    this.idMovie = '';
    this.objForLocalStorage = {};
  }

  async fetchTrendingUrl() {
    const response = await fetch(
      `https://api.themoviedb.org/3/trending/movie/day?api_key=${API_KEY}&page=${this.page}`
    );

    this.incrementPage();

    return await response.json();
  }

  async fetchSearch() {
    // this.resetPage();
    console.log(this.searchValue);
    const response = await fetch(
      `https://api.themoviedb.org/3/search/movie?api_key=${API_KEY}&query=${this.searchValue}&page=${this.page}`
    );
    console.log();
    this.incrementPage();
    console.log(response);
    return await response.json();
  }

  async fetchGenres() {
    const response = await fetch(
      `https://api.themoviedb.org/3/genre/movie/list?api_key=${API_KEY}&language=en-US`
    );
    // console.log('fetchGenres', response);
    return await response.json();
  }

  // id подставлен статически временно 453395
  async fetchMovieById() {
    const response = await fetch(
      `https://api.themoviedb.org/3/movie/${this.idMovie}?api_key=${API_KEY}`
    );
    return await response.json();
  }
  incrementPage() {
    this.page += 1;
  }
  resetPage() {
    this.page = 1;
  }

  get input() {
    return this.searchValue;
  }
  set input(newSearchValue) {
    this.searchValue = newSearchValue;
  }

  get id() {
    return this.idMovie;
  }

  set id(newIdMovie) {
    this.idMovie = newIdMovie;
  }

  get obj() {
    return this.objForLocalStorage;
  }
  set obj(newObj) {
    this.objForLocalStorage = newObj;
  }
}
