const axios = require('axios');
const cheerio = require('cheerio');

const getPiato = async () => {
  let menu;
  let url = 'https://www.semma.fi/modules/json/json/Index?costNumber=1408&language=fi';
  try {
    const response = await axios.get(url);
    if (response.status === 200) {
      const html = response.data;
      menu = html;
    } else {
      throw new Error(`Error, response status ${response.status}`);
    }
  } catch (error) {
    return [];
  }
  return menu;
}
const getLozzi = async () => {
  let menu;
  let url = 'https://www.semma.fi/modules/json/json/Index?costNumber=1401&language=fi';
  menu = getRavintola(url);
  return menu;
}

function getRavintola(url) {
  let menu;
  try {
    const response = await axios.get(url);
    if (response.status === 200) {
      const html = response.data;
      menu = html;
    } else {
      throw new Error(`Error, response status ${response.status}`);
    }
  } catch (error) {
    return [];
  }
  return menu;
}

module.exports = {
  getPiato,
  getLozzi
}