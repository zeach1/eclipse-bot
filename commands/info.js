const outdent = require('outdent');

<<<<<<< HEAD
const messenger = require('../help/messenger.js');

module.exports = {
  name: 'info',
  type: 'developer',
  usage: '[top | user]',

  execute: async function(message, args) {
    const { client, mentions, member } = message;

    if (args[0] && args[0] === 'top')
      return this.getTopPlayers(message);

    const player = mentions.members.first() ? mentions.members.first() : member;
=======
const messenger = require('../helper/messenger.js');

module.exports = {
  name: 'info',
  type: 'essentials',
  usage: '[user | top]',
  description: 'Get points and ranking of a player',

  execute: async function(message, param) {
    const { args } = param;

    if (args[0] && args[0] === 'top') return this.getTopPlayers(message);

    const { client, mentions, member } = message;
    const player = mentions.members.first() ? mentions.members.first() : member;

    if (player.user.bot) return messenger.sendBotTagError(message, player);

>>>>>>> glitch
    const { user, displayName } = player;
    const { avatarURL, id } = user;

    const { exp, level, ranking } = client.points.get(id) ? client.points.get(id) : 0;

    return messenger.sendMessage(message, {
      title: displayName,
<<<<<<< HEAD
      avatar: avatarURL,
      color: 0xcccccc,
      description: outdent({ 'trimLeadingNewline': true })`
        **${ranking}** ER
        Level ${level} (${exp})
      `,
      request: true,
=======
      avatar: avatarURL ? avatarURL : 'https://discordapp.com/assets/dd4dbc0016779df1378e7812eabaa04d.png',
      color: 0xcccccc,
      description: outdent({ 'trimLeadingNewline': true })`
        **${ranking ? ranking : 5000}** ER
        Level ${level ? level : 0} (${exp ? exp : 0})
      `,
>>>>>>> glitch
    });
  },

  getTopPlayers: function(message) {
    return message.channel.send('WIP');
  },
};
