const Messenger = require('../helper/Messenger.js');

class Command {
  constructor() {
    this.name = 'lina';

    this.description = 'Feeling angsty?';
    this.type = 'misc';
  }

  execute(message) {
    message.channel.send('**#ANGST**').catch((e) => Messenger.sendDeveloperError(message, e));
  }
}

module.exports = Command;
