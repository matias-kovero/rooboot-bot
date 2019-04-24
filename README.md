# Rooboot_bot

[![https://telegram.me/hupikalja_bot](https://img.shields.io/badge/💬%20Telegram-HupiKalja__Bot-blue.svg)](https://telegram.me/hupikalja_bot)

Wrapper documentation: [Node-telegram-bot-api]

--------------------
[Node-telegram-bot-api]: <https://github.com/yagop/node-telegram-bot-api/blob/master/doc/api.md>

### Installation

Rooboot-bot requires [Node.js](https://nodejs.org/) v8+ to run.

Install the dependencies and start the server.
```sh
 npm install
 npm start
```

--------------------
### Supported commands

| Command | Parameters [optional] | Example  | Returns |
| ------- | --------------------- | --------------- | --------|
| /{restaurant} | [h, yh] |/piato h| Gives the menu of the restaurant |
| /tapahtumat |  | /tapahtumat | Gives all the events from [dumppi.fi/tapahtumat](https://dumppi.fi/tapahtumat) |
| /laulu | song name or song number |/laulu 2 | Gives the song lyrics |
| /laulukategoriat |  | /laulukategoriat | Returns all categories of songs |
| /vappubanger | | /vappubanger | Plays [Vappubängeri 2019](https://soundcloud.com/narborjar/vappubangeri-2019/s-6puLq) |
#

#### Restaurants
The bot supports these restaurants:
> /piato /lozzi /maija /libri /tilia /syke /rentukka /ylisto /fiilu /ilokivi
#

#### Songs
As for now the bot supports:
> Lookup with song number (0 - 92).  
> Lookup with partial or full song name.  

## TODO:
- Create inline buttons for song categories
	> (Show all categories -> select categorie -> show all songs on that categorie -> Select song)
- Add commands for dog & cat pictures (/koira & /kissa)
	> These commands would send an random image of the selected animal
- Banters?
