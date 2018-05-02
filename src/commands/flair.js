'use strict';

const Emoji = require('../helper/Emoji.js');
const Messenger = require('../helper/Messenger.js');
const Rank = require('../helper/Rank.js');

class Command {
  constructor() {
    this.name = 'flair';

    this.args = 1;
    this.description = 'Set an emoji as your flair which will be displayed on your rank and on games. Supports server emojis plus more custom emojis (including Clash emojis!)';
    this.type = 'essentials';
    this.usage = '<emoji>';
  }

  execute(message) {
    const name = message.args.join(' ');
    const flair = Emoji.getEmoji(name, message.client);

    if (!flair) {
      Messenger.sendArgumentError(message, this, 'This flair is not supported by the server');
      return;
    }

    Rank.updateFlair(message, flair);

    Messenger.sendMessage(message, {
      title: '🎉 Flair Updated',
      color: 0x3ea92e,
      description: `You are now ${message.member.displayName} ${flair}`,
    });
  }
}

module.exports = new Command();
