import {
  Attachment, Collection, Message, MessageEmbed,
} from 'discord.js';

import { prefix } from '../config/index';
import { Command, DummyCommand } from '../struct/command';
import { ImageOptions, MessageEmbedOptions } from '../struct/message';

// Object of embed type to their color.
const colorGenerator = {
  default: 0xfff,
  argumentError: 0xf06c00,
};

/*
 * Collection of channels that the bot is currently sending images in.
 * The bot should not interrupt a sequence of images with another in the same channel.
 */
const workingChannels = new Collection();

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

export async function sendEmbed(message: Message, options: MessageEmbedOptions): Promise<void> {
  const embed = new MessageEmbed(message, options);

  await message.channel.send({ embed }).catch(() => {});
}

export async function sendArgumentError(
  message: Message, command: Command | DummyCommand, field?: { name?: string; value?: string },
): Promise<void> {
  await sendEmbed(message, {
    color: colorGenerator.argumentError,
    fields: [{
      name: field && field.name ? field.name : 'Argument usage is incorrect',
      value: field && field.value ? field.value : `Proper usage is ${prefix}${command.getName()} ${command.getUsage()}`,
    }],
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

export default {
  sendEmbed,
  sendArgumentError,
  sendImages,
};
