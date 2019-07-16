
const API_URL = 'https://api.github.com/search/issues';

function searchIssues(params, startLoadingAnimation, stopLoadingAnimation) {
  let searchString = '';

  startLoadingAnimation();
  searchString = getSearchQueryString(params);

  return new Promise((resolve, reject) => {
    fetch(API_URL + searchString, {method: 'GET'})
    .then(response => response.json())
    .then(data => {
      stopLoadingAnimation();
      resolve(data.items);
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

export default searchIssues;