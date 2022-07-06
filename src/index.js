import ApiService from './js/api-service';
const newApiService = new ApiService();

//  == refs ==
const refs = {
  form: document.querySelector('.search-form'),
  gallery: document.querySelector('.gallery-list'),
  modalWindow: document.querySelector('.backdrop'),
};

// console.log(refs.modalWindow);

//   == listeners ==
refs.form.addEventListener('submit', inputHandler);

//  == First Load Page ==
firstPageLoader();

function firstPageLoader() {
  window.addEventListener('DOMContentLoaded', getTrendingMovie);
}

async function getTrendingMovie() {
  newApiService.resetPage();
  try {
    const response = await newApiService.fetchTrendingUrl();
    const responseGenres = await newApiService.fetchGenres();
    // console.log(response);
    markupMovies(response, responseGenres);
    refs.gallery.addEventListener('click', galleryListListener);
  } catch (error) {
    console.log(error);
  }
}
//  == // First Load Page ==

function markupMovies(response, responseGenres) {
  const arrGenres = responseGenres.genres;
  const imageUrl = 'https://image.tmdb.org/t/p/';
  const imageSize = 'w500';
  const movies = response.results;

  // console.log(response.results);
  // console.log(arrGenres);

  const markup = movies
    .map(
      ({
        id,
        genre_ids,
        original_title,
        release_date,
        poster_path,
        vote_average,
      }) => {
        let genresArray = arrGenres
          .filter(genre => genre_ids.includes(genre.id))
          .map(genre => genre.name);
        let date = new Date(release_date);
        let year = date.getFullYear();
        let vote = vote_average.toFixed(1);
        return `<li class="gallery-item" data-id="${id}">
        <div class="gallery-image"><img src="${imageUrl}${imageSize}${poster_path}" alt="${original_title}">
        <h2 class="gallery-item-title">${original_title}</h2>
        <span class="gallery-item-prop">${genresArray} | ${year} | ${vote}</span></div></li>`;
      }
    )
    .join('');

  refs.gallery.innerHTML = markup;

  // addGalleryItemListener();
}

async function inputHandler(e) {
  e.preventDefault();
  refs.gallery.innerHTML = '';
  newApiService.input = e.currentTarget.elements.searchInput.value.trim();
  // console.log(newApiService.input);
  // newApiService.resetPage();
  if (newApiService.input !== '') {
    try {
      const response = await newApiService.fetchSearch();
      const responseGenres = await newApiService.fetchGenres();
      // console.log(response);
      markupMovies(response, responseGenres);
    } catch (error) {
      console.log(error);
    }
  }
  return;
}

function galleryListListener(e) {
  e.preventDefault();
  refs.modalWindow.classList.remove('backdrop--hidden');

  // console.log(e.target);

  const target = e.target;
  newApiService.id = target.closest('.gallery-item').dataset.id;
  // console.log('IdElement', newApiService.id);
  getMovieById();
}

async function getMovieById() {
  try {
    const response = await newApiService.fetchMovieById();
    // console.log(response);
    markupModalWindowByMovie(response);
  } catch (error) {
    console.log(error);
  }
}

function markupModalWindowByMovie(response) {
  newApiService.obj = response;
  console.log(newApiService.obj);
  const imageUrl = 'https://image.tmdb.org/t/p/';
  const imageSize = 'w500';
  const {
    genres,
    original_title,
    poster_path,
    vote_average,
    vote_count,
    popularity,
    overview,
  } = response;
  let genresArray = genres.map(genre => genre.name);
  let vote = vote_average.toFixed(1);
  let popular = popularity.toFixed(1);
  const markupModalWindow = `<div class="card-modal">
    <button type="button" data-action="modal-close" class="modal-close">
      <img
        class="modal-close__icon"
        src="./images/card-modal-img/modal-btn-close.svg"
        alt="cross"
        width="30"
        height="30"
      />
    </button>
    <div class="card-modal__container">
      <div class="card-modal__img">
        <picture>
          <source
            srcset="
              ${imageUrl}${imageSize}${poster_path} 1x,
              ${imageUrl}${imageSize}${poster_path} 2x
            "
            media="(min-width: 1200px)"
          />
          <source
            srcset="
              ${imageUrl}${imageSize}${poster_path} 1x,
              ${imageUrl}${imageSize}${poster_path} 2x
            "
            media="(min-width: 768px)"
          />
          <source
            srcset="
              ${imageUrl}${imageSize}${poster_path} 1x,
              ${imageUrl}${imageSize}${poster_path} 2x
            "
            media="(min-width: 320px)"
          />
          <img src="${imageUrl}${imageSize}${poster_path}" alt="film" />
        </picture>
      </div>
      <div class="modal-meta">
        <h2 class="modal-heading">${original_title}</h2>
        <div class="meta-container">
          <ul class="list feature__list">
            <li class="feature__item">
              <span class="meta__feature">Vote / Votes</span>
            </li>
            <li class="feature__item">
              <span class="meta__feature">Popularity</span>
            </li>
            <li class="feature__item">
              <span class="meta__feature">Original Title</span>
            </li>
            <li class="feature__item">
              <span class="meta__feature">Genre</span>
            </li>
          </ul>
          <ul class="list value__list">
            <li class="value__item">
              <div>
                <span class="vote-votes">${vote}</span> /
                <span class="vote-votes">${vote_count}</span>
              </div>
            </li>
            <li class="value__item">
              <span class="meta__value">${popular}</span>
            </li>
            <li class="value__item">
              <span class="meta__value">${original_title}</span>
            </li>
            <li class="value__item">
              <span class="meta__value">${genresArray}</span>
            </li>
          </ul>
        </div>
        <h3 class="modal-meta__title">About</h3>
        <p class="modal-meta__discription">${overview}</p>
        <ul class="list modal-btn__list">
          <li class="modal-btn__item">
            <button class="modal-btn" data-action="watched" type="button">add to watched</button>
          </li>
          <li class="modal-btn__item">
            <button class="modal-btn" data-action="queue" type="button">add to queue</button>
          </li>
        </ul>
      </div>
    </div>
  </div>`;
  refs.modalWindow.innerHTML = markupModalWindow;
  addModalWindowListeners();
}

function addModalWindowListeners() {
  const closeModalWindow = document.querySelector(
    '[data-action="modal-close"]'
  );
  closeModalWindow.addEventListener('click', () => {
    refs.modalWindow.classList.add('backdrop--hidden');
    refs.modalWindow.innerHTML = '';
  });

  const addToWatchedBtn = document.querySelector('[data-action="watched"]');
  addToWatchedBtn.addEventListener('click', addWatchedToLocalStorage);

  const addToQueueBtn = document.querySelector('[data-action="queue"]');
  addToQueueBtn.addEventListener('click', addQueueToLocalStorage);
}

function addWatchedToLocalStorage() {
  const watchedFromStorage = localStorage.getItem('watched');

  try {
    const list = watchedFromStorage ? JSON.parse(watchedFromStorage) : [];
    list.push(newApiService.obj);
    const updateList = JSON.stringify(list);
    localStorage.setItem('watched', updateList);
  } catch (error) {
    console.log('localStorage parsing error');
  }
}

function addQueueToLocalStorage() {
  const watchedFromStorage = localStorage.getItem('queue');

  try {
    const list = watchedFromStorage ? JSON.parse(watchedFromStorage) : [];
    list.push(newApiService.obj);
    const updateList = JSON.stringify(list);
    localStorage.setItem('queue', updateList);
  } catch (error) {
    console.log('localStorage parsing error');
  }
}
