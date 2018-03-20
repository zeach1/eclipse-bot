const messenger = require('../helper/messenger.js');

module.exports = {
  name: 'ban',
  type: 'misc',
  aliases: ['peril'],
  description: 'Ban a user /s',
  execute: async function(message) {
    return messenger.sendImage(message, { url: 'https://i.imgur.com/WOjy315.gif' });
  },
};