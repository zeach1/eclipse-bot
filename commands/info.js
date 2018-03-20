const outdent = require('outdent');

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
    const { user, displayName } = player;
    const { avatarURL, id } = user;

    const { exp, level, ranking } = client.points.get(id) ? client.points.get(id) : 0;

    return messenger.sendMessage(message, {
      title: displayName,
      avatar: avatarURL,
      color: 0xcccccc,
      description: outdent({ 'trimLeadingNewline': true })`
        **${ranking}** ER
        Level ${level} (${exp})
      `,
      request: true,
    });
  },

  getTopPlayers: function(message) {
    return message.channel.send('WIP');
  },
};
