var express = require("express");
var app = express();
var bodyParser = require('body-parser')
const TelegramBot = require('node-telegram-bot-api');
const TOKEN = process.env.TELEGRAM_TOKEN;
const custom = new RegExp(process.env.CUSTOM);
const secret = process.env.VALDEMAR;
const cLength = process.env.CUSTOM.length;
const url = 'https://mk-telegram-bot.eu-gb.mybluemix.net';
var port = process.env.PORT || 3000;
const fs = require('fs');
const supportedRestaurant = new RegExp(/\/(piato|lozzi|maija|libri|tilia|syke|ylisto|fiilu|ilokivi|rentukka|aimo)(.(h$|yh$)|$|@+)/);

// FUNCTIONS FROM UTILS
const { getPiato, getLozzi, getMaija, getLibri, getTilia, getSyke, getRentukka, getYlisto, getFiilu, getIlokivi, getAimo} = require(__dirname + '/utils/semma');
const getLaulukirja = require(__dirname + '/utils/laulukirja');
const getBanters = require(__dirname + '/utils/banters');
const getFullEvents = require(__dirname + '/utils/events');
const { loadCatImage, loadDogImage } = require(__dirname +'/utils/loadImageAnimal');
const getCommitMsg = require(__dirname + '/utils/commitMsg');

var lk_obj;
var banters;
var elaimet = {
  kissat: 0,
  koirat: 0
};
// Current commit message
let commit_message;
// List of chat IDs where rooboot has been used.
let informed_chats = [];
// List of chats where banter is on
var banter_ON = [];
// List with additional info about banter: rate
var banter_INFO = [];
// Sticker Set (Pukki)
let stickers_pukki;

// No need to pass any parameters as we will handle the updates with Express
const bot = new TelegramBot(TOKEN);

// This informs the Telegram servers of the new webhook.
bot.setWebHook(`${url}/bot${TOKEN}`);
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())

// We are receiving updates at the route below!
app.post(`/bot${TOKEN}`, (req, res) => {
  bot.processUpdate(req.body);
  res.sendStatus(200);
});

//serve static file (index.html, images, css)
app.use(express.static(__dirname + '/views'));

var port = process.env.PORT || 3000
app.listen(port, function() {
    console.log('Server is running at port:' + port);
});

// ladataan laulukirja kun botti käynnistyy
const startBot = async () => {
  stickers_pukki = await bot.getStickerSet("Pukkipack");
  lk_obj = await getLaulukirja();
  banters = await getBanters();
  commit_message = await getCommitMsg('matias-kovero/rooboot-bot');
};
/**  START ---  SEMMA RESTAURANTS --- */
bot.onText(supportedRestaurant, async msg => {
  const chatId = msg.chat.id;
  const restaurant = msg.text.split(/ |@/)[0].substring(1); // Take the restaurant name
  let obj;
  switch(restaurant) {
    case 'piato':
      obj = await getPiato();
      break;
    case 'lozzi':
      obj = await getLozzi();
      break;
    case 'maija':
      obj = await getMaija();
      break;
    case 'libri':
      obj = await getLibri();
      break;
    case 'tilia':
      obj = await getTilia();
      break;
    case 'syke':
      obj = await getSyke();
      break;
    case 'rentukka':
      obj = await getRentukka();
      break;
    case 'ylisto':
      obj = await getYlisto();
      break;
    case 'fiilu':
      obj = await getFiilu();
      break;
    case 'ilokivi':
      obj = await getIlokivi();
      break;
    case 'aimo':
      obj = await getAimo();
    default:
      break;
  }
  if(obj) {
    let response = parseSemma(msg, obj);
    bot.sendMessage(chatId, response, {parse_mode: 'Markdown', disable_notification: true});
  } else bot.sendMessage(chatId, 'Minulla ongelma', {disable_notification: true});
});
/** END --- SEMMA RESTAURANTS --- */

