import { TelegrafContext } from "telegraf/typings/context";
import { MessageSticker, Message } from "telegraf/typings/telegram-types";

export default async(ctx: TelegrafContext): Promise<MessageSticker | Message> => {
  const pukki = await ctx.getStickerSet('Pukkipack');

  if(pukki.stickers.length) {
    const rng = Math.floor((Math.random() * pukki.stickers.length) + 1);
    return ctx.replyWithSticker(pukki.stickers[rng].file_id);
  } else return ctx.replyWithMarkdown('Sorry, unable to get Pukkipack stickers.');
}