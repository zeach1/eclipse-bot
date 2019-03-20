import { Client } from 'discord.js';
import { config } from 'dotenv';
import Enmap from 'enmap';
import { tz } from 'moment-timezone';

import { timeZone } from './config/index';
import Rank from './struct/rank';
import { processMessage } from './util/handleMessage';
import ping from './util/ping';

// Load environment variables if project is running locally, ping if project is running in Glitch.
if (!process.env.PROJECT_DOMAIN) {
  config();
} else {
  ping();
}

// Set time zome for bot.
tz.setDefault(timeZone);

const client = new Client();

// Set up ranks for all users.
const ranks = new Enmap<string, Rank>({
  name: 'ranks',
});

function ready(): void {
  client.user.setActivity('with TypeScript', { type: 'PLAYING' });
}

// Callback when bot logins.
client.on('ready', ready);

// Callback every time a message is sent in chat (any chat).
client.on('message', message => processMessage(message, ranks));

client.login(process.env.BOT_TOKEN);
