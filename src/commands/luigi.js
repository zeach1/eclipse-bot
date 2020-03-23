const Messenger = require('../helper/Messenger.js');

class Command {
  constructor() {
    this.name = 'luigi';

    this.description = 'Dancing Luigi';
    this.type = 'misc';
  }

  execute(message) {
    Messenger.sendImages(message, { url: 'https://i.imgur.com/SjRwl3T.gif' })
      .catch((e) => Messenger.sendDeveloperError(message, e));
  }
}

module.exports = Command;
