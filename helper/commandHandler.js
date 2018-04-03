const { prefix } = require('../data/config.js');

const check = require('../misc/check.js');

const automator = require('./automator.js');
const filterer = require('./filterer.js');
const messenger = require('./messenger.js');
const moderator = require('./moderator.js');
const playerManager = require('./playerManager.js');

module.exports = {
  handleCommand: async function(message) {
    /* Checks if message has bad word, or user is bot/non-member */
    if (moderator.moderateBadWords(message) || filterer.filterUser(message)) return;

    /* Updates player points */
    playerManager.updatePoints(message);

    automator.automate();

    /* Filters out message that aren't commands */
    if (filterer.filterMessage(message)) return;

    const { command, args, options } = this.getCommand(message);

    /* Verifies command for permission and format */
    if (!this.verifyCommand(message, command, args)) return;

    /* Execute command */
    return command.execute(message, { args: args, options: options });
  },

  getCommand: function(message) {
    let args = message.content.toLowerCase().slice(prefix.length).trim().split(/ +/);

    const options = args.filter(arg => arg.startsWith('-')).map(arg => arg.slice(1));
    args = args.filter(arg => !arg.startsWith('-'));

    const commandName = args.shift();
    const command = message.client.commands.get(commandName) || message.client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));

    return { command: command, args: args, options: options };
  },

  verifyCommand: function(message, command, args) {
    if (!command) {
      messenger.sendCommandDoesNotExistError(message).catch(console.error);
      return false;
    }

    if (!this.verifyPermissions(message, command)) {
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

  verifyPermissions: function(message, command) {
    return command.type === 'leadership' && check.verifyLeadership(message) ||
           command.type === 'developer' && check.verifyDeveloper(message);
  },
};
