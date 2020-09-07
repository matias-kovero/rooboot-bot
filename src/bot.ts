import { Telegraf } from 'telegraf';
import { TelegrafContext } from 'telegraf/typings/context';
import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';

import helpModule   from './modules/help';
import semmaModule  from './modules/semma';

const token = process.env.BOT_TOKEN;
if(!token) throw new Error('Please add BOT_TOKEN to env variables.');

const bot = new Telegraf(token);

// If a module works on multiple commands, use RegExp to specify all commands to the module.
const semmaRestaurants = new RegExp(/\/(lozzi|maija|ylisto|belvedere|syke|piato|novelli|tilia|uno|rentukka|siltavouti|aimo|fiilu|ilokivi)(.(h$|yh$)|$|@+)/);

bot.help((ctx: TelegrafContext) => {
  return helpModule(ctx)
})

bot.hears(semmaRestaurants, (ctx: TelegrafContext) => {
  return semmaModule(ctx)
})

export async function handler(event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> {
  try {
    if(!event.body) throw new Error('Handler error.');
    await bot.handleUpdate(JSON.parse(event.body));
    return { statusCode: 200, body: '' };
  } catch (err) {
    return { statusCode: 500, body: err.toString() };
  }
}