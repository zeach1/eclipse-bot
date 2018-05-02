'use strict';

const Messenger = require('../helper/Messenger.js');

class Command {
  constructor() {
    this.name = 'hype';

    this.description = 'Hype!';
    this.type = 'misc';
  }

  execute(message) {
    Messenger.sendImage(message, { url: 'https://i.imgur.com/L090lvT.gif' }).catch(console.error);
  }
}

module.exports = new Command();
