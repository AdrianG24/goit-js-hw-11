import './css/styles.css';
import { fetchCountries } from './fetchCountries';

import debounce from 'lodash.debounce';
import Notiflix from 'notiflix';

const refs = {
  searchInput: document.querySelector('#search-box'),
  countryList: document.querySelector('.country-list'),
  countryInfo: document.querySelector('.country-info'),
};
const DEBOUNCE_DELAY = 300;

const countriesList = countries => {
  const countriesMarkup = countries
    .map(country => {
      return `<li><img src="${country.flags.svg}" alt="Flag of ${country.name.official}" width = "30" height = "20"><b> ${country.name.official}</b></li>`;
    })
    .join('');
  refs.countryList.insertAdjacentHTML('beforeend', countriesMarkup);
};

const earchCountry = country => {
  const countryMarkup = country
    .map(country => {
      return `<li>
      <img src="${country.flags.svg}" alt="Flag of ${
        country.name.official
      }" width="60" height="50">
         <h2 class ="country-name">${country.name.official}</h2>
         <h3><b>Capital</b>: ${country.capital}</h3>
         <h4><b>Population</b>: ${country.population}</h4>
         <h5><b>Languages</b>: ${Object.values(country.languages)}</h5> 
         </li>`;
    })
    .join('');
  refs.countryList.insertAdjacentHTML('beforeend', countryMarkup);
};

refs.searchInput.addEventListener(
  'input',
  debounce(handlerInput, DEBOUNCE_DELAY)
);

function handlerInput(evt) {
  clearHtml();
  const searchCountry = evt.target.value.trim();
  if (searchCountry !== '') {
    fetchCountries(searchCountry).then(foundData => {
      // console.log(foundData);
      if (foundData.length > 10) {
        Notiflix.Notify.info(
          'Too many matches found. Please enter a more specific name.'
        );
      } else if (foundData.length >= 2 && foundData.length <= 10) {
        countriesList(foundData);
      } else if (foundData.length === 1) {
        refs.countryList.innerHTML = '';
        earchCountry(foundData);
      } else if (foundData.length === 0) {
        Notiflix.Notify.failure('Oops, there is no country with that name');
      }
    });
  }
}

function clearHtml() {
  refs.countryList.innerHTML = '';
  refs.countryInfo.innerHTML = '';
}
