const messenger = require('../helper/messenger.js');

module.exports = {
  name: 'hype',
  type: 'misc',
  description: 'Hype!',

  /**
   * @param {Discord.Message} message The message sent
   * @return {Promise<Discord.Message>}
   */
  execute: async function(message) {
    return messenger.sendImage(message, { url: 'https://i.imgur.com/L090lvT.gif' });
  },
};
