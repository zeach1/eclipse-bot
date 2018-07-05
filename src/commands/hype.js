const Messenger = require('../helper/Messenger.js');

class Command {
  constructor() {
    this.name = 'hype';

    this.description = 'Hype!';
    this.type = 'misc';
  }

  execute(message) {
    Messenger.sendImages(message, { url: 'https://i.imgur.com/L090lvT.gif' }).catch(e => Messenger.sendDeveloperError(message, e));
  }
}

module.exports = Command;
