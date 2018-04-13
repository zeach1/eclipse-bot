const commandHandler = require('../helper/commandHandler.js');
const messenger = require('../helper/messenger.js');

module.exports = {
  name: 'help',
  type: 'essentials',
  usage: '[command]',
  description: 'Gives the list of available commands',

  execute: async function(message, param) {
    const { args } = param;

    if (args[0]) return this.sendCommandHelp(message, args[0]);

    return this.sendAllCommandHelp(message);
  },

  sendCommandHelp: async function(message, commandName) {
    const command = message.client.commands.get(commandName) || message.client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));

    if (!command)
      return this.sendAllCommandHelp(message);

    if (!commandHandler.verifyPermission(message, command))
      return messenger.sendPermissionError(message);

    return messenger.sendCommandHelp(message, commandName, command);
  },

  sendAllCommandHelp: async function(message) {
    const commands = message.client.commands.array();

    const essentials = { type: 'essentials', commandList: commands.filter(command => command.type === 'essentials') };
    const leadership = { type: 'leadership', commandList: commands.filter(command => command.type === 'leadership') };
    const misc = { type: 'misc', commandList: commands.filter(command => command.type === 'misc') };

    return messenger.sendAllCommandHelp(message, [essentials, misc, leadership]);
  },
};
