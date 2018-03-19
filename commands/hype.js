const messenger = require('../misc/messenger.js');

module.exports = {
  name: 'hype',
  type: 'misc',
  aliases: ['paul'],
  description: 'Hype!',

  execute: async function(message) {
    return messenger.sendImage(message, { url: 'https://i.imgur.com/L090lvT.gif' });
  },
};
