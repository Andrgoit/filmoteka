const refs = {
  form: document.querySelector('.search-form'),
  gallery: document.querySelector('#gallery-list'),
};

refs.form.addEventListener('submit', inputHandler);

function inputHandler(e) {
  e.preventDefault();
  const input = e.currentTarget.elements.searchInput.value;
  console.log(input);
}
