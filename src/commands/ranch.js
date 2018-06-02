'use strict';

const { user } = require('../config/config.js');

let done = true;

function callRanch(message, num) {
  if (num <= 0) {
    message.channel.send('Ok I\'m done');
    done = true;
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
    if (!done) return;

    done = false;
    const num = parseInt(message.args[0]) || 0;
    message.channel.send('Well you wanted a command, and I personally had no better idea on what to send, so I\'ll just ping you instead...');

    setTimeout(() => {
      if (num === 0) {
        message.channel.send('or maybe not...');
        done = true;
        return;
      }
      callRanch(message, num > 10 ? 10 : num);
    }, 2000);
  }
}

module.exports = new Command();
