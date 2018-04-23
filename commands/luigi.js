const messenger = require('../helper/messenger.js');

module.exports = {
  name: 'luigi',
  type: 'misc',
  description: 'Dancing Luigi',

  /**
   * @param {Discord.Message} message The message sent
   * @return {Promise<Discord.Message>}
   */
  execute: async function(message) {
    return messenger.sendImage(message, { url: 'https://i.imgur.com/SjRwl3T.gif' });
  },
};
