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

  const essentials = { type: 'essentials', commands: commands.filter(command => command.type === 'essentials') };
  const leadership = { type: 'leadership', commands: commands.filter(command => command.type === 'leadership') };
  const misc = { type: 'misc', commands: commands.filter(command => command.type === 'misc') };

  Messenger.sendAllCommandHelp(message, [essentials, misc, leadership]);
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

module.exports = new Command();
