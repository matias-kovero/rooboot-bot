import { Telegraf } from 'telegraf';
import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';

import helpModule   from './modules/help';
import semmaModule  from './modules/semma';
import pukkiModule  from './modules/pukki';
import fpModule     from './modules/fingerpori';


const token = process.env.BOT_TOKEN;
if(!token) throw new Error('Please add BOT_TOKEN to env variables.');

export const bot = new Telegraf(token, { username: 'Rooboot_bot'} );

// If a module works on multiple commands, use String[] to specify all commands to the module.
const semmaRestaurants    = ['lozzi', 'maija', 'ylisto', 'belvedere', 'syke', 'piato', 'novelli', 'tilia', 'rentukka', 'siltavouti', 'aimo', 'fiilu', 'ilokivi'];
const fingerporiCommands  = ['tilaafp', 'perufptilaus'];

bot.help((ctx) => helpModule(ctx))

bot.command(semmaRestaurants,   (ctx) => semmaModule(ctx))
bot.command('pukkiparty',       (ctx) => pukkiModule(ctx))
bot.command(fingerporiCommands, (ctx) => fpModule(ctx))

export async function handler(event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> {
  try {
    if(!event.body) throw new Error('Handler error.');
    await bot.handleUpdate(JSON.parse(event.body));
    return { statusCode: 200, body: '' };
  } catch (err) {
    return { statusCode: 200, body: err.toString() };
  }
}