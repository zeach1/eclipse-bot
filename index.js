const fs = require('fs');
const outdent = require('outdent');

const Discord = require('discord.js');
const client = new Discord.Client();

client.commands = new Discord.Collection();
const commandFiles = fs.readdirSync('./commands');
for (const file of commandFiles) {
   const command = require(`./commands/${file}`);
   client.commands.set(command.name, command);
}

const { prefix, token } = require('./config.json');
const clan = require('./parameters.json');

client.on('ready', () => {
    console.log('Connected.');
    client.user.setActivity('your suggestions', { type: 'LISTENING' });
});

client.on('message', message => {
   // ignores all non-command messages and bot messages
   if (!message.content.startsWith(prefix) || message.author.bot)
      return;

   const args = message.content.slice(prefix.length).trim().split(/ +/);
   const command = args.shift().toLowerCase();

   switch (command) {
      case 'identify': identify(message, args); break;
      case 'help': message.channel.send('Help command WIP.'); break;
      default: message.channel.send('Command not recognized. Type ``+help`` for full list of commands.'); break;
   }
});

client.on('guildMemberAdd', member => {
   member.guild.channels.get('422983940060479501').send(outdent({ 'trimLeadingNewline': true })`
      Welcome ${member.user} to ${member.guild.name}'s Discord server!
      **Please set your nickname to match your in game name.**

      1. If you’re looking to apply, please make sure you’ve read the clan rules. Clan rules can be found here: ${clan.rules}. You’ll also need the RCS password to apply which can be found here: ${clan.password}.

      2. Apply in-game and tag **@Leadership** to get your server roles.`
   );
});

client.on('guildMemberRemove', member => {
   member.guild.channels.get('422983940060479501').send(`Whoops! ${member.user} stared directly at the Eclipse...`);
});

client.login(token);


help => (message) => {

}
/* Verification */

requireLeadershipRole = message => {
   if (!message.member.roles.some(role => clan.leadershipRoles.includes(role.name))) {
      message.channel.send('You do not have permission to use this command.');
      return false;
   }
   return true;
}

requireTagUsers = (message, num) => {
   if (!num) num = 1;
   if (message.mentions.users.size < num) {
      message.channel.send(`You need to tag ${num > 1 ? `${num}  users` : 'a user'} for this command.`);
      return false;
   }
   return true;
}

requireHumanUser = (message, taggedUser) => {
   if (taggedUser.bot) {
      message.channel.send('You cannot tag a bot for this command.');
      return false;
   }
   return true;
}
