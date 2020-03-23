const twemoji = require('twemoji');
const Util = require('./Util.js');

function getTwemoji(text) {
  return twemoji.parse(text).startsWith('<img') ? text : null;
}

function getEmojiById(text, client) {
  if (!text.startsWith('<')) return null;

  const id = text.slice(text.lastIndexOf(':') + 1, -1);
  const emoji = client.emojis.get(id);

  return emoji ? `<:${emoji.name}:${id}>` : null;
}

function getEmojiByName(text, client) {
  let newText = text;
  if (text.startsWith('<')) {
    newText = text.slice(2, text.lastIndexOf(':') + 1);
  }

  let names = client.emojis.map((emoji) => emoji.name);
  names = Util.sort(names, false, true);

  const emojiName = names.find((name) => Util.match(newText, name, true));
  const emoji = emojiName ? client.emojis.find('name', emojiName) : null;

  return emoji ? `<:${emoji.name}:${emoji.id}>` : null;
}

class Emoji {
  static getEmoji(text, client) {
    return text
      ? getTwemoji(text) || getEmojiById(text, client) || getEmojiByName(text, client)
      : null;
  }
}

module.exports = Emoji;
