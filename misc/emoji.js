const twemoji = require('twemoji');

module.exports = {
  getEmoji: function(name, client) {
    if (twemoji.parse(name).startsWith('<img'))
      return name;

    name = name.slice(2);
    const key = name.slice(name.indexOf(':') + 1, -1);
    const emoji = client.emojis.get(key);
    
    return emoji ? `<:${emoji.name}:${emoji.id}>` : null;
  },
};
