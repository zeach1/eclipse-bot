const { roles } = require('../misc/parameters.js');

module.exports = {

  /* Verification */

  verifyLeadership: function(message) {
    return this.verifyEclipse(message) && message.member.roles.some(role => roles.leadership.includes(role.name));
  },
  
  verifyDeveloper: function(message) {
    return message.member.roles.some(role => roles.developer.includes(role.name));
  },

  verifyEclipse: function(message) {
    return this.verifyMember(message) && message.member.roles.some(role => roles.eclipse.includes(role.name));
  },

  verifyMember: function(message) {
    return message.member.roles.some(role => roles.member.includes(role.name));
  },

  verifyArgument: function(message, command, args) {
    return args.length >= command.args;
  },

  verifyTag: function(message, command) {
    return message.mentions.users.array().length >= command.tag;
  },
};
