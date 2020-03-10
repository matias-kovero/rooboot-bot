const axios = require('axios');

/**
 * Poll HS-Coronainfo
 */
module.exports = {
  getInfo: async function() {
    let data;
    let url = 'https://w3qa5ydb4l.execute-api.eu-west-1.amazonaws.com/prod/finnishCoronaData';

    try {
      const response = await axios.get(url);
      if (response.status === 200) {
        const json_data = response.data;
        data = { data: json_data, confirmed: json_data.confirmed.length, dead: json_data.deaths.length };
      } else {
        throw new Error(`Error, response status ${response.status}`);
      }
    } catch (error) {
      return new Error(`Error, f´ me ${error.name}`);
    }
    return data;
  }
}