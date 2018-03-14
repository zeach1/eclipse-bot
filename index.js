const fs = require('fs');
const outdent = require('outdent');
const Discord = require('discord.js');

const { prefix, token } = require('./config.json');
const { rules, password } = require('./parameters.json');
const verify = require('./misc/verify.js');

const client = new Discord.Client();
client.commands = new Discord.Collection();
const commandFiles = fs.readdirSync('./commands');
for (const file of commandFiles) {
   const command = require(`./commands/${file}`);
   client.commands.set(command.name, command);
}

client.on('ready', () => {
    console.log('Connected.');
    client.user.setActivity('your suggestions', { type: 'LISTENING' });
});

client.on('guildMemberAdd', member => {
   member.guild.channels.get('422983940060479501').send(outdent({ 'trimLeadingNewline': true })`
      Welcome ${member.user} to ${member.guild.name}'s Discord server!
      **Please set your nickname to match your in game name.**

      1. If you’re looking to apply, please make sure you’ve read the clan rules. Clan rules can be found here: ${rules}. You’ll also need the RCS password to apply which can be found here: ${password}.

      2. Apply in-game and tag **@Leadership** to get your server roles.`
   );
});

client.on('guildMemberRemove', member => {
   member.guild.channels.get('422983940060479501').send(`Whoops! ${member.user} stared directly at the Eclipse...`);
});

client.on('message', message => {
   if (!message.content.startsWith(prefix) || message.author.bot)
      return;

   const args = message.content.slice(prefix.length).trim().split(/ +/);
   const commandName = args.shift().toLowerCase();
   const command = client.commands.get(commandName) || client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));

   /* Verify command usage and permissions */

   if (!command)
      return message.channel.send('This command does not exist. Type `+help` for full list of commands.');

   if (command.leadership && !verify.verifyLeadership(message) ||
         command.args && !verify.verifyArgument(message, command, args) ||
         command.tag && !verify.verifyTag(message, command))
      return;

   /* Execute command */

   try {
      command.execute(message, args);
   } catch (error) {
      message.channel.send('Something went wrong...');
   }
});

client.login(token);
