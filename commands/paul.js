const messenger = require('../misc/messenger.js');

module.exports = {
  name: 'paul',
  type: 'misc',
  aliases: ['hype'],
  description: 'Hype!',

  execute: async function(message) {
    return messenger.sendImage(message, { url: 'https://i.imgur.com/L090lvT.gif' });
  },
};
