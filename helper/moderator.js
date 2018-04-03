const { badWords, noUWords } = require('../data/config.js');

module.exports = {
  /* Returns true if user said a bad word */
  moderateBadWords: function(message) {
    if (badWords.some(word => message.content.toLowerCase().split(/ +/).includes(word))) {
      message.delete()
        .then(message.channel.send(`💢 Watch your language ${message.author}`)
          .then(msg => msg.delete(3000).catch(() => {}))
        .catch(console.error));
      return true;
    }
    return false;
  },

  /* Sends NO U */
  moderateNoU: function(message) {
    if (noUWords.find(m => message.content.toLowerCase().includes(m)))
      message.channel.send('**NO U**').catch(console.error);
  },
};
