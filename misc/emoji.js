const isEmoji = require('is-emoji-keyword');

module.exports = {
  getEmoji: function(name, client) {
    name = name.replace(/:/g, '');
    
    return client.emojis.find('name', name);
  },
};