const { categoryChannel } = require('../config/config.js');
const Messenger = require('../helper/Messenger.js');

const ARMY_COMPOSITIONS = [
  {
    name: 'TH10',
    armies: [],
  },
  {
    name: 'TH11+',
    armies: [],
  },
];
const GUIDELINES = [
  {
    topic: 'Teslas',
    tips: [
      'Use skeleton spells on areas you cannot reach with normal troops',
      'Getting 51% damage activates all teslas',
      'Check corner teslas using archers',
    ],
  },
  {
    topic: 'Clan Castle troops',
    tips: [],
  },
  {
    topic: 'Traps',
    tips: [],
  },
];

class Command {
  constructor() {
    this.name = 'scout';

    this.description = 'Tips for a scout in war';
    this.type = 'misc';
  }

  execute(message) {
    if (message.channel.parentID === categoryChannel.war_room) {
      Messenger.sendError(message, {
        title: '🛡️ Wrong Channel',
        message: 'You can\'t call this command here',
        submessage: 'You can only use this in the War Room',
      });
      return;
    }

    Messenger.sendScoutMessage(message, GUIDELINES, ARMY_COMPOSITIONS);
  }
}

module.exports = Command;
