const messenger = require('../helper/messenger.js');

const check = require('../misc/check.js');

module.exports = {
  name: 'help',
  type: 'essentials',
  usage: '[command]',
  description: 'Gives the list of available commands',

  /**
   * @param {Discord.Message} message The message sent
   * @param {Object} param Contains arguments and options
   * @return {Promise<Discord.Message>}
   */
  execute: async function(message, param) {
    const { args } = param;

    return args[0] ? this._sendCommandHelp(message, args[0]) : this._sendAllCommandHelp(message);
  },

  /**
   * Sends help message on specific command
   * @param {Discord.Message} message The message sent
   * @param {string} commandName The name of command
   * @return {Promise<Discord.Message>}
   */
  _sendCommandHelp: async function(message, commandName) {
    const command = message.client.commands.get(commandName) || message.client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));

    if (!command)
      return this._sendAllCommandHelp(message);

    if (!check.verifyPermission(message, command))
      return messenger.sendPermissionError(message);

    return messenger.sendCommandHelp(message, commandName, command);
  },

  /**
   * Sends help message on all commands
   * @param {Discord.Message} message The message sent
   * @return {Promise<Discord.Message>}
   */
  _sendAllCommandHelp: async function(message) {
    const commands = message.client.commands.array();

    const essentials = { type: 'essentials', commandList: commands.filter(command => command.type === 'essentials') };
    const leadership = { type: 'leadership', commandList: commands.filter(command => command.type === 'leadership') };
    const misc = { type: 'misc', commandList: commands.filter(command => command.type === 'misc') };

    return messenger.sendAllCommandHelp(message, [essentials, misc, leadership]);
  },
};
