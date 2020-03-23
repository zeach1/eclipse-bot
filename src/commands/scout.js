const { categoryChannel, channel } = require('../config/config.js');
const Messenger = require('../helper/Messenger.js');

const ARMY_COMPOSITIONS = {
  title: 'Army Compositions',
  description: '*General armies to use for your scout*',
  fields: [
    {
      title: 'TH10',
      description: [
        'Falcon',
        'Witchslap',
        'GoVaHo',
      ],
    },
    {
      title: 'TH11+',
      description: [
        'Baby dragon, loon, valks, bowlers, wiz/healer',
        'Mass hog mixed with balloons',
      ],
    },
  ],
};
const GUIDELINES = {
  title: 'Guidelines',
  description: '*Priority things to look out for*',
  fields: [
    {
      title: 'Teslas',
      description: [
        'Use skeleton spells on areas you cannot reach with normal troops',
        'Getting 51% damage activates all teslas',
        'Check corner teslas using archers',
      ],
    },
    {
      title: 'Clan Castle troops',
      description: [
        'Send your killsquad within the Clan Castle range',
      ],
    },
    {
      title: 'Traps',
      description: [
        'Determine the attack that the top player will use (ground or air)',
        'Use balloons to find external air mines',
        'Use your killsquad to find giant bomb locations',
        'Use wallbreakers to find external bombs/springs',
        'See if you can trigger some air/ground skeleton traps',
      ],
    },
    {
      title: 'Defenses',
      description: [
        'Try to avoid Inferno Towers, bring freeze if you cannot',
        'Delay Eagle Artillery deployment (180 troop activation)',
      ],
    },
  ],
};

class Command {
  constructor() {
    this.name = 'scout';

    this.description = 'Tips for a scout in war';
    this.type = 'eclipse';
  }

  execute(message) {
    if (message.channel.id !== channel.development
      && message.channel.parentID !== categoryChannel.war_room) {
      Messenger.sendError(message, {
        title: '🛡️ Wrong Channel',
        message: 'You can\'t call this command here',
        submessage: 'You can only use this in the War Room',
      });
      return;
    }

    Messenger.sendScoutTips(message, [GUIDELINES, ARMY_COMPOSITIONS]);
  }
}

module.exports = Command;
