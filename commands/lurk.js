const messenger = require('../misc/messenger.js');

module.exports = {
  name: 'lurk',
  type: 'misc',
  description: 'Lurk...',

  execute: async function(message) {
    return messenger.sendImage(message, { url: 'https://i.imgur.com/JR5uChv.png' });
  },
};
