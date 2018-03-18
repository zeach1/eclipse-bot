const messenger = require('../misc/messenger.js');

module.exports = {
  name: 'luigi',
  type: 'misc',
  description: 'Dancing Luigi',

  execute: async function(message) {
    return messenger.sendImage(message, { url: 'https://i.imgur.com/SjRwl3T.gif' });
  },
};
