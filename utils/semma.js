const axios = require('axios');
const urls = {
  piato: 'https://www.semma.fi/modules/json/json/Index?costNumber=1408&language=fi',
  lozzi: 'https://www.semma.fi/modules/json/json/Index?costNumber=1401&language=fi',
  maija: 'https://www.semma.fi/modules/json/json/Index?costNumber=1402&language=fi',
  libri: 'https://www.semma.fi/modules/json/json/Index?costNumber=141301&language=fi',
  syke: 'https://www.semma.fi/modules/json/json/Index?costNumber=1405&language=fi',
  rentukka: 'https://www.semma.fi/modules/json/json/Index?costNumber=1416&language=fi',
  ylisto: 'https://www.semma.fi/modules/json/json/Index?costNumber=1403&language=fi',
  fiilu: 'https://fiilu-scraper.now.sh/lunch/week',
  fiilu_summer: 'https://www.fazerfoodco.fi/modules/json/json/Index?costNumber=3364&language=fi',
  ilokivi: 'https://ilokivi-scraper.now.sh/lunch/today?semmaFormat=true',
  aimo: 'https://www.fazerfoodco.fi/modules/json/json/Index?costNumber=0350&language=fi',
  uno: 'https://www.semma.fi/modules/json/json/Index?costNumber=1414&language=fi'
};

/**
 * Gets specified restaurants menu.
 * @param {String} restaurant Restaurant name
 */
module.exports =  async function (restaurant) {
  let menu;
  let url = urls[restaurant];

  if(!url) return new Error(`Minulla ongelma: ravintola väärä?`);

  try {
    const response = await axios.get(url);
    if (response.status === 200) {
      const html = response.data;
      menu = html;
    } else {
      throw new Error(`Error, response status ${response.status}`);
    }
  } catch (error) {
    return new Error(`Error, f´ me ${error.name}`);
  }
  return menu;
}