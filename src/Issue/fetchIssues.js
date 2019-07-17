/**
 * Fetches issues from Github
 */

const API_URL = 'https://api.github.com/search/issues';

/**
 * Fetches issues from Github using conditions provided in the {params}
 *
 * @param {array} params
 * @returns {Promise<DataTransferItemList | Promise<any | never>>}
 */
export const fetchIssues = async (params) => {
  const searchString = getSearchQueryString(params);

  return fetch(API_URL + searchString, {method: 'GET'})
    .then(response => response.json())
    .then(data => {
        data.items.sort((a, b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime());
        return data.items;
    });
};

const getSearchQueryString = (params) => {
  let searchString = '?q=';

  for (let condition of params) {
    searchString += `${condition}+`;
  }

  return searchString.slice(0, -1);
};