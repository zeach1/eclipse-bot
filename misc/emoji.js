const fs = require('fs');

module.exports = {
  getEmoji: function(name, client) {
    const twimojis = fs.readFileSync('../data/emojis.txt', 'utf8').split('\n');
    name = name.replace(/:/g, '');

    if (twimojis.includes(name))
      return `\:${name}:`; // eslint-disable-line no-useless-escape

    return client.emojis.find('name', name);
  },
};
