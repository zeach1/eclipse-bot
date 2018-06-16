const Messenger = require('../helper/Messenger.js');

class Command {
  constructor() {
    this.name = 'luigi';

    this.description = 'Dancing Luigi';
    this.type = 'misc';
  }

  execute(message) {
    Messenger.sendImage(message, { url: 'https://i.imgur.com/SjRwl3T.gif' }).catch(console.error);
  }
}

module.exports = new Command();
