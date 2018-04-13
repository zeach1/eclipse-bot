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
const playerManager = require('./helper/playerManager.js');

const client = new Discord.Client();

/* Set up point system */
client.points = new Enmap({ provider: new EnmapLevel({ name: 'players' }) });

/* Set up command list */
client.commands = new Discord.Collection();
for (const file of fs.readdirSync('./commands')) {
  const command = require(`./commands/${file}`);
  client.commands.set(command.name, command);
}

/* When connected */
client.on('ready', () => {
   console.log('Connected.');
   client.user.setActivity('the Eclipse', { type: 'WATCHING' });
});

/* When new member joins the server */
client.on('guildMemberAdd', member => messenger.sendWelcomeMessage(member).catch(console.error));

/* When member leaves the server */

client.on('guildMemberRemove', member => {
  playerManager.removePlayer(member, client);
  messenger.sendLeaveMessage(member).catch(console.error);
});

/* When a member sends a message */
client.on('message', async message =>
  await commandHandler.handleCommand(message).catch((e) => {
    console.error(e);
    messenger.sendDeveloperError(message).catch(console.error);
}));

client.login(token);

/* Handle uncaught promises, helps developers fix any deprecated promise code */
process.on('unhandledRejection', e => console.error(`Uncaught Promise Rejection\n${e}`));