/** START --- LAULUKIRJA --- */
bot.onText(/\/laulukategoriat/, async (msg, match) => {
  const chatId = msg.chat.id;
  var responseTxt = '';
  const laulut = lk_obj.Laulukirja;
  for(var laulu of laulut) {
    if(!responseTxt.includes(laulu.kategoria)) responseTxt += laulu.kategoria + '\r\n';
  };

  if(responseTxt == '') responseTxt = 'Ei löydy!';
  bot.sendMessage(chatId, responseTxt, {
    parse_mode: 'Markdown',
    disable_web_page_preview: true
  });
});
bot.onText(/\/laulu(.+)/, async (msg, match) => {
  const chatId = msg.chat.id;
  var responseTxt = '';
  const haku = msg.text.split(' ')[1]; // Tämä voi olla numero tai nimi
  const laulut = lk_obj.Laulukirja;
  if(haku.match(/^\d+$/)) { // Haetaan numerolla
    for(var laulu of laulut) {
      if(laulu.numero == haku) {
        responseTxt += '*'+laulu.numero+'. ' + laulu.nimi +'*\r\n'; // 1. Finlandia-hymni
        for(var sae of laulu.sanat) {
          responseTxt += sae.replace('*', '\\*')+'\r\n'; // We need to escape * or markdown will brake
        }
      }
    }
  } else { // Haetaan nimellä
    for(var laulu of laulut) {
      if(laulu.nimi.toLowerCase().includes(haku.toLowerCase())) {
        responseTxt += '*'+laulu.numero+'. ' + laulu.nimi +'*\r\n'; // 1. Finlandia-hymni
        for(var sae of laulu.sanat) {
          responseTxt += sae+'\r\n';
        }
        break;
      }
    }
  }
  if(responseTxt == '') responseTxt = 'Ei löydy!';
  bot.sendMessage(chatId, responseTxt, {
    parse_mode: 'Markdown',
    disable_web_page_preview: true
  });
});
/** END --- LAULUKIRJA --- */

/** START --- AUDIO --- */
bot.onText(/\/vappubanger/, async msg => {
  const chatId = msg.chat.id;
  //const stream = fs.createReadStream(__dirname + '/media/vappubanger.mp3');
  const stream = 'http://users.jyu.fi/~mawakove/musat/När Börjar x Mibetti-Vappubängeri 2019.mp3';
  const options = {
    caption: '🔥🔥🔥',
    duration: 228,
    performer: 'När Börjar x Mibetti',
    title: 'Vappubängeri 2019'
  };
  bot.sendAudio(chatId, stream, options);
});
bot.onText(/\/bisnesta/, async msg => {
  const chatId = msg.chat.id;
  //const stream = fs.createReadStream(__dirname + '/media/vappubanger.mp3');
  const stream = 'http://users.jyu.fi/~mawakove/musat/Bisnestä.mp3';
  const options = {
    caption: '💰💰💰',
    duration: 283,
    performer: 'Börs',
    title: 'Bisnestä'
  };
  bot.sendAudio(chatId, stream, options);
});
/** END --- AUDIO --- */

/** START --- DUMPPI TAPAHTUMAT */
bot.onText(/\/tapahtumat/, async msg => {
  const chatId = msg.chat.id;
  try {
    responseTxt = "";
    const events = await getFullEvents();
    //console.log(events);
    for(var event of events.Tapahtumat) {
      responseTxt += '_'+event.ajankohta.trim()+ '_ *'+event.kapasiteetti+'*\r\n';
      responseTxt += '[' +event.nimi+ '](' +event.linkki +')\r\n';
      responseTxt += event.sijainti === ' ' ? '\r\n' : '_' +event.sijainti+'_\r\n\r\n';
    };
    bot.sendMessage(chatId, responseTxt, { 
      parse_mode: 'Markdown',
      disable_web_page_preview: true
    });
  } catch(error) {
    bot.sendMessage(chatId, 'Ei toimi :(');
  }
});
/** END --- DUMPPI TAPAHTUMAT  */

