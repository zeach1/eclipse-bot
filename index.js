/* Allows bot to stay on through Glitch */
require('./misc/ping.js');

/* Imports */
const Discord = require('discord.js');
const Enmap = require('enmap');
const EnmapLevel = require('enmap-level');
const fs = require('fs');

const { token } = require('./data/config.js');

const commandHandler = require('./helper/commandHandler.js');
const messenger = require('./helper/messenger.js');
const pointManager = require('./helper/pointManager.js');

const client = new Discord.Client();

/* Set up PERSISTENT (will not delete itself when system restarts) point and ranking system */

const pointsProvider = new EnmapLevel({ name: 'points' });
client.points = new Enmap({ provider: pointsProvider });

/* Set up command list */
client.commands = new Discord.Collection();
for (const file of fs.readdirSync('./commands')) {
  const command = require(`./commands/${file}`);
  client.commands.set(command.name, command);
}

/* When connected */
client.on('ready', () => {
   console.log('Connected.');
   client.user.setActivity('プレインエイジア', { type: 'LISTENING' });
});

/* When new member joins the server */
client.on('guildMemberAdd', member => messenger.sendWelcomeMessage(member).catch(e => console.log(e)));

/* When member leaves the server */

client.on('guildMemberRemove', member => {
  pointManager.removePlayer(member, client);
  messenger.sendLeaveMessage(member).catch(e => console.log(e));
});

/* When a member sends a message */
client.on('message', message => commandHandler.handleMessage(message));

client.login(token);

/* Handle uncaught promises, helps developers fix any deprecated promise code */
process.on('unhandledRejection', e => console.log(`Uncaught Promise Rejection\n${e}`));
