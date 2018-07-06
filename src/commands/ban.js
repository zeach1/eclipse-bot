const Messenger = require('../helper/Messenger.js');

class Command {
  constructor() {
    this.name = 'ban';

    this.aliases = ['peril'];
    this.description = 'You can ban?';
    this.type = 'misc';
  }

  execute(message) {
    Messenger.sendImages(message, { url: 'https://i.imgur.com/WOjy315.gif' });
  }
}

module.exports = Command;
