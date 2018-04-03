const { prefix } = require('../data/config.js');

const check = require('../misc/check.js');

module.exports = {
  /* Returns true if the user should be filtered */
  filterUser: function(message) {
    return message.author.bot || !check.verifyMember(message);
  },

  /* Returns true if the message should be filtered */
  filterMessage: function(message) {
    return !isNaN(message.content.replace(/ /g, '')) || !message.content.startsWith(prefix);
  },
};
