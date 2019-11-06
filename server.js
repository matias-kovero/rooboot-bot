var express = require("express");
var app = express();
var bodyParser = require('body-parser')
const TelegramBot = require('node-telegram-bot-api');
const center = require('center-align');
const TOKEN = process.env.TELEGRAM_TOKEN;
const custom = new RegExp(process.env.CUSTOM);
const secret = process.env.VALDEMAR;
const cLength = process.env.CUSTOM.length;
const url = 'https://mk-telegram-bot.eu-gb.mybluemix.net';
var port = process.env.PORT || 3000;
const fs = require('fs');
const supportedRestaurant = new RegExp(/\/(piato|lozzi|maija|libri|tilia|syke|ylisto|fiilu|ilokivi|rentukka|aimo|uno)(.(h$|yh$)|$|@+)/);
const Papu = require('./utils/papu.js');
const createCollage = require('@settlin/collage');

// FUNCTIONS FROM UTILS
const getLaulukirja = require(__dirname + '/utils/laulukirja');
const getBanters = require(__dirname + '/utils/banters');
const getFullEvents = require(__dirname + '/utils/events');
const { loadCatImage, loadDogImage } = require(__dirname +'/utils/loadImageAnimal');
const getCommitMsg = require(__dirname + '/utils/commitMsg');
const getMenu = require('./utils/semma.js');

