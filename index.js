require('./misc/boot.js');

const fs = require('fs');
const outdent = require('outdent');
const Discord = require('discord.js');
const client = new Discord.Client();

const { prefix, token } = require('./.data/config.js');
const { rules, password } = require('./misc/parameters.js');
const check = require('./misc/check.js');
const messenger = require('./misc/messenger.js');

client.commands = new Discord.Collection();
const commandFiles = fs.readdirSync('./commands');
for (const file of commandFiles) {
  const command = require(`./commands/${file}`);
  client.commands.set(command.name, command);
}

client.on('ready', () => {
   console.log('Connected.');
   client.user.setActivity('the Eclipse', { type: 'WATCHING' });
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
  /* Ignore non-commands */
  if (!message.content.startsWith(prefix) || message.author.bot) return;

  /* Prepare command, arguments, and options */
  const args = message.content.slice(prefix.length).trim().split(/ +/);
  const commandName = args.shift().toLowerCase();
  const command = client.commands.get(commandName) || client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));
  const options = [];
  while (args.length && args[args.length-1].match(/-/))
    options.push(args.pop().replace(/-/, ''));

  /* Verify general command format and permissions */
  if (!command)
    return message.channel.send('This command does not exist. Type `+help` for full list of commands.');

  if (command.type === 'leadership' && !check.verifyLeadership(message) ||
      command.type === 'misc' && !check.verifyMember(message))
    return messenger.sendPermissionError(message);
  
  if (command.args && !check.verifyArgument(message, command, args))
    return messenger.sendArgumentError(`You must provide ${command.args == 1 ? 'an argument' : `${command.args} arguments`}.`, message, command);
  
  if (command.tag && !check.verifyTag(message, command))
    return messenger.sendArgumentError(`You need to tag ${command.tag > 1 ? `${command.tag}  users` : 'a user'}.`, message, command);

  /* Execute command */
  try {
     command.execute(message, args, options) 
  } catch (e) {
    message.channel.send('Something went wrong...');
    console.log(e);
  }
});

client.login(token);
