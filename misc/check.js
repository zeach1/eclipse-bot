const { role } = require('../data/config.js');

module.exports = {
  /**
   * Checks if a member has permissions to use a command.
   * @param {Discord.Message} message The message sent
   * @param {Object} command The command
   * @return {boolean}
   */
  verifyPermission: function(message, command) {
    return command.type === 'essentials' || command.type === 'misc' ||
           command.type === 'leadership' && this.verifyLeadership(message) ||
           command.type === 'developer' && this.verifyDeveloper(message);
  },

  /**
   * Checks if a member has Leadership role.
   * @param {Discord.Message} message The message sent
   * @return {boolean}
   */
  verifyLeadership: function(message) {
    return this.verifyEclipse(message) && message.member.roles.some(r => role.leadership.includes(r.name));
  },

  /**
   * Checks if a member has Developer role.
   * @param {Discord.Message} message The message sent
   * @return {boolean}
   */
  verifyDeveloper: function(message) {
    return this.verifyEclipse(message) && message.member.roles.some(r => role.developer.includes(r.name));
  },

  /**
   * Checks if a member has Eclipse role.
   * @param {Discord.Message} message The message sent
   * @return {boolean}
   */
  verifyEclipse: function(message) {
    return this.verifyMember(message) && message.member.roles.some(r => role.eclipse.includes(r.name));
  },

  /**
   * Checks if a member has Friends of Eclipse role.
   * @param {Discord.Message} message The message sent
   * @return {boolean}
   */
  verifyFriends: function(message) {
    return this.verifyMember(message) && message.member.roles.some(r => role.friends.includes(r.name));
  },

  /**
   * Checks if a member is... a member - basically needs a role in the server.
   * @param {Discord.Message} message The message sent
   * @return {boolean}
   */
  verifyMember: function(message) {
    return message.member.roles.some(r => role.member.includes(r.name));
  },

  /**
   * Checks if a user command meets enough arguments.
   * @param {Array<string>} args List of arguments
   * @param {Object} command The command
   * @return {boolean}
   */
  verifyArgument: function(args, command) {
    return args.length >= command.args;
  },

  /**
   * Checks if a user tagged enough users for a command.
   * @param {Discord.Collection<Discord.Snowflake, Discord.User>} users List of tagged users
   * @param {Object} command The command
   * @return {boolean}
   */
  verifyTag: function(users, command) {
    return users.size >= command.tag;
  },
};
