import { TelegrafContext } from "telegraf/typings/context";
import { Message } from "telegraf/typings/telegram-types";
import { addChat, removeChat } from '../utils/database/queries/fingerpori';

export default async(ctx: TelegrafContext): Promise<Message> => {
  const chat_id = ctx.chat?.id.toString();
  const text = ctx.message.text;
  let message;

  switch(text) {
    case '/tilaafp':
      const status = await addChat(chat_id);
      const state = status != null ? 'already' : 'now';
      const t = new Date();
      message = `You are ${state} subcribed for daily comics!\r\nThey should arrive ~ _06:00 UTC_\r\nTime now: _${t.getUTCHours()}:${t.getUTCMinutes()} UTC_`;
      break;
    case '/perufptilaus':
      const response = await removeChat(chat_id);
      message = response.deletedCount > 0 ? `Removed this chat from daily comics!` : `Silly, you should subscribe first ;)`;
      break;
    default: // Something is seriosly broken if we land here.
      message = '*Brrts*⚙️ \r\nBroke my code.';
      break;
  }

  return ctx.replyWithMarkdown(message, { disable_notification: true });
}