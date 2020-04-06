/* eslint-disable global-require, import/no-dynamic-require */

const devMode = true;

if (devMode) {
  require('dotenv').config();
} else {
  require('./misc/ping.js');
}

const Discord = require('discord.js');
const Enmap = require('enmap');
const EnmapLevel = require('enmap-level');
const fs = require('fs');
const HandleMessage = require('./helper/HandleMessage.js');
const {
  channel, defaultTimeZone, role, server, token, user,
} = require('./config/config.js');
const Member = require('./helper/Member.js');
const Messenger = require('./helper/Messenger.js');
const Rank = require('./helper/Rank.js');

const client = new Discord.Client();

async function unmuteEveryone() {
  const guild = client.guilds.cache.get(server.eclipse);
  const message = { channel: guild.channels.cache.get(channel.development) };
  const mutedRole = await guild.roles.fetch(role.muted);
  console.log(mutedRole.members);
  Member.removeRoleFromMembers({ guild }, mutedRole.members.array(), mutedRole)
    .catch((e) => Messenger.sendDeveloperError(message, e));
}

function trackDonations() {
  const trackChannel = client.guilds.get(server.eclipse).channels.get(channel.development);
  const Command = require('./commands/donate.js');
  return new Command(trackChannel);
}

require('moment-timezone').tz.setDefault(defaultTimeZone);

client.points = new Enmap({ provider: new EnmapLevel({ name: 'players' }) });
client.commands = new Discord.Collection();
fs.readdirSync('./src/commands').forEach((file) => {
  const Command = require(`./commands/${file}`);
  const command = new Command();
  client.commands.set(command.name, command);
});

client.on('ready', async () => {
  client.user.setActivity('the Eclipse', { type: 'WATCHING' });

  await unmuteEveryone();
  trackDonations();
});

client.on('guildMemberAdd', (member) => Messenger.sendWelcomeMessage(member));

client.on('guildMemberRemove', (member) => {
  Rank.removePlayer(member, client);
  Messenger.sendLeaveMessage(member);
});

client.on('message', (message) => {
  if (devMode && message.author.id !== user.paul) return;
  if (message.guild.id !== server.eclipse) return;

  try {
    HandleMessage.handle(message);
  } catch (e) {
    Messenger.sendDeveloperError(message, e);
  }
});

client.login(token);

/* Handle uncaught promises, helps developers fix any deprecated promise code */
process.on('unhandledRejection', (e) => {
  console.log('Uncaught Promise Rejection', e);
});
