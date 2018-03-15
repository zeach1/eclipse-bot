const { prefix } = require('../config.js');
const { roles } = require('../parameters.js');
const outdent = require('outdent');

module.exports = {

  verifyHuman: function(message, member) {
    if (member.bot)
      return false;
    return true;
  },

  verifyLeadership: function(message) {
    if (!message.member.roles.some(role => roles.leadership.includes(role.name))) {
      message.channel.send('You do not have permission to use this command.');
      return false;
    }
    return true;
  },

  verifyEclipse: function(message) {
    if (!message.member.roles.some(role => roles.eclipse.includes(role.name))) {
      message.channel.send('You do not have permission to use this command.');
      return false;
    }
    return true;
  },

  verifyVerifiedUser: function(message) {
    if (!message.member.roles.some(role => roles.verified.includes(role.name))) {
      message.channel.send('You do not have permission to use this command.');
      return false;
    }
    return true;
  },

  verifyArgument: function(message, command, args) {
    if (args.length < command.args) {
      message.channel.send(outdent({ 'trimLeadingNewline': true })`
        You must provide ${command.args == 1 ? 'an argument' : `${command.args} arguments`}.
        The proper usage is: \`${prefix}${command.name} ${command.usage ? command.usage : ''}\``
      );
      return false;
    }
    return true;
  },

  verifyTag: function(message, command) {
    if (message.mentions.users.size < command.tag) {
      message.channel.send(outdent({ 'trimLeadingNewline': true })`
        You need to tag ${command.tag > 1 ? `${command.tag}  users` : 'a user'}.
        The proper usage is: \`${prefix}${command.name}${command.usage ? ` ${command.usage}` : ' '}\``
      );
      return false;
    }
    return true;
  },

};
