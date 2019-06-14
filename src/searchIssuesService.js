
const API_URL = 'https://api.github.com/search/issues'

function searchIssues(params = []) {
  let searchString = '', issues = {};

  searchString = getSearchQueryString(params);
  //issues = executeSearch();

  return new Promise((resolve, reject) => {
    fetch(API_URL + searchString, {method: 'GET'})
    .then(response => response.json())
    .then(data => {
      resolve(data);
    });
  })
}

function getSearchQueryString(params) {
  let searchString = '?q=';

  for (let condition of params) {
    searchString += `${condition}+`;
  }

  return searchString.slice(0, -1);
}

function executeSearch(url) {
  
}

export default searchIssues;