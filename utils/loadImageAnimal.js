/**
 * @author Ekkusi //https://github.com/ekkusi
 */

const querystring = require('querystring');
const r2 = require('r2');

const ANIMALS_API_KEY = '94030cba-ffa6-4aca-8ccd-44d2dfc957fe';

const loadCatImage = async () => {
  const headers = {
      'X-API-KEY': ANIMALS_API_KEY,
  }
  const query_params = {
    'size':'thumb',
    'limit' : 1
  }
  let queryString = querystring.stringify(query_params);

  let responseImages;
  try {
    let _url = `https://api.thecatapi.com/v1/images/search?${queryString}`;
    responseImages = await r2.get(_url , {headers} ).json
  } catch (e) {
      console.log(e)
  }
  return responseImages[0];
}

const loadDogImage = async () => {
  const headers = {
    'X-API-KEY': ANIMALS_API_KEY,
  }
  const query_params = {
    'size':'thumb',
    'limit' : 1
  }
  let queryString = querystring.stringify(query_params);

  let responseImages;
  try {
    let _url = `https://api.thedogapi.com/v1/images/search?${queryString}`;
    responseImages = await r2.get(_url , {headers} ).json
  } catch (e) {
      console.log(e)
  }
  return responseImages[0];
}

module.exports = {
  loadCatImage,
  loadDogImage
}