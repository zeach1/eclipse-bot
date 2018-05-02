'use strict';

class Command {
  constructor() {
    this.name = 'lina';

    this.description = 'Feeling angsty?';
    this.type = 'misc';
  }

  execute(message) {
    message.channel.send('**#ANGST**').catch(console.error);
  }
}

module.exports = new Command();
