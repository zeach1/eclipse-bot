const messenger = require('../helper/messenger.js');
const playerManager = require('../helper/playerManager.js');

const emoji = require('../misc/emoji.js');

module.exports = {
  name: 'flair',
  type: 'essentials',
  usage: '<emoji | emojiname | list>',
  description: 'Set a flair which will be displayed on your rank and on games',

  args: 1,

  /**
   * @param {Discord.Message} message The message sent
   * @param {Object} param Contains arguments and options
   * @return {Promise<Discord.Message>}
   */
  execute: async function(message, param) {
    const name = param.args[0];
    const flair = emoji.getEmoji(name, message.client);

    if (!flair) return messenger.sendArgumentError(message, this, 'This emoji is not supported by the server');

    playerManager.updateFlair(message, flair);

    return messenger.sendMessage(message, {
      title: '🎉 Flair Updated',
      color: 0x3ea92e,
      description: `You are now ${message.member.displayName} ${flair}`,
    });
  },
};
