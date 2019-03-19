import { Client } from 'discord.js';
import dotenv from 'dotenv';
import { tz } from 'moment-timezone';

import { timeZone } from './config/index';
import ping from './util/ping';

// Load environment variables if project is not running from Glitch, otherwise run ping script.
if (!process.env.PROJECT_DOMAIN) {
  dotenv.config();
} else {
  ping();
}

tz.setDefault(timeZone);

const client = new Client();

function ready(): void {
  client.user.setActivity('with TypeScript', { type: 'PLAYING' });
}

client.on('ready', ready);

client.login(process.env.BOT_TOKEN);
