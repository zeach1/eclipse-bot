const Check = require('./Check.js');
const Messenger = require('./Messenger.js');
const { prefix } = require('../config/config.js');
const { profanity, slang } = require('../config/words.js');
const Rank = require('./Rank.js');
const Util = require('./Util.js');

function filterProfanity(message) {
  const content = Util.cleanString(message.content).split(' ');

  if (profanity.some((word) => content.includes(word))) {
    message.delete()
      .then(message.channel.send(`💢 Watch your language ${message.author}`)
        .then((msg) => msg.delete(3000).catch(() => {}))
        .catch((e) => Messenger.sendDeveloperError(message, e)));
    return true;
  }
  return false;
}

function replySlang(message) { // eslint-disable-line
  const content = Util.cleanString(message.content).split(' ');

  if (slang.some((word) => content.includes(word))) {
    message.channel.send('**NO U**').catch((e) => Messenger.sendDeveloperError(message, e));
  }
}

function isCommand(message) {
  const isNumber = Number.parseInt(message, 10);
  return !isNumber && message.content.startsWith(prefix);
}

function getCommand(message) {
  let args = message.content.toLowerCase()
    .slice(prefix.length)
    .trim()
    .split(/ +/);

  const options = args
    .filter((arg) => arg.startsWith('-'))
    .map((arg) => arg.slice(1));

  args = args.filter((arg) => !arg.startsWith('-'));

  const commandName = args.shift();
  const command = message.client.commands.get(commandName)
    || message.client.commands.find((cmd) => cmd.aliases && cmd.aliases.includes(commandName));

  return {
    commandName, command, args, options,
  };
}

function checkCommand(message, commandName, command, args) {
  if (!command) {
    Messenger.sendCommandDoesNotExistError(message);
    return false;
  }

  if (!Check.hasPermissions(message.member, command)) {
    Messenger.sendPermissionError(message);
    return false;
  }

  if (command.args && !Check.verifyArgument(args, command)) {
    Messenger.sendArgumentError(message, command, `You must provide ${command.args === 1 ? 'an argument' : `${command.args} arguments`}`, commandName);
    return false;
  }

  if (command.name !== 'help' && args && args[0] === 'help') {
    Messenger.sendArgumentError(message, command, null, commandName, true);
    return false;
  }

  if (command.tag && !Check.verifyTag(message.mentions.members.size, command)) {
    Messenger.sendArgumentError(message, command, `You need to tag ${command.tag > 1 ? `${command.tag}  members` : 'a member'}`, commandName);
    return false;
  }

  const member = message.mentions.members.first();
  if (member && member.user.bot) {
    Messenger.sendBotTagError(message, member);
    return false;
  }

  return true;
}

class HandleMessage {
  static handle(message) {
    if (filterProfanity(message)) return;
    if (!Check.isMember(message.member)) return;

    Rank.updatePoints(message);
    // replySlang(message);

    if (!isCommand(message)) return;

    const {
      commandName, command, args, options,
    } = getCommand(message);
    if (!checkCommand(message, commandName, command, args)) return;

    command.execute({ args, options, ...message });
  }
}

module.exports = HandleMessage;
