var express = require("express");
var app = express();
var bodyParser = require('body-parser')
const TelegramBot = require('node-telegram-bot-api');
const TOKEN = process.env.TELEGRAM_TOKEN || '711574376:AAG5XYNeBgZhZO3jB5anMmgI_3c9LlopcU4';
const url = 'https://mk-telegram-bot.eu-gb.mybluemix.net';
var port = process.env.PORT || 3000;

// FUNCTIONS FROM UTILS
const semmaApi = require(__dirname + '/utils/semma');

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
    console.log("To view your app, open this link in your browser: http://localhost:" + port);
});


// Just to ping!
bot.on('message', msg => {
  bot.sendMessage(msg.chat.id, 'I am alive!');
});

// COMMAND /piato
bot.onText(/\/piato/, async (msg, match) => {      
  const chatId = msg.chat.id;
  var num = 0;
  let lause = msg.text.split(' ');
  if(lause[1] !== undefined) {
      if (lause[1].trim() === "h") num = 1; // HUOMENNA
      else if (lause[1].trim() === "yh") num = 2; // YLIHUOMENNA
  };
  var obj = await semmaApi();
  var restaurant_name = obj.RestaurantName;
  var week = obj.MenusForDays;

  var day = week[0];
  var open_time = day.LunchTime;
  var food = day.SetMenus;

  var dayTxt = "_Tänään_";
  if (num == 1) dayTxt = "_Huomenna_";
  else if (num == 2) dayTxt = "_Ylihuomenna_";
  var responseTxt = '*' + restaurant_name + '* ' + dayTxt + '\r\n';
  if (open_time !== null) {
    responseTxt += 'Lounas: ' + open_time + '\r\n';
    for (i = 0; i < food.length; i++) {
      responseTxt += '*' + food[i].Name + '* ';
      responseTxt += '_' + food[i].Price + '_\r\n';
      for (y = 0; y < food[i].Components.length; y++) {
        responseTxt += food[i].Components[y].replace('*', '\\*') + '\r\n';
      }
    }
  } else {
    responseTxt += "Kiinni :(";
  }
  bot.sendMessage(chatId, responseTxt, {parse_mode: 'Markdown'});
});