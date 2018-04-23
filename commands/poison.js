const messenger = require('../helper/messenger.js');

module.exports = {
  name: 'poison',
  type: 'misc',
  description: 'Can you properly kill the clan castle troops?',

  /**
   * @param {Discord.Message} message The message sent
   * @return {Promise<Discord.Message>}
   */
  execute: async function(message) {
    await messenger.sendImage(message, { url: 'https://i.imgur.com/RG0lRA1.png' }).catch(console.error);
    await messenger.sendImage(message, { url: 'https://i.imgur.com/7hJSaQK.png' }, 3000).catch(console.error);
    await messenger.sendImage(message, { url: 'https://i.imgur.com/sDIsfhj.png' }, 4000).catch(console.error);
    return messenger.sendImage(message, { url: 'https://i.imgur.com/zi1QV9r.png' }, 2000);
  },
};