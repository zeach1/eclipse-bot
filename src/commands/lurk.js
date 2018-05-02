'use strict';

const Messenger = require('../helper/Messenger.js');

class Command {
  constructor() {
    this.name = 'lurk';

    this.description = 'Lurking through the screen...';
    this.type = 'misc';
  }

  execute(message) {
    Messenger.sendImage(message, { url: 'https://i.imgur.com/JR5uChv.png' }).catch(console.error);
  }
}

module.exports = new Command();
