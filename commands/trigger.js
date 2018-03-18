const messenger = require('../misc/messenger.js');

module.exports = {
  name: 'trigger',
  type: 'misc',
  aliases: ['triggered', 'peril'],
  description: 'Triggered PERIL',

  execute: async function(message) {
    return messenger.sendImage(message, { url: 'https://cdn.discordapp.com/attachments/390086345957179393/408337364868530206/trigger.gif' });
  },
};
