const outdent = require('outdent');

const messenger = require('../helper/messenger.js');

module.exports = {
  name: 'rank',
  type: 'essentials',
  usage: '[user | top <exp | ranking>]',
  description: 'Get points and ranking of a player',

  execute: async function(message, param) {
    if (param.args[0] && param.args[0] === 'top') return this.getTopPlayers(message, param);

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

  getTopPlayers: async function(message, param) {
    if (param.args.length < 2)
      return messenger.sendArgumentError(message, {
        name: this.name,
        usage: this.usage.slice(this.usage.indexOf('top'), -1),
      }, 'You must provide 2 arguments').catch(e => console.error(e));

    return message.channel.send('WIP');
  },
};
