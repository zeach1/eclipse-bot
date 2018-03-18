const messenger = require('../misc/messenger.js');

module.exports = {
  name: 'lina',
  type: 'misc',
  description: 'Lina\'s command',
  
  execute: async function(message) {
    return messenger.sendMessage(message, { description: '**#ANGST**' });
  },
};