import Discord from 'discord.js';

import * as logger from './logger';

/**
 * Run when client fails to send message.
 * @param {string} e Error reason
 */
function onSendError(e) {
  logger.error('Failed to send message', e);
}

/**
 *
 * @param {!Discord.Message} message Message context
 * @param {Discord.MessageEmbedOptions} embedOptions Embed options to send to channel
 */
export async function sendEmbed(message, embedOptions) {
  const embed = new Discord.MessageEmbed(embedOptions);
  await message.channel.send(embed).catch((e) => onSendError(e));
}

/**
 * Sends raw message to channel.
 * @param {Discord.Message} message Message context
 * @param {string} content Content to send to channel
 */
export async function sendRaw(message, content) {
  await message.channel.send(content).catch((e) => onSendError(e));
}

export default {
  sendEmbed,
  sendRaw,
};
