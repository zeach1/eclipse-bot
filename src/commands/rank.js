'use strict';

const Check = require('../helper/Check.js');
const Member = require('../helper/Member.js');
const Messenger = require('../helper/Messenger.js');
const Rank = require('../helper/Rank.js');
const outdent = require('outdent');

class Command {
  constructor() {
    this.name = 'rank';

    this.aliases = ['info', 'level'];
    this.description = 'Displays experience, level, and ranking (ER) of a player';
    this.type = 'essentials';
    this.usage = '[user]';
  }

  execute(message) {
    const name = message.args[0];

    let player;
    if (message.args[0]) {
      player = message.mentions.members.first() || Member.findMemberByName(message, message.guild.members, name) || message.member;
    } else {
      player = message.member;
    }

    if (player.user.bot) {
      Messenger.sendBotTagError(message, player);
      return;
    }

    const title = Check.isLeadership(player) ? 'Leadership' :
      Check.isEclipse(player) ? 'Reddit Eclipse' :
        Check.isFriends(player) ? 'Friends of Eclipse' : 'Noob';

    let score = message.client.points.get(player.id);
    if (!score || !score.exp) score = { exp: 0, level: 0, ranking: 5000, flair: '' };
    const { exp, level, ranking, flair } = score;

    const expToLevelUp = Rank.getExp(level + 1) - exp - 1;
    const rank = 1 + Rank.getRankList(message, 'exp').findIndex(r => r.id === player.id);

    Messenger.sendMessage(message, {
      title: `${player.displayName} | ${title}`,
      avatar: player.user.avatarURL ? player.user.avatarURL : 'https://discordapp.com/assets/dd4dbc0016779df1378e7812eabaa04d.png',
      color: rank === 1 ? 0xcfb53b :
        rank === 2 ? 0xc0c0c0 :
          rank === 3 ? 0xa67d3d : 0x696969,
      description: outdent`
        ${outdent}
        Level ${level} | **${ranking}** ER

        ${expToLevelUp} exp. to level up (${exp}) ${flair}
      `,
    });
  }
}

module.exports = new Command();
