const outdent = require('outdent');

const messenger = require('../helper/messenger.js');

module.exports = {
  name: 'info',
  type: 'developer',
  usage: '[top | user]',
  description: 'Get points and ranking of a player',

  execute: async function(message, param) {
    const { args } = param;

    if (args[0] && args[0] === 'top') return this.getTopPlayers(message);
    
    const { client, mentions, member } = message;
    const player = mentions.members.first() ? mentions.members.first() : member;
    
    if (player.user.bot) return messenger.sendBotTagError(message, player);
    
    const { user, displayName } = player;
    const { avatarURL, id } = user;

    const { exp, level, ranking } = client.points.get(id) ? client.points.get(id) : 0;

    return messenger.sendMessage(message, {
      title: displayName,
      avatar: avatarURL ? avatarURL : 'https://discordapp.com/assets/dd4dbc0016779df1378e7812eabaa04d.png',
      color: 0xcccccc,
      description: outdent({ 'trimLeadingNewline': true })`
        **${ranking ? ranking : 5000}** ER
        Level ${level ? level : 0} (${exp ? exp : 0})
      `,
    });
  },

  getTopPlayers: function(message) {
    return message.channel.send('WIP');
  },
};
