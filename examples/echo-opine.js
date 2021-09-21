// DEBUG=* deno run --allow-read --allow-env --allow-net ./examples/echo-opine.js
'use strict';
import { linebot } from '../mod.ts'
import { opine, json } from "https://deno.land/x/opine@1.7.2/mod.ts";

const endpointToWebHook = 'webhook';
const options = {
   channelId: Deno.env.get('CHANNEL_ID'),
   channelSecret: Deno.env.get('CHANNEL_SECRET'),
   channelAccessToken: Deno.env.get('CHANNEL_ACCESS_TOKEN'),
   verify: true
};
const bot = linebot(options);
const app = opine();
const linebotParser = bot.parser(json);

app.post(`/${endpointToWebHook}`, linebotParser);

bot.on('message', async (event) => {
   try {
      let result = await event.reply(event.message.text);
      // Do something here as success
      console.log('Success', result);
   } catch (error) {
      // Do something here to deal with error
      console.log('Error', error);
   }
});

const port = parseInt(Deno.env.get('PORT')) || 80;
app.listen(port, () => console.log('LineBot is running. Port : ' + port));