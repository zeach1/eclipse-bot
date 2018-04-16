const messenger = require('../helper/messenger.js');

module.exports = {
  name: 'ban',
  type: 'misc',
  aliases: ['peril'],
  description: 'You can ban a user?',

  /**
   * @param {Discord.Message} message The message sent
   * @return {Promise<Discord.Message>}
   */
  execute: async function(message) {
    return messenger.sendImage(message, { url: 'https://i.imgur.com/WOjy315.gif' });
  },
};
