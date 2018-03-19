require('./misc/ping.js');

const Discord = require('discord.js');
const fs = require('fs');

const { prefix, token, filterWords } = require('./data/config.js');

const check = require('./misc/check.js');
const messenger = require('./misc/messenger.js');

const client = new Discord.Client();
client.commands = new Discord.Collection();

const commandFiles = fs.readdirSync('./commands');
for (const file of commandFiles) {
  const command = require(`./commands/${file}`);
  if (command.name && command.type != 'hidden')
    client.commands.set(command.name, command);
}

client.on('ready', () => {
   console.log('Connected.');
   client.user.setActivity('プレインエイジア', { type: 'LISTENING' });
});

client.on('guildMemberAdd', member => messenger.sendWelcomeMessage(member).catch(e => console.log(e)));

client.on('guildMemberRemove', member => messenger.sendLeaveMessage(member).catch(e => console.log(e)));

client.on('message', message => {
  /* Filters offensive language */
  if (filterWords.some(word => message.content.toLowerCase().includes(word)))
    return message.delete()
      .then(() => {
        message.channel.send(`💢 Watch your language ${message.author}`)
          .then((msg) => msg.delete(2000))
          .catch(e => console.log(e));
      })
      .catch(e => console.log(e));

  /* Ignores numbers, non-commands, bot messages, and direct messages */
  if (!isNaN(message.content.replace(/ /g, '')) || !message.content.startsWith(prefix) || message.author.bot || !message.guild) return;

  /* Prepare command, arguments, and options */
  const args = message.content.slice(prefix.length).trim().split(/ +/);

  const commandName = args.shift().toLowerCase();
  const command = client.commands.get(commandName) || client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));

  const options = [];
  for (let i = 0; i < args.length; i++)
    if (args[i].length > 1 && args[i].startsWith('-') && isNaN(args[i]))
      options.push(args.splice(i--, 1).pop().slice(1));

  /* Verify general command format and permissions */
  if (!command) {
    messenger.sendError(message, {
      message: 'This command does not exist',
      submessage: 'Type `+help` for full list of commands',
    }).catch(e => console.log(e));
    return;
  }

  if (command.type === 'leadership' && !check.verifyLeadership(message) ||
      command.type === 'member' && !check.verifyMember(message) ||
      command.type === 'developer' && !check.verifyDeveloper(message)) {
    messenger.sendPermissionError(message).catch(e => console.log(e));
    return;
  }

  if (command.args && !check.verifyArgument(message, command, args)) {
    messenger.sendArgumentError(message, command, `You must provide ${command.args == 1 ? 'an argument' : `${command.args} arguments`}`)
      .catch(e => console.log(e));
    return;
  }

  if (command.tag && !check.verifyTag(message, command)) {
    messenger.sendArgumentError(message, command, `You need to tag ${command.tag > 1 ? `${command.tag}  users` : 'a user'}`)
      .catch(e => console.log(e));
    return;
  }

  /* Execute command */
  command.execute(message, {
    args: args,
    options: options,
  }).catch(e => {
    console.log(e);
    messenger.sendDeveloperError(message).catch(f => console.log(f));
  });
});

/* Handle deprecated promise rejections if they happen */
process.on('unhandledRejection', e => console.log(`Uncaught Promise Rejection\n${e}`));

client.login(token);
