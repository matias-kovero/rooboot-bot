import { TelegrafContext } from "telegraf/typings/context";

export default async(ctx: TelegrafContext) => {
  const pukki = await ctx.getStickerSet('Pukkipack');

  if(pukki.stickers.length) {
    const rng = Math.floor((Math.random() * pukki.stickers.length) + 1);
    await ctx.replyWithSticker(pukki.stickers[rng].file_id);
  } else await ctx.replyWithMarkdown('Sorry, unable to get Pukkipack stickers.');
}