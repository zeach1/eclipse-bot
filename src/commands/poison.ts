import { Message } from 'discord.js';

import Command from '../struct/command';
import { sendImages } from '../util/sendMessage';

async function poison(message: Message): Promise<Message> {
  await sendImages(message, [
    { url: 'https://i.imgur.com/RG0lRA1.png' },
    {
      url: 'https://i.imgur.com/7hJSaQK.png',
      delay: 3000,
    },
    {
      url: 'https://i.imgur.com/sDIsfhj.png',
      delay: 4000,
    },
    {
      url: 'https://i.imgur.com/zi1QV9r.png',
      delay: 2000,
    },
  ]);

  return message;
}

const Poison = new Command({
  name: 'poison',
  description: 'Can you properly kill the clan castle troops?',
  type: 'misc',
  run: poison,
});

export default Poison;
