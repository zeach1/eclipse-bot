const { prefix } = require('../data/config.js');

const check = require('../misc/check.js');

module.exports = {
  /**
   * Sees if user must be ignored by bot.
   * @param {Discord.Message} message The message sent
   * @return {boolean} True if user is a bot or is not a member
   */
  filterUser: function(message) {
    return message.author.bot || !check.verifyMember(message);
  },

  /**
   * Sees if message should be ignored by bot.
   * @param {Discord.Message} message The message sent
   * @return {boolean} True if message is not a command
   */
  filterMessage: function(message) {
    return !isNaN(message.content.replace(/ /g, '')) || !message.content.startsWith(prefix);
  },
};
