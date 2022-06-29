import ApiService from './js/api-service';
const newApiService = new ApiService();

//  == refs ==
const refs = {
  form: document.querySelector('.search-form'),
  gallery: document.querySelector('#gallery-list'),
  galleryItem: document.querySelector('.gallery-item'),
};

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
    console.log(response);
    markupMovies(response, responseGenres);
  } catch (error) {
    console.log(error);
  }
}
//  == // First Load Page ==

function markupMovies(response, responseGenres) {
  console.log(response.results);
  const arrGenres = responseGenres.genres;
  console.log(arrGenres);

  const imageUrl = 'https://image.tmdb.org/t/p/';
  const imageSize = 'w500';
  const movies = response.results;

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
        return `<li class="gallery-item" id="${id}">
        <div class="gallery-image"><img src="${imageUrl}${imageSize}${poster_path}" alt="${original_title}"></div>
        <h2 class="gallery-item-title">${original_title}</h2>
        <span class="gallery-item-prop">${genresArray} | ${year} | ${vote}</span>
        <button type="button" id="watched">Watched</button>
<button type="button" id="queue">Queue</button>
      </li>`;
      }
    )
    .join('');

  refs.gallery.innerHTML = markup;
  addGalleryItemListener();
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

function addGalleryItemListener() {
  galleryItem = document.querySelector('.gallery-item');
  galleryItem.addEventListener('click', galleryItemListener);
}

function galleryItemListener(e) {
  console.log(e);
}
