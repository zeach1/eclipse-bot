const fs = require('fs');

const messenger = require('../helper/messenger.js');
const playerManager = require('../helper/playerManager.js');

const emoji = require('../misc/emoji.js');

module.exports = {
  name: 'dev',
  type: 'developer',
  usage: '<load | save | set <user> <exp> [ranking] [flair]',
  description: 'Developer commands, used for maintenance and testing',

  args: 1,

  execute: async function(message, param) {
    const { args } = param;

    switch (args[0]) {
      case 'load': return this.load(message, './data/players.json');
      case 'save': return this.save(message, './data/players.json');
      case 'set': return this.set(message, args.slice(1));
      default: return messenger.sendArgumentError(message, this, 'This argument does not exist');
    }
  },

  load: async function(message, path) {
    const players = JSON.parse(fs.readFileSync(path, 'utf8'));

    for (const { id, exp, ranking, flair } of players) {
      playerManager.setPlayer(message, { id: id }, {
        exp: exp,
        ranking: ranking,
        flair: flair,
      });
    }

    return message.channel.send('Player backup loaded.');
  },

  save: async function(message, path) {
    const { client, guild, channel } = message;
    const { points }  = client;
    const players = [];

    for (const { user } of guild.members.array()) {
      if (points.get(user.id)) {
        const { exp, ranking, flair } = points.get(user.id);

        players.push({
          id: user.id,
          exp: exp,
          ranking: ranking,
          flair: flair,
        });
      }
    }

    return fs.writeFile(path, JSON.stringify(players), e => {
      if (e) console.error(e);
      channel.send('Points backup saved.');
    });
  },

  set: async function(message, args) {
    /* args = [user, exp, ranking, flair] */
    if (args.length < 2 || !message.mentions || isNaN(args[1]) || (args[2] && isNaN(args[2])))
      return messenger.sendArgumentError(message, this, 'Wrong argument usage');

    const player = message.mentions.users.first();
    const { points } = message.client;

    playerManager.setPlayer(message, player, {
      exp: args[1],
      ranking: args[2],
      flair: emoji.getEmoji(args[3], message.client),
    });

    const { exp, level, ranking, flair } = points.get(player.id);

    return message.channel.send(`Set <@${player.id}>'s exp to ${exp}, level ${level}, ${ranking} ER ${flair ? flair : ''}`);
  },
};
