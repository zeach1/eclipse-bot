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
    const emojiNames = nameFunctions.inOrder(client.emojis.map(emoji => emoji.name));

    name = name.replace(/[^a-z0-9]/g, '');
    const customemojiName = emojiNames.find(emojiName => {
      emojiName = emojiName.replace(/[^a-zA-Z0-9]/g, '');

      return nameFunctions.match(emojiName, name);
    });

    if (!customemojiName) return null;
    
    const customemoji = client.emojis.find('name', customemojiName);
    return `<:${customemoji.name}:${customemoji.id}>`;
  },
};
