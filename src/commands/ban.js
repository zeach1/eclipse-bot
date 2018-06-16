const Messenger = require('../helper/Messenger.js');

class Command {
  constructor() {
    this.name = 'ban';

    this.aliases = ['peril'];
    this.description = 'You can ban?';
    this.type = 'misc';
  }

  execute(message) {
    Messenger.sendImage(message, { url: 'https://i.imgur.com/WOjy315.gif' }).catch(console.error);
  }
}

module.exports = new Command();
