const outdent = require('outdent');

const messenger = require('../helper/messenger.js');
const playerManager = require('../helper/playerManager.js');

const check = require('../misc/check.js');

module.exports = {
  name: 'rank',
  type: 'essentials',
  usage: '[user]',
  aliases: ['info', 'level'],
  description: 'Displays experience, level, and ranking (ER) of a player',

  execute: async function(message) {
    const { client, mentions, member } = message;
    const player = mentions.members.first() ? mentions.members.first() : member;

    const { avatarURL, id } = player.user;

    const title = check.verifyLeadership({ member: player }) ? 'Leadership' :
                  check.verifyEclipse({ member: player }) ? 'Reddit Eclipse' :
                  check.verifyFriends({ member: player }) ? 'Friends of Eclipse' : 'Noob';

    let score = client.points.get(id);
    if (!score || !score.exp) score = { exp: 0, level: 0, ranking: 5000, flair: '' };

    const { exp, level, ranking, flair } = score;
    const expToLevelUp = playerManager.getExp(level + 1) - exp;
    const rank = playerManager.getPlayerRank(message, player.user, 'exp');

    return messenger.sendMessage(message, {
      title: `${player.displayName} | ${title}`,
      avatar: avatarURL ? avatarURL : 'https://discordapp.com/assets/dd4dbc0016779df1378e7812eabaa04d.png',
      color: rank === 1 ? 0xcfb53b :
             rank === 2 ? 0xc0c0c0 :
             rank === 3 ? 0xa67d3d : 0x696969,
      description: outdent({ 'trimLeadingNewline': true })`
        Level ${level} | **${ranking}** ER

        ${expToLevelUp} exp. to level up (${exp}) ${flair}
      `,
    });
  },
};