/** START --- ANIMAL IMAGES --- */
bot.onText(/\/kissa/, async msg => {
  const chatId = msg.chat.id;
  try {
    elaimet.kissat = elaimet.kissat +1;
    bot.sendMessage(chatId, 'Kissat: ' + elaimet.kissat + ' Koirat: ' + elaimet.koirat);
    const image = await loadCatImage();
    bot.sendPhoto(chatId, image.url);
  } catch (error) {
    bot.sendMessage(chatId, 'Joku meni ny rikki :(');
  }
});
bot.onText(/\/koira/, async msg => {
  const chatId = msg.chat.id;
  try {
    elaimet.koirat = elaimet.koirat +1;
    bot.sendMessage(chatId, 'Kissat: ' + elaimet.kissat + ' Koirat: ' + elaimet.koirat);
    const image = await loadDogImage();
    bot.sendPhoto(chatId, image.url);
  } catch (error) {
    bot.sendMessage(chatId, 'Joku meni ny rikki :(');
  }
});
/** END --- ANIMAL IMAGES --- */

/** START --- BANTER --- */
bot.onText(/\/banter/, async msg => {
  const chatId = msg.chat.id;
  var response = '';
  var index = banter_ON.indexOf(chatId);      // Save it to an var, as we will use it twice.
  if(index !== -1) {                          // The chat has banter turned ON.
    banter_ON.splice(index, 1);               // Remove chatID from banter_ON array => banter is now turned OFF.
    banter_INFO.splice(banter_INFO.findIndex(x => x.id == chatId), 1);
    response = 'Banter is turned off.';
  } else {                                    // The has banter turned OFF.
    banter_ON.push(chatId);                   // Add the chatID to the banter_ON array => banter is now turned ON.
    banter_INFO.push({id: chatId, rate: 5});  // We will also give the chat an rate of 50%.
    response = 'Banter is turned on. Rate 50%';
  }
  bot.sendMessage(chatId, response, {disable_notification: true}); // Testing, notification should be with no sound.
});
bot.onText(/\/rate/, async msg => {
  const chatId = msg.chat.id;
  var response = '';
  var param = msg.text.split(' ');
  var num;
  var index = banter_INFO.findIndex(x => x.id == chatId);
  if(index !== -1) {
    if(param[1] !== undefined) {        // We have an param
      num = parseInt(param[1].trim());  // Try to parse param to an INT
      if(num !== NaN) {                 // Check if it is an INT
        if(num > 0 && num < 11) {       // Check if value is right
          banter_INFO[index].rate = num;
          response = 'Banter rate changed to '+ (num *10) + '%';
        } else response = 'Tarkista numero.\r\nNumeron pitää olla väliltä 1 - 10'
      } else response = 'Tarkista numero.\r\nKokeile muodossa /rate {numero}\r\nEsim. /rate 2';
    } else response = 'Tarkista komento.\r\nPitäisi olla muodossa /rate {numrero}\r\nEsim. /rate 2';
  } else response = 'Laitappa banter ensiksi päälle...';
  bot.sendMessage(chatId, response);
}); 
bot.onText(custom, msg => {
  let message = msg.text;
  if(message.length > cLength) {
    let response = message.substring(cLength);
    bot.sendMessage(secret, response);
  }
});
bot.on('message', msg => {
  const chatId = msg.chat.id;
  let f_name = 'Juoppo';
  if(msg.chat.first_name != undefined) f_name = msg.chat.first_name;
  if(msg.contact != undefined) f_name = msg.contact.first_name;
  if(banter_ON.indexOf(chatId) !== -1) {
    var index = banter_INFO.findIndex(x => x.id == chatId);
    var rate = banter_INFO[index].rate;
    var rnd = Math.random();
    if(rnd < (rate/10)) { // rnd = 0-1, (rate/10) = 0.1 - 1
      var banter = banters[Math.floor(Math.random() * banters.length)].replace('&nimi&', f_name);
      bot.sendMessage(chatId, banter);
    }
    // RNG and check if we will response
    // IF YES, get banter -> get name -> send banter.
  }
});
/** END --- BANTER --- */

/** START --- xxx vai xxx --- */
bot.on('message', msg => {
  const msgID = msg.message_id;
  const chatId = msg.chat.id;
  const message = msg.text;
  if(message !== undefined) {
    if(message.includes(' vai ')) { // Tarkistetaan löytyykö sana vai
      var sanat = message.split(' vai '); 
      let tulos = Math.floor(Math.random() * Math.floor(sanat.length));
      bot.sendMessage(chatId, sanat[tulos], {reply_to_message_id: msgID});
    } // Added reply, to prevent users exploiting by deleting original message.
  } 
});
/** END --- xxx vai xxx --- */

