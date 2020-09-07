import { TelegrafContext } from "telegraf/typings/context";

export default async(ctx: TelegrafContext) => {
  return ctx.replyWithMarkdown(`*Need help?* \r\nCan't help you, sorry.`);
}