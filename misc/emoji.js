const twemoji = require('twemoji');

const nameFunctions = require('./name.js');
module.exports = {
  /**
   * Gets an emoji from given name. Name can be actual emoji, or just a string, or mixed letters.
   * Command is supposed to be as user-friendly and as flexible as possible.
   * Can lead to possible bugs, but I constantly test this to make sure it's successfully working.
   * @param {string} name Name of emoji
   * @param {Discord.Client} client Message that was sent's client
   * @return {string}
   */
  getEmoji: function(name, client) {
    return name ? this._getTwemoji(name) || this._getServerEmoji(name, client) || this._getCustomEmoji(name, client) : null;
  },

  /**
   * Returns the twemoji if the user requests using a twemoji.
   * See more about twemoji: https://github.com/twitter/twemoji
   * @param {string} name Name of emoji
   * @return {string}
   */
  _getTwemoji: function(name) {
    return twemoji.parse(name).startsWith('<img') ? name : null;
  },

  /**
   * Returns a server emoji, a custom emoji supported by the server.
   * Note that Eclipse Bot knows more than just emojis from the server, but from others too, as bots
   * can use emojis from other servers in any server.
   * @param {string} name Name of emoji
   * @param {Discord.Client} client Message that was sent's client
   * @return {string}
   */
  _getServerEmoji: function(name, client) {
    if (!name.startsWith('<'))
      return null;

    const serveremoji = client.emojis.get(name.substring(2, name.length - 2));
    return serveremoji ? `<:${serveremoji.name}:${serveremoji.id}>` : null;
  },

  /**
   * Returns a custom emoji. This can range from the server emojis or another server's emojis.
   * @param {string} name Name of emoji
   * @param {Discord.Client} client Message that was sent's client
   * @return {string}
   */
  _getCustomEmoji: function(name, client) {
    const emojis = nameFunctions.inOrder(client.emojis.array);

    const nameTrimmed = name.replace(/ /g, '');
    const customemoji = emojis.find(emoji => {
      const emoji1 = emoji.name.replace(/[-_]/g, ' ');
      const emoji2 = emoji1.replace(/ /g, '');

      return nameFunctions.match(emoji.name, name) || nameFunctions.match(emoji2, nameTrimmed) || nameFunctions.match(emoji1, name);
    });

    return customemoji ? `<:${customemoji.name}:${customemoji.id}>` : null;
  },
};