/** START --- pitäskö/voisko/oisko --- */
bot.on('message', msg => {
  const chatId = msg.chat.id;
  const message = msg.text;
  const regex = /sk(o|ö)$/g;
  const rng = Math.floor((Math.random() * 100) + 1);

  if (message && rng > 70) { // 30% chance to response
    const firstWord = message.split(' ')[0].toLowerCase();
    if (firstWord.match(regex)) {
      const answer = firstWord.replace(regex, 's');
      bot.sendMessage(chatId, answer);
    }
  }
})
/** END --- pitäskö/voisko/oisko --- */

/** START --- Info new commit ---  */
bot.on('message', msg => {
  const chatId = msg.chat.id;
  if(informed_chats.indexOf(chatId) === -1) console.log('Server:', commit_message);
  if(informed_chats.indexOf(chatId) === -1 && commit_message) { // Chat isn't informed of new commit.
    informed_chats.push(chatId); // Add this chat as informed
    let message = "*I've been updated*\r\n";
    message += commit_message;
    bot.sendMessage(chatId, message, { parse_mode: 'Markdown' });
  };
})
/** END --- Info new commit ---  */

/** START --- Pukkiparty Stickers ---  */
bot.onText(/\/pukkiparty/, msg => {
  const chatId = msg.chat.id;
  let valid_pack;
  if(stickers_pukki.stickers && stickers_pukki.stickers.length > 0) valid_pack = true;

  if(valid_pack) {
    const rng = Math.floor((Math.random() * stickers_pukki.stickers.length) + 1);
    let sticker = stickers_pukki.stickers[rng].file_id;
    bot.sendSticker(chatId, sticker);
  } else bot.sendMessage(chatId, 'Sorry, unable to get Pukkipack stickers');
});
/** END --- Pukkiparty Stickers ---  */

/** START --- Countdown Game ---  */
bot.onText(/\/start/, function onPhotoText(msg){
  bot.sendGame(msg.chat.id, 'countdown');
});

bot.on('callback_query', function onCallbackQuery(callbackQuery) {
  bot.answerCallbackQuery(callbackQuery.id, { url: 'https://countdown-html-game.now.sh/' });
});
/** END --- Countdown Game ---  */

// Supporting function to easily parse Semma API objects
function parseSemma(msg, obj) {
  var num = 0;
  let lause = msg.text.split(' ');
  if(lause[1] !== undefined) {
      if (lause[1].trim() === "h") num = 1; // HUOMENNA
      else if (lause[1].trim() === "yh") num = 2; // YLIHUOMENNA
  };
  var restaurant_name = obj.RestaurantName;
  var week = obj.MenusForDays;
  if(week[0] == undefined) {
    return 'Listaa ei ole saatavilla\r\n';
  }
  var day = week[num];
  var open_time = day.LunchTime;
  var food = day.SetMenus;

  var dayTxt = "_Tänään_";
  if (num == 1) dayTxt = "_Huomenna_";
  else if (num == 2) dayTxt = "_Ylihuomenna_";
  var responseTxt = '*' + restaurant_name + '* ' + dayTxt + '\r\n';
  if (open_time !== null) {
    // Hot-Fix for Fiilu (Summer)
    //if(restaurant_name.includes('Fiilu')) open_time = '12.00-13.30';
    responseTxt += 'Lounas: ' + open_time + '\r\n';
    for (i = 0; i < food.length; i++) {
      if(food[i].Name === null) {} else {
        responseTxt += '*' + food[i].Name + '* ';
        responseTxt += '_' + food[i].Price + '_\r\n';
      }
      for (y = 0; y < food[i].Components.length; y++) {
        let dish = food[i].Components[y].replace('()', '');
        responseTxt += dish.replace('*', '\\*') + '\r\n';
      }
    }
  } else {
    responseTxt += "Kiinni";
  }
  return responseTxt;
};

startBot();