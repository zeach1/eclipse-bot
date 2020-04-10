import Discord from 'discord.js';
import moment from 'moment-timezone';
import randomColor from 'randomcolor';

import { PREFIX } from '../config';
import * as logger from './logger';

/**
 * Gets usage for a command.
 * @param {!import('./command').Command} command Command information
 */
function getUsage(command) {
  let usage = `${PREFIX}${command.name}`;
  if (command.description !== undefined) {
    usage += ` ${command.usage}`;
  }
  return usage;
}

/**
 * Gets long description for a command.
 * @param {!import('./command').Command} command Command information
 */
function getLongDescription(command) {
  let description = `**Usage: ${getUsage(command)}**`;
  if (command.details !== undefined) {
    description += `\n\n${command.details}`;
  }

  return description;
}

/**
 * Run when client fails to send message.
 * @param {string} e Error reason
 */
function onSendError(e) {
  logger.error('Failed to send message', e);
}

/**
 * Sends embed to channel.
 * @param {!Discord.Message} message Message context
 * @param {Discord.MessageEmbedOptions} embedOptions Embed options to send to channel
 */
export async function sendEmbed(message, embedOptions) {
  const embed = new Discord.MessageEmbed({
    color: randomColor(),
    ...embedOptions,
  });

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

/**
 * Sends argument error embed to channel.
 * @param {!Discord.Message} message Message context
 * @param {!import('./command').Command} command Command information
 * @param {!string} [errorMessage] Error message
 */
export function sendArgumentError(message, command, errorMessage) {
  sendEmbed(message, {
    author: { name: '❌ Argument error' },
    color: 0xf06c00,
    description: `\
      **${errorMessage || 'Invalid argument(s) provided'}**
      For help type \`${PREFIX}help ${command.name}\`
    `,
    footer: { text: `Usage is ${getUsage(command)}` },
  });
}

/**
 * Sends help message for a specific command.
 * @param {!Discord.Message} message Message context
 * @param {!import('./command').Command} command Command information
 */
export function sendCommandHelp(message, command) {
  sendEmbed(message, {
    author: {
      name: `${command.name} Help`,
      iconURL: message.client.user.avatarURL,
    },
    description: getLongDescription(command),
    footer: `Requested by ${message.member.displayName}`,
    timestamp: moment().toDate(),
  });
}

export default {
  sendEmbed,
  sendRaw,
};
