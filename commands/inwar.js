const { role } = require('../data/config.js');

module.exports = {
  name: 'inwar',
  type: 'leadership',
  usage: '<clear | users>',
  description: 'Manage roles for people in war',

  args: 1,

  execute: async function(message, param) {
    const { args } = param;
    if (args[0] === 'clear')
      return this.clearRoles(message);

    for (let arg of args)
      arg = arg.toLowerCase();

    console.log(args);

    this.addRoles(message, args);
  },

  addRoles: async function(message, args) {
    for (const member in message.mentions.members())
      member.addRole(role.inwar[0]).catch(e => console.error(e));

    for (const arg of args) {
      if (arg.startsWith('<@'))
        continue;

      const member = message.guild.members.find(m => m.displayName.toLowerCase().includes(arg));

      console.log(`${arg}: ${member ? member.displayName : ''}`);

      member.addRole(role.inwar[0]).catch(e => console.error(e));
    }

    const members = message.guild.roles.find('name', role.inwar[0]).array().join('\n');
    return message.channel.send(`Added rank. Members with rank \`${role.inwar[0]}\`:\n${members}`);
  },

  clearRoles: async function(message) {
    const { members } = message.guild.roles.find('name', role.inwar[0]);

    for (const member of members)
      await member.removeRole(role.inwar[0]).catch(e => console.error(e));

    return message.channel.send(`Removed rank \`${role.inwar[0]}\` from all members.`);
  },
};
