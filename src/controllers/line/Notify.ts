import { Client } from '@line/bot-sdk';
import axios from 'axios';
import querystring from 'query-string';
import { IHouse } from '../../interfaces/models/House';
import Locals from '../../providers/Locals';
import { Words } from '../../utils/Words';

class Notify {
  public static async push(message: IHouse, notifyToken: string) {
    const title = `名稱： ${message.title}`;
    const kindName = `類型： ${message.kindName}`;
    const room = `格局： ${message.room}`;
    const floor = `樓層： ${message.floor}`;
    const price = `租金： ${message.price}`;
    const section = `地區： ${message.section}`;
    const area = `坪數： ${message.area}`;
    const url = `https://rent.591.com.tw/home/${message.pId}`;

    const qs = querystring.stringifyUrl({
      url: 'https://notify-api.line.me/api/notify',
      query: {
        message: `\n${title}\n${kindName}\n${room}\n${floor}\n${price}\n${section}\n${area}\n${url}`,
      },
    });

    try {
      const res = await axios.post(
        qs,
        {},
        {
          headers: {
            Authorization: `Bearer ${notifyToken}`,
          },
        }
      );

      return res.data;
    } catch (error) {
      if (error instanceof Error) {
        console.log(Error);
      }
      console.log(error);
    }
  }

  public static async refresh(replyToken: string) {
    const client = new Client(Locals.config().lineConfig);
    await axios.get(`${Locals.config().url}/api/refresh_token`);

    await client.replyMessage(replyToken, {
      type: 'text',
      text: Words.FRESH_TOKEN,
    });
  }
}

export default Notify;
