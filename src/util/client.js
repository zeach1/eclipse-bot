import Discord from 'discord.js';

import { SUBREDDIT_URL, PREFIX } from '../config/index';
import { executeCommand } from './command';
import logger from './logger';

const { BOT_TOKEN } = process.env;
const PRESENCE = {
  status: 'online',
  activity: {
    type: 'WATCHING',
    name: 'the Eclipse',
    url: SUBREDDIT_URL,
  },
};

const client = new Discord.Client();

/**
 * Called once client is online.
 */
function onReady() {
  client.user.setPresence(PRESENCE);
}

/**
 * Called whenever the client sees a message sent.
 * @param {Discord.Message} message
 */
function onMessage(message) {
  if (message.content.startsWith(PREFIX)) {
    executeCommand(message);
  }
}

export function startClient() {
  client.on('ready', () => onReady());
  client.on('message', (message) => onMessage(message));

  client.login(BOT_TOKEN).catch((e) => logger.error(`Failed to login - ${e}`));
  logger.info('Client connected');
}

export default {
  startClient,
};
