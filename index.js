/* Allows bot to stay on through Glitch */
require('./misc/ping.js');

/* Imports */
const Discord = require('discord.js');
const fs = require('fs');

const { token } = require('./data/config.js');

const messenger = require('./helper/messenger.js');
const commandHandler = require('./helper/commandHandler.js');

const client = new Discord.Client();

/* Set up command list */
client.commands = new Discord.Collection();
for (const file of fs.readdirSync('./commands')) {
  const command = require(`./commands/${file}`);
  if (command.name && command.type != 'hidden')
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
client.on('guildMemberRemove', member => messenger.sendLeaveMessage(member).catch(e => console.log(e)));

/* When a member sends a message */
client.on('message', message => commandHandler.handleMessage(message));

client.login(token);

/* Handle uncaught promises, helps developers fix any deprecated promise code */
process.on('unhandledRejection', e => console.log(`Uncaught Promise Rejection\n${e}`));
