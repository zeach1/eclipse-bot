const Messenger = require('../helper/Messenger.js');
const Util = require('../helper/Util.js');

const COOLDOWN = 60000;
const options = { year: 'numeric', month: 'long', day: 'numeric', hour: 'numeric', minute: 'numeric', timeZoneName: 'short' };

let working = false;

class Command {
  constructor() {
    this.name = 'time';

    this.description = 'Displays current time in Eclipse Time';
    this.type = 'essentials';
  }

  execute(message) {
    if (working) return;

    working = true;
    setTimeout(() => { working = false; }, COOLDOWN);

    const { date, time } = Util.getDateTimeLocale(new Date(), 'en-US', options);
    Messenger.sendMessage(message, {
      title: '⌚ Eclipse Time',
      description: `${date}, ${time}`,
      color: 0x00666f,
    });
  }
}

module.exports = new Command();
