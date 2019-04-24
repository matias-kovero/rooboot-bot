# Rooboot_bot

[![https://telegram.me/hupikalja_bot](https://img.shields.io/badge/💬%20Telegram-HupiKalja__Bot-blue.svg)](https://telegram.me/hupikalja_bot)

--------------------
Wrapper documentation: [Node-telegram-bot-api]

--------------------
[Node-telegram-bot-api]: <https://github.com/yagop/node-telegram-bot-api/blob/master/doc/api.md>

### Installation

Rooboot-bot requires [Node.js](https://nodejs.org/) v8+ to run.

Install the dependencies and start the server.
```sh
$ npm install
$ npm start
```

--------------------
### Supported commands

| Command | Parameters [optional] | Example command | Returns |
| ------- | --------------------- | --------------- | --------|
| /{restaurant} | [h, yh] |/piato h| Gives the menu of the restaurant |
| /tapahtumat |  | /tapahtumat |Gives all events from dummpi.fi/tapahtumat |
| /laulu | song name or song number |/laulu 2 | Gives the song lyrics |
| /laulukategoriat |  | /laulukategoriat | Returns all categories of songs |
#

#### Restaurants
The bot supports these restaurants:
> /piato /lozzi /maija /libri /tilia /syke /rentukka /ylisto /fiilu /ilokivi
#

#### Songs
As for now the bot supports:
> Lookup with song number (0 - 92)
> Lookup with partial or full song name.
#

--------------------
