# Rooboot - Telegram bot

[<p align="center"><img width="200" src="./docs/images/logo.png"></p>](./docs/images/logo.png)

[![https://telegram.me/Rooboot_bot](https://img.shields.io/badge/Chat%20with-Rooboot__Bot-blue.svg?logo=Telegram)](https://telegram.me/Rooboot_bot)
![Netlify](https://img.shields.io/netlify/cecd4c8e-d256-43a5-97e9-9d225157ef34?label=build&logo=Netlify)
![GitHub Workflow Status](https://img.shields.io/github/workflow/status/matias-kovero/rooboot-bot/Set%20Webhook?label=Set%20Webhook&logo=Github)
![GitHub Workflow Status](https://img.shields.io/github/workflow/status/matias-kovero/rooboot-bot/Daily%20comic?label=Daily%20Comic&logo=Github)

Built using [Telegraf](https://telegraf.js.org/) and hosted on [Netlify](https://www.netlify.com/).

## Table of contents
1. [Environment variables](#Environment-variables-and-secrets)
2. [How to dev](#How-to-dev)
    - [CLI commands](#Install-dependencies)
    - [Set bot webhook](#Set-bot-webhook)
    - [Creating modules](#Adding-own-modules)
3. [How to publish](#How-to-publish)
4. [Commands](#Current-commands)

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

export default async(ctx: TelegrafContext) => {
  await ctx.replyWithMarkdown(`Example reply from bot.`);
}
```

`src/bot.ts`
```ts
import exampleModule from './modules/example';

bot.command('example', (ctx) => exampleModule(ctx))
```

## How to publish
`git push` to this repo starts the build process on Netlify and the GitHub action takes care of setting the bot's webhook url
___

## Current commands
```
pukkiparty - send sticker from Pukkipack
tilaafp - subscribe for daily fingerpori
perufptilaus - unsubscribe from daily fingerpori
help - ask for help
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
##### Useful when updating commands with BotFather
