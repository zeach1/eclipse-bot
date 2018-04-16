const { prefix } = require('../data/config.js');

const check = require('../misc/check.js');

// const automator = require('./automator.js');
const filterer = require('./filterer.js');
const messenger = require('./messenger.js');
const moderator = require('./moderator.js');
const playerManager = require('./playerManager.js');

module.exports = {
  /**
   * Processes each message sent in server. Focuses mainly on commands though.
   * @param {Discord.Message} message The message sent
   * @return {Promise<Discord.Message>}
   */
  handleCommand: async function(message) {
    /* Checks if message has bad word, or user is bot/non-member */
    if (moderator.moderateBadWords(message) || filterer.filterUser(message)) return;

    /* Updates player points */
    playerManager.updatePoints(message);

    moderator.moderateNoU(message);

    /* Filters out messages that aren't commands */
    if (filterer.filterMessage(message)) return;

    const { command, args, options } = this._getCommand(message);

    /* Verifies command for permission and format */
    if (!this._verifyCommand(message, command, args)) return;

    /* Execute command */
    return command.execute(message, { args: args, options: options });
  },

  /**
   * Gets command from message.
   * @param {Discord.Message} message The message sent
   * @return {Object} The command
   */
  _getCommand: function(message) {
    let args = message.content.toLowerCase().slice(prefix.length).trim().split(/ +/);

    const options = args.filter(arg => arg.startsWith('-')).map(arg => arg.slice(1));
    args = args.filter(arg => !arg.startsWith('-'));

    const commandName = args.shift();
    const command = message.client.commands.get(commandName) || message.client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));

    return { command: command, args: args, options: options };
  },

  /**
   * Verifies user permissions to use command.
   * @param {Discord.Message} message The message sent
   * @param {Object} command The command
   * @param {Array<string>} args Array of arguments
   * @return {boolean} True if all command conditions are met
   */
  _verifyCommand: function(message, command, args) {
    if (!command) {
      messenger.sendCommandDoesNotExistError(message).catch(console.error);
      return false;
    }

    if (!check.verifyPermission(message, command)) {
      messenger.sendPermissionError(message).catch(console.error);
      return false;
    }

    if (command.args && !check.verifyArgument(args, command)) {
      messenger.sendArgumentError(message, command, `You must provide ${command.args == 1 ? 'an argument' : `${command.args} arguments`}`).catch(console.error);
      return false;
    }

    if (command.tag && !check.verifyTag(message.mentions.users, command)) {
      messenger.sendArgumentError(message, command, `You need to tag ${command.tag > 1 ? `${command.tag}  users` : 'a user'}`).catch(console.error);
      return false;
    }

    return true;
  },
};
