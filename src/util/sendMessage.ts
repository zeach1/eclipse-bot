import {
  Attachment, Collection, Message, MessageEmbed,
} from 'discord.js';

import { ImageOptions, MessageEmbedOptions } from '../struct/message';

/*
 * Collection of channels that the bot is currently sending images in.
 * The bot should not interrupt a sequence of images with another in the same channel.
 */
const workingChannels = new Collection();

function generateEmbed(message: Message, options: MessageEmbedOptions): MessageEmbed {
  return new MessageEmbed(message, options);
}

export function sendMessage(message: Message, options: MessageEmbedOptions): void {
  const embed = generateEmbed(message, options);

  message.channel.send({ embed }).catch(() => {});
}

function sendImage(message: Message, options: ImageOptions): Promise<void | Message | Message[]> {
  return new Promise((resolve) => {
    setTimeout(() => {
      const attachment = new Attachment(options.url);

      resolve(
        message.channel.send(options.content || '', attachment).catch(() => {}),
      );
    }, options.delay || 0);
  });
}

export async function sendImages(
  message: Message, options: ImageOptions | ImageOptions[],
): Promise<void> {
  // Exits if images are still sending for specific channel.
  if (workingChannels.has(message.channel.id)) return;

  // Adds the channel to working channels until sequence of images are done sending.
  workingChannels.set(message.channel.id, message.channel);

  if (!(options instanceof Array)) {
    await sendImage(message, options);
    workingChannels.delete(message.channel.id);
    return;
  }

  /*
   * Send images one at a time with delay, we disable no-await since images need
   * to send in correct order.
   */
  for (let i = 0; i < options.length; i += 1) {
    await sendImage(message, options[i]); // eslint-disable-line no-await-in-loop
  }

  workingChannels.delete(message.channel.id);
}

export default { sendMessage };
