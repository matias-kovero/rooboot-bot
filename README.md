# Rooboot - Telegram bot

## Environment variables and secrets

### GitHub Secrets

Set `BOT_TOKEN` and `BOT_URL` secrets. `BOT_URL` being the netlify live url.

### Netlify env variables

Set `BOT_TOKEN`, `MONGODB_USERNAME` and `MONGODB_PASSWORD`.

## How to dev

### Install dependencies

```bash
yarn install
```

### Start watching src files
```bash
yarn watch
```

### Start live dev server

```bash
yarn dev
```

This starts a public live session of [Netlify Dev](https://github.com/netlify/cli/blob/master/docs/netlify-dev.md).

### Set bot webhook

`https://api.telegram.org/bot{your-bot-api-token}/setWebhook?url={netlify-dev-url}/bot`

Go to above url in your browser and replace the token and the url. This tells the bot to call your dev instance instead of the live one.

### Adding own modules

`src/modules/example.ts`
```ts
import { TelegrafContext } from "telegraf/typings/context";
import { Message } from "telegraf/typings/telegram-types";

export default async(ctx: TelegrafContext): Promise<Message> => {
  return ctx.replyWithMarkdown(`Example`);
}
```

`src/bot.ts`
```ts
import exampleModule from './modules/example';

bot.hears('/example', (ctx: TelegrafContext) => {
  return exampleModule(ctx)
})
```

## How to publish
`git push` to this repo starts the build process on Netlify and the GitHub action takes care of setting the bot's webhook url
___

## Current commands
##### Useful to update commands to BotFather
```
help - ask for help
pukkiparty - send sticker from Pukkipack
lozzi - use optional [h, yh] 
maija - use optional [h, yh]
ylisto - use optional [h, yh]
belvedere - use optional [h, yh]
syke - use optional [h, yh]
piato - use optional [h, yh]
novelli - use optional [h, yh]
tilia - use optional [h,yh]
uno - use optional [h, yh]
rentukka - use optional [h, yh]
siltavouti - use optional [h, yh]
aimo - use optional [h, yh]
fiilu - use optional [h, yh]
ilokivi - use optional [h, yh]
```