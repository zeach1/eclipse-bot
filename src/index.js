'use strict';

require('./misc/ping.js');

const { clanName, token } = require('./data/config.js');
const Discord = require('discord.js');
const Enmap = require('enmap');
const EnmapLevel = require('enmap-level');
const HandleMessage = require('./helper/HandleMessage.js');
const fs = require('fs');
const Member = require('./helper/Member.js');
const Messenger = require('./helper/Messenger.js');
const Rank = require('./helper/Rank.js');

const client = new Discord.Client();

client.points = new Enmap({ provider: new EnmapLevel({ name: 'players' }) });
client.commands = new Discord.Collection();
for (const file of fs.readdirSync('./src/commands')) {
  const Command = require(`./commands/${file}`);
  client.commands.set(Command.name, Command);
}

client.on('ready', () => {
  console.log('Connected.');
  unmuteEveryone();
  client.user.setActivity('the Eclipse', { type: 'WATCHING' });
});

client.on('guildMemberAdd', member => Messenger.sendWelcomeMessage(member));

client.on('guildMemberRemove', member => {
  Rank.removePlayer(member, client);
  Messenger.sendLeaveMessage(member);
});

client.on('message', message => {
  try {
    HandleMessage.handle(message);
  } catch (e) {
    console.error(e);
    Messenger.sendDeveloperError(message);
  }
});

client.login(token);

/* Handle uncaught promises, helps developers fix any deprecated promise code */
process.on('unhandledRejection', e => console.error(`Uncaught Promise Rejection\n${e}`));

function unmuteEveryone() {
  const muted = 'Muted';
  const guild = client.guilds.find('name', clanName);
  const mutedRole = guild.roles.find('name', muted);
  Member.removeRoleFromMembers({ guild: guild }, mutedRole.members.array(), mutedRole).catch(console.error);
}
