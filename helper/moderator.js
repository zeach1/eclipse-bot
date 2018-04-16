const { badWords, noUWords } = require('../data/config.js');

module.exports = {
  /**
   * Removes bad words.
   * @param {Discord.Message} message The message sent
   * @return {boolean} True if user sent a bad word
   */
  moderateBadWords: function(message) {
    if (badWords.some(word => message.content.toLowerCase().replace(/[^a-z]/, '').includes(word))) {
      message.delete()
        .then(message.channel.send(`💢 Watch your language ${message.author}`)
          .then(msg => msg.delete(3000).catch(() => {}))
        .catch(console.error));
      return true;
    }
    return false;
  },

  /**
   * Responds to noU words.
   * @param {Discord.Message} message The message sent
   */
  moderateNoU: function(message) {
    if (noUWords.find(m => message.content.toLowerCase().includes(m)))
      message.channel.send('**NO U**').catch(console.error);
  },
};
