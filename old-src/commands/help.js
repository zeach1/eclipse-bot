const Check = require('../helper/Check.js');
const Messenger = require('../helper/Messenger.js');

function sendCommandHelp(message, commandName) {
  const command = message.client.commands.get(commandName) || message.client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));

  if (!command) {
    sendAllCommandHelp(message);
    return;
  }

  if (!Check.hasPermissions(message.member, command)) {
    Messenger.sendPermissionError(message);
    return;
  }

  Messenger.sendCommandHelp(message, command);
}

function sendAllCommandHelp(message) {
  const commands = message.client.commands.array();

  const commandCategories = [
    {
      type: 'essentials',
      categoryHeader: ['⭐ Essentials', '*Important commands*'],
    },
    {
      type: 'misc',
      categoryHeader: ['😂 Miscellaneous', '*Random stuff for everyone to play with*'],
    },
    {
      type: 'eclipse',
      categoryHeader: ['🌙 Eclipse', '*The best just for our members*'],
    },
    {
      type: 'leadership',
      categoryHeader: ['🛑 Leadership', '*Must have the roles to use*'],
    },
  ];

  for (const commandCategory of commandCategories) {
    commandCategory.commands = commands.filter(command => command.type === commandCategory.type);
  }

  Messenger.sendAllCommandHelp(message, commandCategories);
}

class Command {
  constructor() {
    this.name = 'help';

    this.description = 'Gives the list of available commands';
    this.type = 'essentials';
    this.usage = '[command]';
  }

  execute(message) {
    const commandName = message.args[0];

    if (commandName) {
      sendCommandHelp(message, commandName);
    } else {
      sendAllCommandHelp(message);
    }
  }
}

module.exports = Command;
