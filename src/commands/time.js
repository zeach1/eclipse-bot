const Messenger = require('../helper/Messenger.js');
const moment = require('moment-timezone');

const COOLDOWN = 15000;
const DATE_FORMAT = 'MMMM D, YYYY, h:mm A z';

let working = false;

class Command {
  constructor() {
    this.name = 'time';

    this.description = 'Displays current time in Eclipse\'s default timezone';
    this.type = 'essentials';
  }

  execute(message) {
    if (working) {
      message.delete().catch(() => {});
      return;
    }

    working = true;
    setTimeout(() => { working = false; }, COOLDOWN);

    Messenger.sendMessage(message, {
      title: '⌚ Current Time',
      description: moment().format(DATE_FORMAT),
      color: 0x00666f,
    });
  }
}

module.exports = Command;
