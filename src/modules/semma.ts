import { TelegrafContext } from "telegraf/typings/context";
import { Message } from "telegraf/typings/telegram-types";
import webRequest from '../utils/webRequest';

interface SemmaData {
  /**
   * Restaurants full name
   */
  RestaurantName?: string,
  /**
   * Restaurants home page.
   */
  RestaurantUrl?: string,
  /**
   * Unknown. Not in use at the moment.
   * @deprecated
   */
  PriceHeader?: null,
  /**
   * Restaurants menu footer text.
   */
  Footer?: string,
  /**
   * Restaurants weekly menu.  
   * Shows only the remaining days of the week, including today.
   */
  MenusForDays?: Array<DailyMenu>
}

interface DailyMenu {
  /**
   * The date when menu is served.
   */
  Date?: string,
  /**
   * The time when the restaurant serves lunch.  
   * When it is null it means the restaurant is closed.
   */
  LunchTime?: string | null,
  /**
   * All the dishes included in the menu.
   */
  SetMenus: Array<SemmaMenu>
}

interface SemmaMenu {
  /**
   * Unknown. No real usage, as values are always 0.
   * @deprecated
   */
  SortOrder?: number,
  /**
   * The type of the menu, ex. Vegeterian, Dessert, Lunch
   */
  Name?: string,
  /**
   * Price of the menu. If it has multiple prices, prices are usually separated with /  
   * Ex. 2,80 / 5,80 / 7,90
   */
  Price?: string,
  /**
   * All the different disches in this menu.
   */
  Components: Array<string>
}

const urls: Record<string, string> = {
  lozzi:      'https://www.semma.fi/modules/json/json/Index?costNumber=1401&language=fi',
  maija:      'https://www.semma.fi/modules/json/json/Index?costNumber=1402&language=fi',
  ylisto:     'https://www.semma.fi/modules/json/json/Index?costNumber=1403&language=fi',
  //kvarkki:  'https://www.semma.fi/modules/json/json/Index?costNumber=140301&language=fi',
  belvedere:  'https://www.semma.fi/modules/json/json/Index?costNumber=1404&language=fi',
  syke:       'https://www.semma.fi/modules/json/json/Index?costNumber=1405&language=fi',
  piato:      'https://www.semma.fi/modules/json/json/Index?costNumber=1408&language=fi',
  novelli:    'https://www.semma.fi/modules/json/json/Index?costNumber=1409&language=fi',
  tilia:      'https://www.semma.fi/modules/json/json/Index?costNumber=1413&language=fi',
  //libri:    'https://www.semma.fi/modules/json/json/Index?costNumber=141301&language=fi',
  uno:        'https://www.semma.fi/modules/json/json/Index?costNumber=1414&language=fi',
  rentukka:   'https://www.semma.fi/modules/json/json/Index?costNumber=1416&language=fi',
  siltavouti: 'https://www.amica.fi/modules/json/json/Index?costNumber=0321&language=fi',
  aimo:       'https://www.fazerfoodco.fi/modules/json/json/Index?costNumber=0350&language=fi',
  fiilu_s:    'https://www.fazerfoodco.fi/modules/json/json/Index?costNumber=3364&language=fi',
  fiilu:      'https://fiilu-scraper.now.sh/lunch/week',
  ilokivi:    'https://ilokivi-scraper.now.sh/lunch/today?semmaFormat=true',
};

const getMenu = async(restaurant: string): Promise<SemmaData> => {
  // Maybe add additional logic? check errors etc.
  return await webRequest(urls[restaurant]);
}

const parseSemma = (data: SemmaData, ctx: TelegrafContext): string => {
  let num = 0;
  const lause = ctx.message?.text?.split(' ') ?? '';
  // Check users input, should it be today, tomorrow or the day after tomorrow.
  lause[1] ? (lause[1] === 'h' ? num = 1 : num = 2): num = 0;
  
  const restaurant_name = data.RestaurantName;
  const week = data.MenusForDays;
  
  if(!week || !week[0] ) {
    return 'Listaa ei ole saatavilla';
  } else if(!week[num]) return 'Lista ei ole vielä tiedossa';
  const day = week[num];
  
  const open_time = day.LunchTime;
  const food = day.SetMenus;
  
  const dayTxt = num != 0 ? (num == 1 ? '_Huomenna_':'_Ylihuomenna_') : '_Tänään_';
  let responseTxt = '*' + restaurant_name + '* ' + dayTxt + '\r\n';
  // remove duplicate SetMenus ex. "Lounas" 2 times in a row
  let lastMenu = "";

  if (open_time) {
    responseTxt += 'Lounas: ' + open_time + '\r\n';
    for (let i = 0; i < food.length; i++) {
      if(food[i].Name || food[i].Name !== lastMenu) {
        responseTxt += '*' + food[i].Name + '* ';
        responseTxt += '_' + food[i].Price + '_\r\n';
        lastMenu = food[i].Name ?? '';
      }
      for (let y = 0; y < food[i].Components.length; y++) {
        const dish = food[i].Components[y].replace('()', '');
        responseTxt += dish.replace('*', '\\*') + '\r\n';
      }
    }
  } else {
    responseTxt += "Kiinni";
  }
  return responseTxt;
}

export default async(ctx: TelegrafContext): Promise<Message> => {
  try {
    // Take the restaurant name
    const restaurant = ctx.message?.text?.split(/ |@/)[0].substring(1) ?? '';
    // Get the menu
    const menu = await getMenu(restaurant);
    // Create our response
    const response = parseSemma(menu, ctx);
    
    return ctx.replyWithMarkdown(response, { disable_notification: true });
  } catch (err) {
    return ctx.replyWithMarkdown(`*Brrts*⚙️ \r\n${err.message}`, { disable_notification: true });
  }
}