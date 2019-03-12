const { clanName, subreddit } = require('../config/config.js');
const Messenger = require('../helper/Messenger.js');

class Command {
  constructor() {
    this.name = 'sub';

    this.description = `Shows ${clanName}'s subreddit link`;
    this.type = 'essentials';
  }

  execute(message) {
    Messenger.sendMessage(message, {
      title: `${clanName} subreddit`,
      avatar: message.guild.iconURL,
      description: subreddit,
      color: 0x68b87a,
      request: true,
    });
  }
}

module.exports = Command;
