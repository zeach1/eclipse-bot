const { role } = require('../data/config.js');

module.exports = {
  verifyLeadership: function(message) {
    return this.verifyEclipse(message) && message.member.roles.some(r => role.leadership.includes(r.name));
  },

  verifyDeveloper: function(message) {
    return this.verifyEclipse(message) && message.member.roles.some(r => role.developer.includes(r.name));
  },

  verifyEclipse: function(message) {
    return this.verifyMember(message) && message.member.roles.some(r => role.eclipse.includes(r.name));
  },

  verifyFriends: function(message) {
    return this.verifyMember(message) && message.member.roles.some(r => role.friends.includes(r.name));
  },

  verifyMember: function(message) {
    return message.member.roles.some(r => role.member.includes(r.name));
  },

  verifyArgument: function(args, command) {
    return args.length >= command.args;
  },

  verifyTag: function(users, command) {
    return users.size >= command.tag;
  },
};
