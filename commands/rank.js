const outdent = require('outdent');

const messenger = require('../helper/messenger.js');
const playerManager = require('../helper/playerManager.js');

const check = require('../misc/check.js');

module.exports = {
  name: 'rank',
  type: 'essentials',
  usage: '[user | top <exp | ranking> [number]]',
  aliases: ['info', 'stats'],
  description: 'Displays experience, level, and Eclipse Ranking (ER) of a player, or top players by exp or ranking (defaults to top 10, max 30 players)',

  execute: async function(message, param) {
    const { args } = param;

    switch (args[0]) {
      case 'top': return this.getTopPlayers(message, args);
      default:    return this.getPlayerScore(message);
    }
  },  

  getPlayerScore: async function(message) {
    const { client, mentions, member } = message;
    const player = mentions.members.first() ? mentions.members.first() : member;

    const { avatarURL, id } = player.user;

    const title = check.verifyLeadership({ member: player }) ? 'Leadership' :
                  check.verifyEclipse({ member: player }) ? 'Reddit Eclipse' :
                  check.verifyFriends({ member: player }) ? 'Friends of Eclipse' : 'Noob';

    let score = client.points.get(id);

    if (!score || !score.exp) score = { exp: 0, level: 0, ranking: 5000, flair: '⚔️' };

    const { exp, level, ranking, flair } = score;
    const expToLevelUp = playerManager.getExp(level + 1) - exp;
    const rank = playerManager.getPlayerRank(message, player.user, 'exp');

    return messenger.sendMessage(message, {
      title: `${player.displayName} | ${title}`,
      avatar: avatarURL ? avatarURL : 'https://discordapp.com/assets/dd4dbc0016779df1378e7812eabaa04d.png',
      color: rank === 1 ? 0xcfb53b :
             rank === 2 ? 0xc0c0c0 :
             rank === 3 ? 0xa67d3d : 0xcccccc,
      description: outdent({ 'trimLeadingNewline': true })`
        Level ${level} | **${ranking}** ER

        ${expToLevelUp} exp. to level up ${flair}
      `,
    });
  },

  getTopPlayers: async function(message, args) {
    const type = args[1];

    if (!type)
      return messenger.sendArgumentError(message, {
        name: this.name,
        usage: this.usage.slice(this.usage.indexOf('top'), -1),
      }, 'You must provide 2 arguments').catch(e => console.error(e));

    if (type !== 'exp' && type !== 'ranking')
      return messenger.sendArgumentError(message, {
        name: this.name,
        usage: this.usage.slice(this.usage.indexOf('top'), -1),
      }, 'That argument is invalid').catch(e => console.error(e));

    const scores = playerManager.getRankList(message, type);

    let number = !isNaN(args[2]) ? parseInt(args[2]) : 10;
    number = number > 30 ? 30 : number < 0 ? 10 : number;

    const longestExpLength = `${scores[0].exp} (${scores[0].level})`.length;
    const numberLength = number.toString().length;

    let description = '';
    for (let i = 1; i <= number; i++) {
      const score = scores[i - 1];

      const n       = `${i}`.padEnd(numberLength);
      const exp     = `${score.exp} (${score.level})`.padStart(longestExpLength);
      const ranking = `${score.ranking}`.padStart(4);
      const name    = score.name.substring(0, 25);

      description += `\`${n} ${type === 'exp' ? exp : ranking} |\` ${score.flair} ${name}\n`;
    }

    return messenger.sendMessage(message, {
      title: `🏅 Top Players by ${type === 'exp' ? 'EXP' : 'Eclipse Ranking'}`,
      color: 0xf5f513,
      description: description,
    });
  },
};
