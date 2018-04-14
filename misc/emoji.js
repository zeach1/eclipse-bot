const twemoji = require('twemoji');

module.exports = {
  getEmoji: function(name, client) {
    return name ? this.getTwemoji(name) || this.getServerEmoji(name, client) || this.getCustomEmoji(name, client) : null;
  },

  getTwemoji: function(name) {
    return twemoji.parse(name).startsWith('<img') ? name : null;
  },

  getServerEmoji: function(name, client) {
    if (!name.startsWith('<'))
      return null;

    const serveremoji = client.emojis.get(name.substring(2, name.length - 2));

    return serveremoji ? `<:${serveremoji.name}:${serveremoji.id}>` : null;
  },

  getCustomEmoji: function(name, client) {
    const customemoji = client.emojis.find(emoji => {
      const _emoji = emoji.name.replace(/-/g, ' ');
      return emoji.name.startsWith(name) || emoji.name.includes(name) || _emoji.startsWith(name) || _emoji.includes(name);
    });

    return customemoji ? `<:${customemoji.name}:${customemoji.id}>` : null;
  },
};
