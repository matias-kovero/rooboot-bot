const axios = require('axios');
const cheerio = require('cheerio');

//TODO: redo the code, way too much copy+paste

// ALL API URLS
const piato_url = 'https://www.semma.fi/modules/json/json/Index?costNumber=1408&language=fi';
const lozzi_url = 'https://www.semma.fi/modules/json/json/Index?costNumber=1401&language=fi';
const maija_url = 'https://www.semma.fi/modules/json/json/Index?costNumber=1402&language=fi';
const libri_url = 'https://www.semma.fi/modules/json/json/Index?costNumber=141301&language=fi';
const tilia_url = 'https://www.semma.fi/modules/json/json/Index?costNumber=1413&language=fi';
const syke_url = 'https://www.semma.fi/modules/json/json/Index?costNumber=1405&language=fi';
const rentukka_url = 'https://www.semma.fi/modules/json/json/Index?costNumber=1416&language=fi';
const ylisto_url = 'https://www.semma.fi/modules/json/json/Index?costNumber=1403&language=fi';
const fiilu_url = 'https://fiilu-scraper.now.sh/lunch/week';
const ilokivi_url = 'https://ilokivi-scraper.now.sh/lunch/today?semmaFormat=true';
const aimo_url = 'https://www.fazerfoodco.fi/modules/json/json/Index?costNumber=0350&language=fi';
const fiilu_url_summer = 'https://www.fazerfoodco.fi/modules/json/json/Index?costNumber=3364&language=fi';

const getPiato = async () => {
  let menu;
  let url = piato_url;
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
  let url = lozzi_url;
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
const getMaija = async () => {
  let menu;
  let url = maija_url;
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
const getLibri = async () => {
  let menu;
  let url = libri_url;
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
const getTilia = async () => {
  let menu;
  let url = tilia_url;
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
const getSyke = async () => {
  let menu;
  let url = syke_url;
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
const getRentukka = async () => {
  let menu;
  let url = rentukka_url;
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
const getYlisto = async () => {
  let menu;
  let url = ylisto_url;
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
const getFiilu = async () => {
  let menu;
  let url = fiilu_url; 
  //let url = fiilu_url_summer; - Summer schedule 1.6 - 31.8
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
const getIlokivi = async () => {
  let menu;
  let url = ilokivi_url;
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
const getAimo = async () => {
  let menu;
  let url = aimo_url;
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
  getLozzi,
  getMaija,
  getLibri,
  getTilia,
  getSyke,
  getRentukka,
  getYlisto,
  getFiilu,
  getIlokivi,
  getAimo
}