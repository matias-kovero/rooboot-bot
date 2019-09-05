const axios = require('axios');
const cheerio = require('cheerio');
/**
 * Get current commit message from given repository URL
 * @param {String} repoURL reposity URL. Example: matias.kovero/rooboot-bot
 */
const getCommitMsg = async (repoURL) => {
  const requestURL = 'https://github.com/'+repoURL;
  try {
    const response = await axios.get(requestURL);
    const html = response.data;
    const $ = cheerio.load(html);

    var commit_message = $('.message.text-inherit', html).text();
    return commit_message; // Format ready for Markdown (Italic)
  } catch(error) {
    return 'Unable to get commit message. ' + error.message;
  }
}

module.exports = getCommitMsg;