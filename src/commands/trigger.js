const Messenger = require('../helper/Messenger.js');

class Command {
  constructor() {
    this.name = 'trigger';

    this.aliases = ['triggered'];
    this.description = 'I\'m so triggered right now';
    this.type = 'misc';
  }

  execute(message) {
    Messenger.sendImages(message, { url: 'https://cdn.discordapp.com/attachments/390086345957179393/408337364868530206/trigger.gif' }).catch(e => Messenger.sendDeveloperError(message, e));
  }
}

module.exports = Command;
