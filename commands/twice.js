const messenger = require('../misc/messenger.js');

module.exports = {
  name: 'twice',
  type: 'misc',
  description: 'Twice\'s command',
  execute: function(message) {
    messenger.sendImage(message, { url: 'https://i.imgur.com/kEu6GcM.gif' });
  },
};