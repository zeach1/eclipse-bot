const messenger = require('../misc/messenger.js');

module.exports = {
  name: 'trigger',
  type: 'misc',
  description: 'Triggered PERIL',
  aliases: ['triggered'],
  
  execute: function(message) {
    messenger.sendImage(message, { url: 'https://cdn.discordapp.com/attachments/390086345957179393/408337364868530206/trigger.gif' });
  },
};