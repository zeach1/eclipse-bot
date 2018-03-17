require('./misc/boot.js');

const fs = require('fs');
const Discord = require('discord.js');
const client = new Discord.Client();

const { prefix, token } = require('./.data/config.js');
const check = require('./misc/check.js');
const messenger = require('./misc/messenger.js');

client.commands = new Discord.Collection();
const commandFiles = fs.readdirSync('./commands');
for (const file of commandFiles) {
  const command = require(`./commands/${file}`);
  if (command.name && command.type != 'hidden')
    client.commands.set(command.name, command);
}

client.on('ready', () => {
   console.log('Connected.');
   client.user.setActivity('the Eclipse', { type: 'WATCHING' });
});

client.on('guildMemberAdd', member => messenger.sendWelcomeMessage(member));

client.on('guildMemberRemove', member => messenger.sendLeaveMessage(member));

client.on('message', message => {
  /* Ignores non-commands and direct messages */
  if (!message.content.startsWith(prefix) || message.author.bot || !message.guild) return;
  
  /* Prepare command, arguments, and options */
  const args = message.content.slice(prefix.length).trim().split(/ +/g);
  const commandName = args.shift().toLowerCase();
  const command = client.commands.get(commandName) || client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));
  const options = [];
  while (args.length && args[args.length - 1].match(/-/))
    options.push(args.pop().replace(/-/, ''));

  /* Verify general command format and permissions */
  if (!command)
    return message.channel.send('This command does not exist. Type `+help` for full list of commands.');

  if (command.type === 'leadership' && !check.verifyLeadership(message) ||
      command.type === 'member' && !check.verifyMember(message) ||
      command.type === 'developer' && !check.verifyDeveloper(message))
    return messenger.sendPermissionError(message);

  if (command.args && !check.verifyArgument(message, command, args))
    return messenger.sendArgumentError(message, command, `You must provide ${command.args == 1 ? 'an argument' : `${command.args} arguments`}.`);

  if (command.tag && !check.verifyTag(message, command))
    return messenger.sendArgumentError(message, command, `You need to tag ${command.tag > 1 ? `${command.tag}  users` : 'a user'}.`);

  /* Execute command */
  try {
     command.execute(message, {
       args: args,
       options: options,
     });
  } catch (e) {
    message.channel.send('Something went wrong...');
    console.error;
  }
});

process.on('unhandledRejection', error => console.error(`Uncaught Promise Rejection:\n${error}`));

client.login(token);