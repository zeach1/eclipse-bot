const messenger = require('../helper/messenger.js');

module.exports = {
  name: 'lurk',
  type: 'misc',
  description: 'Lurk...',

  /**
   * @param {Discord.Message} message The message sent
   * @return {Promise<Discord.Message>}
   */
  execute: async function(message) {
    return messenger.sendImage(message, { url: 'https://i.imgur.com/JR5uChv.png' });
  },
};