var lk_obj;
var banters;
var elaimet = {
  kissat: 0,
  koirat: 0
};
var hytit = [];
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
  //commit_message = await getCommitMsg('matias-kovero/rooboot-bot');
};
/**  START ---  SEMMA RESTAURANTS --- */
bot.onText(supportedRestaurant, async msg => {
  const chatId = msg.chat.id;
  try {
    const restaurant = msg.text.split(/ |@/)[0].substring(1); // Take the restaurant name
    let obj = await getMenu(restaurant);
    let response = parseSemma(msg, obj);
    bot.sendMessage(chatId, response, {parse_mode: 'Markdown', disable_notification: true});
  } catch(error) {
    bot.sendMessage(chatId, 'Oi voi :( '+error.message, {disable_notification: true});
  }
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
        let longest = longestLine(laulu);
        responseTxt += '<b>'+center(laulu.numero+'. ' + laulu.nimi, longest+1) +'</b>\r\n\r\n'; // 1. Finlandia-hymni
        for(var sae of laulu.sanat) {
          sae = center(sae, longest);
          responseTxt += sae+'\r\n';
        }
      }
    }
  } else { // Haetaan nimellä
    for(var laulu of laulut) {
      if(laulu.nimi.toLowerCase().includes(haku.toLowerCase())) {
        let longest = longestLine(laulu);
        responseTxt += '<b>'+center(laulu.numero+'. ' + laulu.nimi, longest) +'</b>\r\n\r\n'; // 1. Finlandia-hymni
        for(var sae of laulu.sanat) {
          sae = center(sae, longest);
          responseTxt += sae+'\r\n';
        }
        break;
      }
    }
  }
  if(responseTxt == '') responseTxt = 'Ei löydy!';
  bot.sendMessage(chatId, responseTxt, {
    parse_mode: "HTML",
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
  return;
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
  return;
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
    bot.sendMessage(secret, response, {parse_mode: 'Markdown'});
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

/** START --- HYTIT --- */

bot.onText(/\/hytti\s\d\d\d\d/, async msg => {
  const chatId = msg.chat.id;
  let response = '';
  let param = msg.text.slice(7);
  let f_name = 'Risteilijä';
  let hytti_num;
  if(msg.chat.first_name != undefined) {
    f_name = msg.chat.first_name;
    msg.chat.last_name ? f_name += ' ' + msg.chat.last_name.charAt(0) : null;
  } // Priva
  else if(msg.from != undefined && msg.from.first_name) {
    f_name = msg.from.first_name;
    msg.from.last_name ? f_name += ' ' + msg.from.last_name.charAt(0) : null;
  } // Group
  else if(msg.chat.username != undefined) f_name = msg.chat.username; // Priva
  else if(msg.from != undefined && msg.from.username) f_name = msg.from.username; // Group
  if(param !== undefined) {
    hytti_num = parseInt(param.trim());
    if(Number.isInteger(hytti_num)) {
      if(hytti_num <= 99999) {
      let lisatty = false;
      hytit.forEach(hytti => {
        if(hytti.num === hytti_num) { 
          hytti.henk.push(f_name);
          lisatty = true;
          return true;
        }
      });
      if(!lisatty) {
        let hytti = {
          num: hytti_num,
          henk : [f_name]
        };
        hytit.push(hytti);
      };
      response = f_name+' liittyi hyttiin '+ hytti_num.toString().padStart(4, '0');
      } else response = 'Liian pitkä hyttinumero.'
    } else response = 'Tarkista hytin numero, esim /hytti 1234';
  } else response = 'Anna hytin numero, esim: /hytti 1234';
  bot.sendMessage(chatId, response);
});

bot.onText(/\/hyttirm\s\d\d\d\d/, async msg => {
  const chatId = msg.chat.id;
  let response = '';
  let param = msg.text.slice(9);
  let f_name = 'Risteilijä';
  let hytti_num;
  if(msg.chat.first_name != undefined) {
    f_name = msg.chat.first_name;
    msg.chat.last_name ? f_name += ' ' + msg.chat.last_name.charAt(0) : null;
  } // Priva
  else if(msg.from != undefined && msg.from.first_name) {
    f_name = msg.from.first_name;
    msg.from.last_name ? f_name += ' ' + msg.from.last_name.charAt(0) : null;
  } // Group
  else if(msg.chat.username != undefined) f_name = msg.chat.username; // Priva
  else if(msg.from != undefined && msg.from.username) f_name = msg.from.username; // Group
  if(param !== undefined) {
    hytti_num = parseInt(param.trim());
    if(Number.isInteger(hytti_num)) {
      if(hytti_num <=99999) {
        let poistettu = false;
        for(var i = 0; i < hytit.length; i++) {
          if(hytit[i].num === hytti_num) {
            let index = hytit[i].henk.indexOf(f_name);
            if(index !== -1) {
              hytit[i].henk.splice(index, 1);
              poistettu = true;
              response = f_name+' poistui hytistä '+ hytti_num.toString().padStart(4, '0');
              if(hytit[i].henk.length <= 0) {
                hytit.splice(i, 1);
              }
              break;
            }
          }
        }
        if(!poistettu) {
          response = 'Et ole hytissä ' + hytti_num.toString().padStart(4, '0');
        };
      } else response = 'Liian pitkä hyttinumero.';
    } else response = 'Tarkista hytin numero.'
  } else response = 'Tarkista hytin numero.';
  bot.sendMessage(chatId, response);
});

bot.onText(/\/hytit/, async msg => {
  const chatId = msg.chat.id;
  // Sort cabins
  if(hytit.length > 1) {
    hytit.sort((a, b) => a.num - b.num ); 
  };
  let response = '_Lemmenristeily 2019 hytit:_\r\n';
  for(var i = 0; i < hytit.length; i++) {
    response += '*' + hytit[i].num.toString().padStart(4, '0') +'*:';
    let div = '';
    hytit[i].henk.forEach(nimi => {
      response += div + nimi;
      div = ',';
    });
    response += '\r\n';
  }
  /*
  hytit.forEach(hytti => {
    response += '*' + hytti.num +'*:';
    let div = '';
    hytti.henk.forEach(nimi => {
      response += div + nimi;
      div = ',';
    });
    response += '\r\n';
  });*/
  bot.sendMessage(chatId, response, { parse_mode: "Markdown" });
});

bot.onText(/\/infoMe/, async msg => {
  const chatId = msg.chat.id;
  const username = msg.from.username;
  const f_name = msg.from.first_name;
  let response = 'Username:' + username;
  response += "Firstname: " + f_name;
  bot.sendMessage(chatId, response);
});
/** END --- HYTIT --- */

/** START --- PAPUNET --- */
bot.onText(/\/papu/, async msg => {
  const chatId = msg.chat.id;
  let msg_sent = await bot.sendMessage(chatId, 'Menee hetki, haen kuvat', {disable_notification: true});
  let images = [];
  try {
    let params = msg.text.split(' ');
    let paramText = '';
    params.shift(); // remove /papu
    if(params.length <= 0) {
      bot.editMessageText(`Ei sanoja haettavana...`, {chat_id: chatId, message_id: msg_sent.message_id});
    }
    for(var i = 0; i < params.length; i++) {
        bot.editMessageText(`${i}/${params.length} haettu...`, {chat_id: chatId, message_id: msg_sent.message_id});
        let img_url = await Papu.kuva(params[i]);
        images.push(img_url);
        paramText += params[i] + ' ';
    };
    const options = {
      sources : images,
      width: 2,
      height: Math.ceil(images.length/2),
      imageWidth: 100,
      imageHeight: 150,
      spacing: 2,
      lines: [
      ],
    };
    bot.editMessageText(paramText, {chat_id: chatId, message_id: msg_sent.message_id});
    var canvas = await createCollage(options);
    async function saveImg(response, destination) {
      return new Promise(resolve => {
        const file = fs.createWriteStream(destination)
        response.pipe(file)
        file.on('finish', () => file.close(resolve))
      });
    }
    await saveImg(canvas.pngStream(), './myFile.png');
    bot.sendPhoto(chatId, './myFile.png');
  } catch (err) {
    console.log(err);
    bot.editMessageText(err, {chat_id: chatId, message_id: msg_sent.message_id});
  } finally {
    if(images.length >= 1) {
      var canvas = await createCollage(options);
      async function saveImg(response, destination) {
        return new Promise(resolve => {
          const file = fs.createWriteStream(destination)
          response.pipe(file)
          file.on('finish', () => file.close(resolve))
        });
      }
      await saveImg(canvas.pngStream(), './myFile.png');
      bot.sendPhoto(chatId, './myFile.png');
    }
  }
})
/** END --- PAPUNET --- */

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
    //bot.sendMessage(chatId, message, { parse_mode: 'Markdown' });
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


function longestLine(laulu) {
  let longest = 0;
  let sanat = laulu.sanat;
  sanat.forEach(sae => {
    let lines = sae.split('\n');
    lines.forEach(line => {
      line.length > longest ? longest = line.length : null;
    });
  });
  return longest;
}

startBot();