const messenger = require('../helper/messenger.js');

module.exports = {
  name: 'trigger',
  type: 'misc',
  aliases: ['triggered'],
  description: 'Triggered PERIL',

  /**
   * @param {Discord.Message} message The message sent
   * @param {Object} param Contains arguments and options
   * @return {Promise<Discord.Message>}
   */
  execute: async function(message) {
    return messenger.sendImage(message, { url: 'https://cdn.discordapp.com/attachments/390086345957179393/408337364868530206/trigger.gif' });
  },
};
