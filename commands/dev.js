const { user } = require('../data/config.js');

const messenger = require('../misc/messenger.js');

module.exports = {
  name: 'dev',
  type: 'developer',
  execute: async function(message) {
    return message.channel.send(message.guild.roles.find('name', 'Leadership').id);
  },
};
