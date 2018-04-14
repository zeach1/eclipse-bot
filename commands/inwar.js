const { role: r } = require('../data/config.js');

const messenger = require('../helper/messenger.js');

module.exports = {
  name: 'inwar',
  type: 'leadership',
  usage: '<list | add <users> | remove <users> | clear>',
  description: 'Manage `in war` role for people in war',

  args: 1,

  execute: async function(message, param) {
    const { args } = param;
    const inwar = message.guild.roles.find('name', r.inwar[0]);

    if (args[0] === 'add' || args[0] === 'remove' || args[0] === 'clear')
      await message.channel.send('If you don\'t see `Done` at the end of this, run the command again until you do.').catch(console.error);

    switch (args[0]) {
      case 'list':   return this.listRoles(message, inwar);
      case 'add':    return this.addRoles(message, args, inwar);
      case 'remove': return this.removeRoles(message, args, inwar);
      case 'clear':  return this.clearRoles(message, inwar);
      default:       return messenger.sendArgumentError(message, this, 'This argument does not exist');
    }
  },

  listRoles: async function(message, role) {
    const members = message.guild.roles.get(role.id).members.map(m => m.displayName).sort((a, b) => { return a.toLowerCase() > b.toLowerCase() ? 1 : a.toLowerCase() < b.toLowerCase() ? -1 : 0; }).join('\n');

    message.channel.send('<:29665543_2438544376171770_163465:434604521759703043>');
    return messenger.sendMessage(message, {
      title: 'Members in war',
      description: members.length ? members : 'None',
    });
  },

  addRoles: async function(message, args, role) {
    for (const member of message.mentions.members.array())
      this.addRole(message, member, role);

    const eclipse = message.guild.roles.find('name', 'Eclipse').members;
    for (const arg of args.filter(ar => !ar.startsWith('<@'))) {
      const member = eclipse.find(m => m.displayName.toLowerCase().startsWith(arg) || m.displayName.toLowerCase().includes(arg));
      await this.addRole(message, member, role);
    }

    return message.channel.send('Done');
  },

  removeRoles: async function(message, args, role) {
    for (const member of message.mentions.members.array())
      this.removeRole(message, member, role);

    const eclipse = message.guild.roles.find('name', 'Eclipse').members;
    for (const arg of args.filter(ar => !ar.startsWith('<@'))) {
      const member = eclipse.find(m => m.displayName.toLowerCase().startsWith(arg) || m.displayName.toLowerCase().includes(arg));
      await this.removeRole(message, member, role);
    }

    return message.channel.send('Done');
  },

  clearRoles: async function(message, role) {
    const { members } = message.guild.roles.get(role.id);

    for (const m of members)
      await this.removeRole(message, m[1], role);

    return message.channel.send('Done');
  },

  addRole: async function(message, member, role) {
    if (member && !member.roles.get(role.id))
      await member.addRole(role)
        .then(message.channel.send(`Added role to ${member.displayName}`).catch(console.error))
        .catch(console.error);
  },

  removeRole: async function(message, member, role) {
    if (member && member.roles.get(role.id))
      await member.removeRole(role)
        .then(message.channel.send(`Removed role from ${member.displayName}`).catch(console.error))
        .catch(console.error);
  },
};
