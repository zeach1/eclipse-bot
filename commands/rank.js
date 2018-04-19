const outdent = require('outdent');

const messenger = require('../helper/messenger.js');
const playerManager = require('../helper/playerManager.js');

const check = require('../misc/check.js');
const name = require('../misc/name.js');
const memberMention = require('../misc/memberMention.js');

module.exports = {
  name: 'rank',
  type: 'essentials',
  usage: '[user]',
  aliases: ['info', 'level'],
  description: 'Displays experience, level, and ranking (ER) of a player',

  /**
   * @param {Discord.Message} message The message sent
   * @param {Object} param Contains arguments and options
   * @return {Promise<Discord.Message>}
   */
  execute: async function(message, param) {
    const { args } = param;
    const { client, mentions, member: author } = message;
    
    const name = args[0] ? args[0] : author.displayName;

    const player = mentions.members.first() || memberMention.getMemberByName(message, message.guild.members, name) || author;

    if (player.user.bot) return messenger.sendBotTagError(message, player);

    const title = check.verifyLeadership({ member: player }) ? 'Leadership' :
                  check.verifyEclipse({ member: player }) ? 'Reddit Eclipse' :
                  check.verifyFriends({ member: player }) ? 'Friends of Eclipse' : 'Noob';

    let score = client.points.get(player.id);
    if (!score || !score.exp) score = { exp: 0, level: 0, ranking: 5000, flair: '' };
    const { exp, level, ranking, flair } = score;

    const expToLevelUp = playerManager.getExp(level + 1) - exp - 1;
    const rank = playerManager.getPlayerRank(message, player.user, 'exp');

    return messenger.sendMessage(message, {
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
  },
};
