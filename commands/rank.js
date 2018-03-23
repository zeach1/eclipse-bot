const outdent = require('outdent');

const messenger = require('../helper/messenger.js');
const playerManager = require('../helper/playerManager.js');

const check = require('../misc/check.js');

module.exports = {
  name: 'rank',
  type: 'developer',
  usage: '[user | top <exp | ranking> [number]]',
  aliases: ['info', 'level', 'stats'],
  description: 'Displays experience, level, and Eclipse Ranking (ER) of a player, or top players (defaults to top 10)',

  execute: async function(message, param) {
    const { args } = param;

    switch (args[0]) {
      case 'top': return this.getTopPlayers(message, args);
      default:    return this.getPlayerStats(message);
    }
  },

  getPlayerStats(message) {
    const { client, mentions, member } = message;
    const player = mentions.members.first() ? mentions.members.first() : member;
    const { avatarURL, id } = player.user;
    
    const title = check.verifyLeadership({ member: player }) ? 'Leadership' :
                  check.verifyEclipse({ member: player }) ? 'Reddit Eclipse' :
                  check.verifyFriends({ member: player }) ? 'Friends of Eclipse' : 'Noob';


    let stats = client.points.get(id);
    if (!stats || !stats.exp) stats = playerManager.new;
    
    const { exp, level, ranking, flair } = stats;
    const expToLevelUp = playerManager.getExp(level + 1) - exp;
    const rank = playerManager.getPlayerRank(message, player.user, 'exp');

    return messenger.send(message, {
      title: `${player.displayName} | ${title}`,
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

  getTopPlayers: async function(message, args) {
    if (args.length < 2)
      return messenger.sendArgumentError(message, {
        name: this.name,
        usage: this.usage.slice(this.usage.indexOf('top'), -1),
      }, 'You must provide 2 arguments').catch(e => console.error(e));
    
    const type = args[1];
    
    if (type !== 'exp' && type !== 'ranking')
      return messenger.sendArgumentError(message, {
        name: this.name,
        usage: this.usage.slice(this.usage.indexOf('top'), -1),
      }, 'That argument is invalid').catch(e => console.error(e));
    
    const scores = playerManager.getRankList(message, type);
    
    let description = '';
    for (let i = 0; i < (!isNaN(args[2]) ? parseInt(args[2]) : 10); i++) {
      const { id, exp, level, ranking, flair } = scores[i];
      
      const displayName = message.guild.members.get(id).displayName;
      description += `**${i + 1}**\t${type === 'exp' ? `${exp} exp | Level ${level}` : `${ranking} ER`} | ${displayName} ${flair}\n`;
    }
    
    return messenger.send(message, {
      title: 'Top Players',
      description: description,
    });
  },
};
