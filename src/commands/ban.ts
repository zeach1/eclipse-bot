import { Message } from 'discord.js';

import Command from '../struct/command';
import { sendImages } from '../util/sendMessage';

async function ban(message: Message): Promise<Message> {
  await sendImages(message, {
    url: 'https://i.imgur.com/WOjy315.gif',
  });

  return message;
}

const Ban = new Command({
  name: 'ban',
  description: 'You can ban?',
  type: 'misc',
  run: ban,
});

export default Ban;
