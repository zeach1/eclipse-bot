const outdent = require('outdent');
const Check = require('../helper/Check.js');
const Member = require('../helper/Member.js');
const Messenger = require('../helper/Messenger.js');
const Rank = require('../helper/Rank.js');

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
      player = message.mentions.members.first()
        || Member.findMemberByName(message, message.guild.members, name) || message.member;
    } else {
      player = message.member;
    }

    if (player.user.bot) {
      Messenger.sendBotTagError(message, player);
      return;
    }

    let title = 'Noob';
    if (Check.isLeadership(player)) {
      title = 'Leadership';
    } else if (Check.isEclipse(player)) {
      title = 'Reddit Eclipse';
    } else if (Check.isFriends(player)) {
      title = 'Friends of Eclipse';
    }

    let score = message.client.points.get(player.id);
    if (!score || !score.exp) {
      score = {
        exp: 0, level: 0, ranking: 5000, flair: '',
      };
    }
    const {
      exp, level, ranking, flair,
    } = score;

    const expToLevelUp = Rank.getExp(level + 1) - exp - 1;
    const rank = 1 + Rank.getRankList(message, 'exp').findIndex((r) => r.id === player.id);

    let color;
    switch (rank) {
      case 1: color = 0xffd700; break;
      case 2: color = 0xc0c0c0; break;
      case 3: color = 0xcd7f32; break;
      case 4: color = 0xb87333; break;
      case 5: color = 0xd3d4d5; break;
      case 11: color = 0x696969; break;
      default: color = 0xeee; break;
    }

    Messenger.sendMessage(message, {
      title: `${player.displayName} | ${title}`,
      avatar: player.user.avatarURL ? player.user.avatarURL : 'https://discordapp.com/assets/dd4dbc0016779df1378e7812eabaa04d.png',
      color,
      description: outdent`
        ${outdent}
        Level ${level} | **${ranking}** ER

        ${expToLevelUp} exp. to level up (${exp}) ${flair}
      `,
    });
  }
}

module.exports = Command;
