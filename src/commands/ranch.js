const { user } = require('../config/config.js');

let working = false;

function callRanch(message, num) {
  if (num <= 0) {
    message.channel.send('Ok I\'m done');
    working = false;
    return;
  }

  message.channel.send(`Hey <@${user.ranch}>`);
  setTimeout(() => callRanch(message, num - 1), 2000);
}

class Command {
  constructor() {
    this.name = 'ranch';

    this.description = 'Welp here\'s something';
    this.type = 'misc';
    this.usage = '[number]';
  }

  execute(message) {
    if (working) return;

    working = true;
    const num = parseInt(message.args[0]) || 0;
    message.channel.send('Well you wanted a command, and I personally had no better idea on what to send, so I\'ll just ping you instead...');

    setTimeout(() => {
      if (num === 0) {
        message.channel.send('or maybe not...');
        working = false;
        return;
      }
      callRanch(message, num > 10 ? 10 : num);
    }, 2000);
  }

  fix() {
    working = false;
  }
}

module.exports = Command;
