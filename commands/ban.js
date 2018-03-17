const messenger = require('../misc/messenger.js');

module.exports = {
  name: 'ban',
  type: 'misc',
  description: 'Ban a user /s',
  execute: function(message) {
    messenger.sendImage(message, { url: 'https://i.imgur.com/WOjy315.gif' });
  },
};