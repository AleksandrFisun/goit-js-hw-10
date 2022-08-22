import fetchCountries from './js/fetchCountries';
import listCountries from './template/listCountries.hbs';
import countryСard from './template/countryСard.hbs';
import './css/styles.css';
import debounce from 'lodash.debounce';
import Notiflix from 'notiflix';
//Подключение
const searchCountryInput = document.querySelector('#search-box');
const outputListCountries = document.querySelector('.country-list');
//Задержка
const DEBOUNCE_DELAY = 300;
//
function searchCoutry(e) {
  const country = e.target.value.trim();
  if (!country || country === ``) {
    removeCountryMarkup();
    Notiflix.Notify.info('Please enter more characters.');
    return;
  }
  fetchCountries(country)
    .then(data => {
      if (data.status === 404) {
        Notiflix.Notify.failure(`Oops, there is no country with that name`);
        removeCountryMarkup();
        return;
      }
      creationMarkupCountries(data);
    })
    .catch(error => Notiflix.Notify.failure(error.message));
}

function creationMarkupCountries(countries) {
  if (countries.length > 10) {
    removeCountryMarkup();
    Notiflix.Notify.info(
      'Too many matches found. Please enter a more specific name.'
    );
    return;
  }
  // Проверка (меньше 10 и больше или равно 2)
  if (countries.length < 10 && countries.length >= 2) {
    removeCountryMarkup();
    const countryListMarkup = listCountries(countries);
    outputListCountries.insertAdjacentHTML('afterbegin', countryListMarkup);
  }
  // Проверка ( если кол-во стран в БД = 1 выводим карточку этой страны)
  if (countries.length === 1) {
    removeCountryMarkup();
    const markupCardCountries = countryСard(countries);
    outputListCountries.insertAdjacentHTML(`afterbegin`, markupCardCountries);
  }
}
// Обнуление html разметки
function removeCountryMarkup() {
  outputListCountries.innerHTML = '';
}
searchCountryInput.addEventListener(
  'input',
  debounce(searchCoutry, DEBOUNCE_DELAY)
);
