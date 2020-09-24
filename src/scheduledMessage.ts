import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import webRequest from './utils/webRequest';
import { IFingerporiChat } from './utils/database/models/fingerpori';
import { getChats } from './utils/database/queries/fingerpori';
import { bot } from './bot';

interface ComicData {
  publication_date: string,
  image: {
    small: string,
    big: string,
  },
  copyright: string,
};

const fingerpori_url = 'https://hs-comics.vercel.app/fingerpori';

const sendDailyComic = async(): Promise<number> => {
  // Get our Fingerpori comic
  console.timeLog('trackTime', `> Getting images from api...`);
  const data: ComicData = await webRequest(fingerpori_url);
  // Get all chats where we want to send our comic strip.
  console.timeLog('trackTime', `> Getting subscribed chats from DB...`);
  const chats: IFingerporiChat[] = await getChats();

  console.timeLog('trackTime', `> Sending images to chats...`);
  const promises = chats.map(chat => bot.telegram.sendPhoto(chat.chat_id, data.image.big));
  await Promise.all(promises);
  
  return chats.length;
}

export async function handler(event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> {
  try {
    console.time('trackTime');

    console.timeLog('trackTime', `> Starting scheduled functions...`);
    const count = await sendDailyComic();
    console.timeLog('trackTime', `> Sent to ${count} chat(s).`);

    console.timeEnd('trackTime');
    return { statusCode: 200, body: `Affected ${count} chat(s).` };
  } catch (err) {
    return { statusCode: 500, body: err.toString() };
  }
}