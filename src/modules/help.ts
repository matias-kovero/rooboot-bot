import { TelegrafContext } from "telegraf/typings/context";
import { Message } from "telegraf/typings/telegram-types";

export default async(ctx: TelegrafContext): Promise<Message> => {
  return ctx.replyWithMarkdown(`*Need help?* \r\nCan't help you, sorry.`);
}