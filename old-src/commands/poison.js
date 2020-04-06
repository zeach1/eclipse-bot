const Messenger = require('../helper/Messenger.js');

class Command {
  constructor() {
    this.name = 'poison';

    this.description = 'Can you properly kill the clan castle troops?';
    this.type = 'misc';
  }

  execute(message) {
    Messenger.sendImages(message, [
      { url: 'https://i.imgur.com/RG0lRA1.png' },
      {
        url: 'https://i.imgur.com/7hJSaQK.png',
        delay: 3000,
      },
      {
        url: 'https://i.imgur.com/sDIsfhj.png',
        delay: 4000,
      },
      {
        url: 'https://i.imgur.com/zi1QV9r.png',
        delay: 2000,
      },
    ]);
  }
}

module.exports = Command;
