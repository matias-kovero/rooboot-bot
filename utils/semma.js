const axios = require('axios');
const cheerio = require('cheerio');

const getSemma = async (ravintola) => {
  let menu;
  let costNumber = '';
  switch(ravintola) {
    case "piato":
      costNumber = '1408';
      break;
    default:
      costNumber = '1402';
  }
  let url = 'https://www.semma.fi/modules/json/json/Index?costNumber='+costNumber+'&language=fi';
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

module.exports = getSemma(ravintola)