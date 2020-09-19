import { Telegraf } from 'telegraf';
import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
// https://dev.to/akhilaariyachandra/create-a-serverless-api-with-typescript-graphql-and-mongodb-48dk
import webRequest from './utils/webRequest';
import { IFingerporiChat } from './utils/database/models/fingerpori';
import { getChats } from './utils/database/queries/fingerpori';

interface Fingerpori {
  publication_date: string,
  image: {
    small: string,
    big: string,
  },
  copyright: string,
};

const token = process.env.BOT_TOKEN;
if(!token) throw new Error('Please add BOT_TOKEN to env variables.');

const fingerpori_url = 'https://fingerpori.vercel.app/daily';

const bot = new Telegraf(token);

const sendDailyComic = async(): Promise<number> => {
  // Get our Fingerpori comic
  const data: Fingerpori = await webRequest(fingerpori_url);
  // Get all chats where we want to send our comic strip.
  const chats: IFingerporiChat[] = await getChats();

  chats.forEach(chat => {
    bot.telegram.sendPhoto(chat.chat_id, data.image.big);
  });

  return chats.length;
}

export async function handler(event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> {
  try {
    const count = await sendDailyComic();
    return { statusCode: 200, body: `Affected ${count} chat(s).` };
  } catch (err) {
    return { statusCode: 500, body: err.toString() };
  }
}