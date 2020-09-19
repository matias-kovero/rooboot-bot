import { TelegrafContext } from "telegraf/typings/context";
import { Message } from "telegraf/typings/telegram-types";
import { addChat, removeChat } from '../utils/database/queries/fingerpori';

export default async(ctx: TelegrafContext): Promise<Message> => {
  const chat_id = ctx.chat?.id.toString();
  const text = ctx.message.text;
  let message = '*Brrts*⚙️ \r\nBroke my code.';

  switch(text) {
    case '/tilaafp':
      const status = await addChat(chat_id);
      const t = new Date(); 
      message = status != null ? `You are already subcribed for daily comics!` : `You are now subcribed for daily comics :)`;
      message += `\r\nThey should arrive @ _06:00 UTC_\r\nTime now: _${t.getUTCHours()}:${t.getUTCMinutes()} UTC_`;
      break;
    case '/perufptilaus':
      const response = await removeChat(chat_id);
      message = response.deletedCount > 0 ? `Removed this chat from daily comics!` : `Silly, you should subscribe first ;)`;
      break;
    default: // Something is seriosly broken if we land here.
      break;
  }

  return ctx.replyWithMarkdown(message, { disable_notification: true });
}