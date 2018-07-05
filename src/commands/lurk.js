const Messenger = require('../helper/Messenger.js');

class Command {
  constructor() {
    this.name = 'lurk';

    this.description = 'Lurking through the screen...';
    this.type = 'misc';
  }

  execute(message) {
    Messenger.sendImages(message, { url: 'https://i.imgur.com/JR5uChv.png' }).catch(e => Messenger.sendDeveloperError(message, e));
  }
}

module.exports = Command;
