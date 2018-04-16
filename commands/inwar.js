const { role: roles } = require('../data/config.js');

const messenger = require('../helper/messenger.js');
const roleManager = require('../helper/roleManager.js');

const name = require('../misc/name.js');

const warRole = [roles.eclipse[0], '50v50'];

module.exports = {
  name: 'inwar',
  type: 'leadership',
  usage: '<list | add <users> | remove <users> | clear>',
  description: 'Manage `in war` role for people in war',

  args: 1,

  /**
   * @param {Discord.Message} message The message sent
   * @param {Object} param Contains arguments and options
   * @return {Promise<Discord.Message>}
   */
  execute: async function(message, param) {
    const { args } = param;

    if (args[0] === 'add' || args[0] === 'remove' || args[0] === 'clear')
      await message.channel.send('If you don\'t see `Done` at the end of this, run the command again until you do.').catch(console.error);

    const inwar = message.guild.roles.find('name', 'in war');
    const names = name.filterTags(args.slice(1));

    switch (args[0]) {
      case 'list':   return roleManager.listRoles(message, inwar);
      case 'add':    return this._addRoles(message, names, inwar);
      case 'remove': return this._removeRoles(message, names, inwar);
      case 'clear':  return this._clearRoles(message, inwar);
      default:       return messenger.sendArgumentError(message, this, 'This argument does not exist');
    }
  },

  /**
   * Adds in war role to members.
   * @param {Discord.Message} message The message sent
   * @param {Array<string>} names The names of members
   * @param {Discord.Role} inwar The in war role
   * @return {Promise<Discord.Message>}
   */
  _addRoles: async function(message, names, inwar) {
    for (const member of message.mentions.members.array())
      await roleManager.addRole(message, member, inwar).catch(console.error);

    const players = message.guild.roles.find(role => warRole.includes(role.name)).members;

    for (const displayName of names) {
      const member = players.find(player => name.match(player.displayName, displayName));
      await roleManager.addRole(message, member, inwar).catch(console.error);
    }

    return message.channel.send('Done');
  },

  /**
   * Removes in war role from members.
   * @param {Discord.Message} message The message sent
   * @param {Array<string>} names The names of members
   * @param {Discord.Role} inwar The in war role
   * @return {Promise<Discord.Message>}
   */
  _removeRoles: async function(message, names, inwar) {
    for (const member of message.mentions.members.array())
      await roleManager.addRole(message, member, inwar).catch(console.error);

    const players = message.guild.roles.find(role => warRole.includes(role.name)).members;

    for (const displayName of names) {
      const member = players.find(player => name.match(player.displayName, displayName));
      await roleManager.removeRole(message, member, inwar).catch(console.error);
    }

    return message.channel.send('Done');
  },

  /**
   * Clears in war role from members.
   * @param {Discord.Message} message The message sent
   * @param {Discord.Role} inwar The in war role
   * @return {Promise<Discord.Message>}
   */
  _clearRoles: async function(message, inwar) {
    await roleManager.clearMembersOfRole(message, inwar).catch(console.error);
    return message.channel.send('Done');
  },
};
