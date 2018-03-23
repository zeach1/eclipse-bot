const { role: r } = require('../data/config.js');

const messenger = require('../helper/messenger.js');
module.exports = {
  name: 'inwar',
  type: 'levelopereadership',
  usage: '<add <users> | remove <users> | clear>',
  description: 'Manage roles for people in war',

  args: 1,
  
  execute: async function(message, param) {
    const { args } = param;
    const role = message.guild.roles.find('name', r.inwar[0]);
    
    switch (args[0]) {
      case 'add':    return this.addRoles(message, args, role);
      case 'remove': return this.removeRoles(message, args, role);
      case 'clear':  return this.clearRoles(message, role);
      default:       return messenger.sendArgumentError(message, this, 'This argument does not exist');
    }

    for (let arg of args)
      arg = arg.toLowerCase();

    this.addRoles(message, args, role);
  },

  addRoles: async function(message, args, role) {
    for (const member of message.mentions.members.array())
      await member.addRole(role)
          .then(message.channel.send(`Added role to ${member.displayName}`).catch(e => console.error(e)))
          .catch(e => console.error(e));

    for (const arg of args) {
      if (arg.startsWith('<@'))
        continue;

      const member = message.guild.roles.find('name', 'Eclipse').members.find(m => m.displayName.toLowerCase().includes(arg));
      
      if (member && !member.roles.get(role.id))
        await member.addRole(role)
          .then(message.channel.send(`Added role to ${member.displayName}`).catch(e => console.error(e)))
          .catch(e => console.error(e));
      
      return message.channel.send('Done');
    }

    const members = message.guild.roles.get(role.id).members.map(m => m.displayName).sort().join('\n');
    return message.channel.send(`\nAdded rank. Members with role \`${role.name}\`:\n\n${members}`);
  },

  clearRoles: async function(message, role) {
    const { members } = message.guild.roles.get(role.id);

    for (const m of members) {
      const member = m[1]
      await member.removeRole(role)
        .then(message.channel.send(`Removed role from ${member.displayName}`).catch(e => console.error(e)))
        .catch(e => console.error(e));
    }
    
  },
};
