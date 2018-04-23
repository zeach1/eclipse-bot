const messenger = require('../helper/messenger.js');
const rankManager = require('../helper/rankManager.js');

const emoji = require('../misc/emoji.js');

module.exports = {
  name: 'flair',
  type: 'essentials',
  usage: '<emoji>',
  description: 'Set an emoji flair which will be displayed on your rank and on games. Supports server emojis plus more custom emojis (including Clash emojis!)',

  args: 1,

  /**
   * @param {Discord.Message} message The message sent
   * @param {Object} param Contains arguments and options
   * @return {Promise<Discord.Message>}
   */
  execute: async function(message, param) {
    const name = param.args.join(' ');
    const flair = emoji.getEmoji(name, message.client);

    if (!flair) return messenger.sendArgumentError(message, this, 'This emoji is not supported by the server');

    rankManager.updateFlair(message, flair);

    return messenger.sendMessage(message, {
      title: '🎉 Flair Updated',
      color: 0x3ea92e,
      description: `You are now ${message.member.displayName} ${flair}`,
    });
  },
};
