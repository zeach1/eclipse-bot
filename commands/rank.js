const outdent = require('outdent');

const messenger = require('../helper/messenger.js');
const pointManager = require('../helper/pointManager.js');

const check = require('../misc/check.js');
const emoji = require('../misc/emoji.js');

module.exports = {
  name: 'rank',
  type: 'developer',
  usage: '[user | top <exp | ranking>]',
  aliases: ['info', 'level'],
  description: 'Displays exp and Eclipse Ranking (ER) of a player',

  execute: async function(message, param) {
    const { args } = param;
    
    switch (args[0]) {
      case 'top': return this.getTopPlayers(message, args);
      default:    return this.getPlayerPoints(message)
    }
  },
  
  getPlayerPoints(message) {
    const { client, mentions, member } = message;
    
    const player = mentions.members.first() ? mentions.members.first() : member;
    const title = check.verifyLeadership({ member: player }) ? 'Leadership' :
                  check.verifyEclipse({ member: player }) ? 'Reddit Eclipse' : 
                  check.verifyFriends({ member: player }) ? 'Friends of Eclipse' : 'Noob';
    
    const { user, displayName } = player;
    const { avatarURL, id } = user;
    const { exp, level, ranking } = client.points.get(id) ? client.points.get(id) : { exp: 0, level: 0, ranking: 5000 };
    
    const expLevel = pointManager.getExp(level);
    const expNextLevel = pointManager.getExp(level + 1);
    
    const currentExp = exp - expLevel;
    const expToLevelUp = expNextLevel - expLevel;
    
    return messenger.sendMessage(message, {
      title: `${displayName} | ${title}`,
      avatar: avatarURL ? avatarURL : 'https://discordapp.com/assets/dd4dbc0016779df1378e7812eabaa04d.png',
      color: 0xcccccc,
      description: outdent({ 'trimLeadingNewline': true })`
        Level ${level} | ${currentExp}/${expToLevelUp}
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
