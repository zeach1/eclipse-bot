module.exports = {
  name: 'dev',
  type: 'developer',
  execute: async function(message) {
    return message.channel.send(message.guild.roles.find('name', 'Leadership').id);
  },
};
