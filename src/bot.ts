import { Telegraf } from 'telegraf';
import { TelegrafContext } from 'telegraf/typings/context';
import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';

import helpModule   from './modules/help';

const bot = new Telegraf(process.env.BOT_TOKEN!);

bot.help((ctx: TelegrafContext) => {
  return helpModule(ctx)
})

export async function handler(event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> {
  try {
    await bot.handleUpdate(JSON.parse(event.body!));
    return { statusCode: 200, body: '' };
  } catch (err) {
    return { statusCode: 500, body: err.toString() };
  }
}