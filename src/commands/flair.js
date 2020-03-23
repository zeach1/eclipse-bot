const outdent = require('outdent');
const Emoji = require('../helper/Emoji.js');
const Messenger = require('../helper/Messenger.js');
const { prefix } = require('../config/config.js');
const Rank = require('../helper/Rank.js');

class Command {
  constructor() {
    this.name = 'flair';

    this.args = 1;
    this.description = 'Set an emoji as your flair which will be displayed on your rank and on games';
    this.type = 'essentials';
    this.usage = '<emoji | clear>';

    this.details = outdent`
      ${outdent}
      \`emoji |\` set your flair with an emoji. Your flair will be reflected in ranking boards and your rank (try ${prefix}rank). Supports all server emojis, any Clash of Clans troop/hero icon, and more!
      \`clear |\` removes your flair
    `;
  }

  execute(message) {
    if (message.args[0] === 'clear') {
      Rank.updateFlair(message, '');
      Messenger.sendMessage(message, {
        title: '🎉 Flair Cleared',
        color: 0x3ea92e,
        description: `You are now ${message.member.displayName}`,
      });
      return;
    }

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

module.exports = Command;
