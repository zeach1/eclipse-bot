const name = require('../misc/name.js');

module.exports = {
  /**
   * Gets array of members based on a role.
   * @param {Discord.Message} message The message sent
   * @param {Discord.Role | string} role The role to get members by
   * @return {Array}
   */
  getMembersByRole: function(message, role) {
    // if role is the name of the role, and not the actual role, then role will be replaced by the actual role
    if (!role.id)
      role = message.guild.roles.find('name', role);

    return role.members.array();
  },

  /**
   * Gets a member based on display name.
   * @param {Discord.Message} message The message sent
   * @param {Array<Discord.GuildMember>} members The list of members to check on
   * @param {string} memberName The name of the member
   * @return {Discord.GuildMember}
   */
  getMemberByName: function(message, members, memberName) {
    return members.find(member => name.match(member.displayName, memberName));
  },
};
