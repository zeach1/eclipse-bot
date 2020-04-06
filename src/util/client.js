import { Client } from 'discord.js';

import { SUBREDDIT_URL } from '../config/index';
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

const client = new Client();

function onReady() {
  client.user.setPresence(PRESENCE);
}

function onLoginFailure(e) {
  logger.error(`Failed to login\n ${e}`);
}

export function startClient() {
  client.on('ready', () => onReady());
  client.login(BOT_TOKEN).catch((e) => onLoginFailure(e));

  logger.info('Client connected');
}

export default {
  startClient,
};
