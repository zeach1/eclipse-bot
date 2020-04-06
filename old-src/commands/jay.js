const Messenger = require('../helper/Messenger.js');

class Command {
  constructor() {
    this.name = 'jay';

    this.args = 1;
    this.description = 'Something important for you to know';
    this.type = 'misc';
    this.usage = '<respect | fear>';
  }

  execute(message) {
    const arg = message.args[0];
    switch (arg) {
      case 'respect': case 'fear': {
        Messenger.sendMessage(message, {
          title: `${arg.charAt(0).toUpperCase()}${arg.slice(1)} Jay`,
          description: arg === 'respect'
            ? '@everyone respect the dark knight of Go Canada!'
            : 'You are too weak to take it.',
        });
        break;
      }
      default: Messenger.sendArgumentError(message, this, 'Jay does not approve of this argument'); break;
    }
  }
}

module.exports = Command;
