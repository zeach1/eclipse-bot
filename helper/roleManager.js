const messenger = require('./messenger.js');

const name = require('../misc/name.js');

module.exports = {
  /**
   * Lists players of a role.
   * @param {Discord.Message} message The message sent
   * @param {Discord.Role} role The role
   * @return {Promise<Discord.Message>}
   */
  listRoles: async function(message, role) {
    let members = message.guild.roles.get(role.id).members.array();
    members = name.inOrder(members, true);
    
    let players = [];
    for (const { id, displayName } of members) {
      const { flair } = message.client.points.get(id);
      players.push(`${flair ? `${flair} ` : ''}${displayName}`);
    }

    return messenger.sendMessage(message, {
      title: `List of members: ${role.name}`,
      description: players.length > 0 ? players : '✌️ None',
    });
  },

  /**
   * Clears all players of a role.
   * @param {Discord.Message} message The message sent
   * @param {Discord.Role} role The role
   */
  clearMembersOfRole: async function(message, role) {
    const members = message.guild.roles.get(role.id).members.array();
    for (const member of members)
      await this.removeRole(message, member, role);
  },

  /**
   * Adds a role to a member.
   * @param {Discord.Message} message The message sent
   * @param {Discord.GuildMember} member The member to add role to
   * @param {Discord.Role} role The role
   */
  addRole: async function(message, member, role) {
    if (member && !member.roles.get(role.id))
      await member.addRole(role)
        .then(message.channel.send(`Added ${role.name} to ${member.displayName}`).catch(console.error))
        .catch(console.error);
  },

  /**
   * Removes a role from a member.
   * @param {Discord.Message} message The message sent
   * @param {Discord.GuildMember} member The member to remove role from
   * @param {Discord.Role} role The role
   */
  removeRole: async function(message, member, role) {
    if (member && member.roles.get(role.id))
      await member.removeRole(role)
        .then(message.channel.send(`Removed ${role.name} from ${member.displayName}`).catch(console.error))
        .catch(console.error);
  },
};

