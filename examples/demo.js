// DEBUG=* deno run --allow-read --allow-env --allow-net ./examples/demo.js
'use strict';
import { linebot } from '../mod.ts'
import { opine, json } from "https://deno.land/x/opine@1.8.0/mod.ts";
import { bold, cyan, green, yellow } from "https://deno.land/std@0.107.0/fmt/colors.ts";
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

bot.on('message', async function (event) {
   let result;
   if (event.message.type === 'text') {
      console.log(bold(yellow(`event.message.type = ${event.message.type} - ${event.message.text}`)));
   } else {
      console.log(bold(green(`event.message.type = ${event.message.type}`)));
   }
   switch (event.message.type) {
      case 'text':
         switch (event.message.text) {
            case 'Me':
               result = await event.source.profile();
               return event.reply(JSON.stringify(result));

            case 'Member':
               result = await event.source.member();
               return event.reply(JSON.stringify(result));

            case 'Picture':
               return event.reply({
                  type: 'image',
                  originalContentUrl: 'https://d.line-scdn.net/stf/line-lp/family/en-US/190X190_line_me.png',
                  previewImageUrl: 'https://d.line-scdn.net/stf/line-lp/family/en-US/190X190_line_me.png'
               });

            case 'Location':
               return event.reply({
                  type: 'location',
                  title: 'LINE Plus Corporation',
                  address: '1 Empire tower, Sathorn, Bangkok 10120, Thailand',
                  latitude: 13.7202068,
                  longitude: 100.5298698
               });

            case 'Push':
               return bot.push(
                  'Cedb278e86630179f19a395f9f7984a62',
                  ['Hey!', 'สวัสดี ' + String.fromCharCode(0xD83D, 0xDE01)]);

            case 'Push2':
               return bot.push('Cedb278e86630179f19a395f9f7984a62', 'Push to group');

            case 'Multicast':
               return bot.push(
                  [
                     'U480e5cd6a126659e6b07b95661882ee1',
                     'Cedb278e86630179f19a395f9f7984a62'
                  ],
                  'Multicast!');

            case 'Broadcast':
               bot.broadcast('Broadcast!');
               break;

            case 'Confirm':
               return event.reply({
                  type: 'template',
                  altText: 'this is a confirm template',
                  template: {
                     type: 'confirm',
                     text: 'Are you sure?',
                     actions: [{
                        type: 'message',
                        label: 'Yes',
                        text: 'yes'
                     }, {
                        type: 'message',
                        label: 'No',
                        text: 'no'
                     }]
                  }
               });

            case 'Multiple':
               return event.reply(['Line 1', 'Line 2', 'Line 3', 'Line 4', 'Line 5']);

            case 'GetTotalMessagesInsight':
               result = await bot.getTotalMessagesInsight();
               return event.reply(JSON.stringify(result));

            case 'GetTotalFollowersInsight':
               result = await bot.getTotalFollowersInsight();
               return event.reply(JSON.stringify(result));

            case 'GetFriendDemographicsInsight':
               result = await bot.getFriendDemographicsInsight();
               return event.reply(JSON.stringify(result));

            case 'TotalFollowers':
               result = await bot.getTotalFollowers();
               return event.reply(JSON.stringify(result));

            case 'Quota':
               result = await bot.getQuota();
               return event.reply(JSON.stringify(result));

            case 'GetTotalSentMessagesThisMonth':
               result = await bot.getTotalSentMessagesThisMonth();
               return event.reply(JSON.stringify(result));

            case 'TotalReply':
               result = await bot.getTotalReplyMessages();
               return event.reply(JSON.stringify(result));

            case 'GetBotInfo':
               result = await bot.getBotInfo();
               return event.reply(JSON.stringify(result));

            case 'GetGroupProfile':
               result = await bot.getGroupProfile('Cedb278e86630179f19a395f9f7984a62');
               return event.reply(JSON.stringify(result));

            case 'GetRoomMembersCount':
               result = await bot.getRoomMembersCount('Bba70ba25dafbd6a1472c655fe22970c1');
               return event.reply(JSON.stringify(result));

            case 'GetGroupMembersCount':
               result = await bot.getGroupMembersCount('Cedb278e86630179f19a395f9f7984a62');
               return event.reply(JSON.stringify(result));

            case 'GetIssueLinkToken':
               result = await bot.getIssueLinkToken('U480e5cd6a126659e6b07b95661882ee1');
               return event.reply(JSON.stringify(result));

            default:
               try {
                  result = await event.reply(event.message.text);
                  console.log('Success', result);
               } catch (error) {
                  console.log('Error', error);
               }
               break;
         }
         break;
      case 'image':
         result = await event.message.content();
         return event.reply('Nice picture! ' + result.toString('hex').substring(0, 32));

      case 'video':
         result = await event.message.content();
         return event.reply('Nice video!' + result.toString('hex').substring(0, 32));

      case 'audio':
         result = await event.message.content();
         return event.reply('Nice audio!' + result.toString('hex').substring(0, 32));

      case 'location':
         return event.reply(['That\'s a good location!',
            'Lat:' + event.message.latitude,
            'Long:' + event.message.longitude
         ]);

      case 'sticker':
         return event.reply({
            type: 'sticker',
            packageId: 1,
            stickerId: 1
         });

      default:
         return event.reply('Unknown message: ' + JSON.stringify(event));
   }
});

bot.on('follow', function (event) {
   event.reply('follow: ' + event.source.userId);
});

bot.on('unfollow', function (event) {
   event.reply('unfollow: ' + event.source.userId);
});

bot.on('join', function (event) {
   if (event.source.groupId) {
      event.reply('join group: ' + event.source.groupId);
   }
   if (event.source.roomId) {
      event.reply('join room: ' + event.source.roomId);
   }
});

bot.on('leave', function (event) {
   if (event.source.groupId) {
      console.log('leave group: ' + event.source.groupId);
   }
   if (event.source.roomId) {
      console.log('leave room: ' + event.source.roomId);
   }
});

bot.on('memberJoined', async function (event) {
   let result = await event.joined.profiles();

   if (event.source.type === 'group') {
      await event.reply('memberJoined: Welcome to the group.');
   }
   if (event.source.type === 'room') {
      event.reply('memberJoined: Welcome to the room.');
   }
   console.log(result);
});

bot.on('memberLeft', async function (event) {
   let result = await event.left.profiles();

   if (event.source.type === 'group') {
      console.log('memberLeft: Left the group, goodbye.');
   }
   if (event.source.type === 'room') {
      console.log('memberLeft: Left the room, goodbye.');
   }
   console.log(result);
});

bot.on('postback', function (event) {
   event.reply('postback: ' + event.postback.data);
});

bot.on('beacon', function (event) {
   event.reply('beacon: ' + event.beacon.hwid);
});

const port = parseInt(Deno.env.get('PORT')) || 80;
app.listen(port, () => console.log(bold(cyan(`LineBot is running. Port : ${port}`))));