import './css/styles.css';
import debounce from 'lodash.debounce';
import Notiflix from 'notiflix';
import fetchCountries from './js/fetchCountries';
import listCountryCards from './template/country.hbs';
import allCountriesCards from './template/all-countries-card.hbs';
import countryCardMarkup from './template/countryMarkup.hbs';
//Подключение
const inputCounrty = document.querySelector('#search-box');
const countryList = document.querySelector('.country-list');
const sectionAllCardCountry = document.querySelector('.country-info');
const titleAllCountries = document.querySelector(
  '.title__all-countries-invisible'
);
//Задержка
const DEBOUNCE_DELAY = 300;
//
function searchCoutry(e) {
  const country = e.target.value.trim();
  if (!country || country === ``) {
    clearCountry();
    Notiflix.Notify.info('Please enter more characters.');
  }
  fetchCountries(country)
    .then(data => {
      if (data.status === 404) {
        Notiflix.Notify.failure(`Oops, there is no country with that name`);
        clearCountry();
      }
      creationMarkup(data);
      createAllCountryMarkup(data);
    })
    .catch(error => Notiflix.Notify.failure(error.message));
}

function creationMarkup(countries) {
  if (countries.length > 10) {
    clearCountry();
    Notiflix.Notify.info(
      'Too many matches found. Please enter a more specific name.'
    );
    return;
  }
  if (countries.length < 10 && countries.length >= 2) {
    clearCountry();
    const createCountry = listCountryCards(countries);
    countryList.insertAdjacentHTML('afterbegin', createCountry);
  }
  if (countries.length === 1) {
    clearCountry();
    const countriesConsole = countries;
    console.log(
      countriesConsole.map(Object.values(countriesConsole.languages)).join(' ')
    );
    // countryMarkup = countryCardMarkup(countries);
    // countryList.insertAdjacentHTML(`afterbegin`, countryMarkup);
  }
}
// Обнуление html разметки
function clearCountry() {
  countryList.innerHTML = '';
}
inputCounrty.addEventListener('input', debounce(searchCoutry, DEBOUNCE_DELAY));
//
// Не касается домашней работы (Список карточек стран более 10)
function createAllCountryMarkup(countries) {
  if (countries.length >= 10) {
    sectionAllCardCountry.innerHTML = '';
    titleAllCountries.classList.remove('title__all-countries-invisible');
    titleAllCountries.classList.add('title__all-countries-visible');
    const allCardCountry = allCountriesCards(countries);
    sectionAllCardCountry.insertAdjacentHTML('beforeend', allCardCountry);
  } else {
    titleAllCountries.classList.remove('title__all-countries-visible');
    titleAllCountries.classList.add('title__all-countries-invisible');
    sectionAllCardCountry.innerHTML = '';
  }
}
