const outdent = require('outdent');

const messenger = require('../helper/messenger.js');
const playerManager = require('../helper/playerManager.js');

const check = require('../misc/check.js');

module.exports = {
  name: 'rank',
  type: 'essentials',
  usage: '[user | top <exp | ranking>]',
  aliases: ['info', 'level'],
  description: 'Displays experience, level, and Eclipse Ranking (ER) of a player',

  execute: async function(message, param) {
    const { args } = param;

    switch (args[0]) {
      case 'top': return this.getTopPlayers(message, args);
      default:    return this.getPlayer(message);
    }
  },

  getPlayer(message) {
    const { client, mentions, member } = message;

    const player = mentions.members.first() ? mentions.members.first() : member;
    const title = check.verifyLeadership({ member: player }) ? 'Leadership' :
                  check.verifyEclipse({ member: player }) ? 'Reddit Eclipse' :
                  check.verifyFriends({ member: player }) ? 'Friends of Eclipse' : 'Noob';

    const { user, displayName } = player;
    const { avatarURL, id } = user;
    const { exp, level, ranking, flair } = client.points.get(id) ? client.points.get(id) : playerManager.new;

    const expToLevelUp = playerManager.getExp(level + 1) - exp;
    const rank = playerManager.getPlayerRank(message, user, 'exp');

    return messenger.send(message, {
      title: `${displayName} | ${title}`,
      avatar: avatarURL ? avatarURL : 'https://discordapp.com/assets/dd4dbc0016779df1378e7812eabaa04d.png',
      color: rank === 1 ? 0xcfb53b :
             rank === 2 ? 0xe6e8fa :
             rank === 3 ? 0xa67d3d : 0xcccccc,
      description: outdent({ 'trimLeadingNewline': true })`
        Level ${level} | **${ranking}** ER

        ${expToLevelUp} exp. to level up ${flair}
      `,
    });
  },

  getTopPlayers: async function(message, param) {
    if (param.args.length < 2)
      return messenger.sendArgumentError(message, {
        name: this.name,
        usage: this.usage.slice(this.usage.indexOf('top'), -1),
      }, 'You must provide 2 arguments').catch(e => console.error(e));

    return message.channel.send('WIP');
  },
};
