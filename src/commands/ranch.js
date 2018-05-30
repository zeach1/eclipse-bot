'use strict';

const { user } = require('../config/config.js');

let done = true;

function callRanch(message, num) {
  if (num <= 0) {
    done = true;
    return;
  }

  message.channel.send(`Hey <@${user.ranch}>`);
  setTimeout(() => callRanch(message, num - 1), 2000);
}

class Command {
  constructor() {
    this.name = 'ranch';

    this.description = 'Welp';
    this.type = 'misc';
  }

  execute(message) {
    if (!done) return;

    done = false;
    const num = parseInt(message.args[0]);
    message.channel.send('Well you wanted a command, and I personally had no better idea on what to send, so I\'ll just ping you instead');

    setTimeout(() => callRanch(message, !num ? 5 : num > 30 ? 30 : num), 2000);
  }
}

module.exports = new Command();
