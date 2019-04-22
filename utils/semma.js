const axios = require('axios');
const cheerio = require('cheerio');

const getSemma = async () => {
  let menu;
  try {
    const response = await axios.get('https://www.semma.fi/modules/json/json/Index?costNumber=1408&language=fi');
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

module.exports = getSemma