const cheerio = require('cheerio');
const Horseman = require('node-horseman');
/* OLD CODE FOR PUPPETEER - BLUEMIX HAS ISSUES WITH IT
  let url = `https://kuvapankki.papunet.net/haku/${param}`;
    //const launchedBrowser = await puppeteer.launch();
    const launchedBrowser = await puppeteer.connect({ browserWSEndpoint: 'ws://localhost:3000' });
    const page = await launchedBrowser.newPage();
    let html = await page.goto(url, {waitUntil: 'networkidle0'}).then(async function() {
      return await page.content();
    });
    const $ = cheerio.load(html);
    const cards = $('.card-img', html)[0].attribs['src'];
    launchedBrowser.close();
    return cards;
 */
module.exports = {
  kuva: async function papu(param) {
    param = param.replace(/ä/g, '%C3%A4').replace(/ö/g, '%C3%B6');
    let url = `https://kuvapankki.papunet.net/haku/${param}`;
    var horseman = new Horseman({timeout: 10000});
    var img;
    try{
      await horseman
        .userAgent('Mozilla/5.0 (Windows NT 6.1; WOW64; rv:27.0) Gecko/20100101 Firefox/27.0')
        .open(url)
        .waitForSelector('.card-img')
        .html()
        .then(html => {
          const $ = cheerio.load(html);
          img = $('.card-img', html)[0].attribs['src'];
        })
        .close();
    } catch(err) {
      if(err.name === 'TimeoutError') {
        param = param.replace(/%C3%A4/g, 'ä').replace(/%C3%B6/g, 'ö')
        throw `Kuvia ei löydy nimellä: ${param}`;
      }
    }
    return img;
  }
}