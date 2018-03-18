const messenger = require('../misc/messenger.js');
const { user } = require('../data/config.js');

module.exports = {
  name: 'dev',
  type: 'developer',
  execute: async function(message) {
    return messenger.sendMessage(message, { description: `<@${user.paul}> is the best` });
  },
};
