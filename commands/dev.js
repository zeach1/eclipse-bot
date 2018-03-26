const fs = require('fs');

const playerManager = require('../helper/playerManager.js');

const emoji = require('../misc/emoji.js');

module.exports = {
  name: 'dev',
  type: 'developer',

  execute: async function(message, param) {
    const { args } = param;

    if (!args) return message.channel.send('Needs argument');

    switch (args[0]) {
      case 'countdown': return this.countdown(message, 10);
      case 'reset': return this.resetRanking(message);
      case 'test': return this.testRanking(message);
      case 'load': return this.load(message);
      case 'save': return this.save(message);
      case 'set':
        if (args.length < 3 || !message.mentions || isNaN(args[2]) || (args[3] && isNaN(args[3])) || (args[4] && !emoji.getEmoji(args[4])))
          return message.channel.send('Wrong usage');

        return this.setPlayer(message, parseInt(args[2]), parseInt(args[3]), args[4]);

      default: return message.channel.send('Wrong argument');
    }
  },

  countdown: async function(message, num) {
    if (num === 0) return;

    await message.channel.send(num).delete(1000).catch(e => console.error(e));

    setTimeout(() => this.countdown(message, num - 1), 1000);
  },

  load: async function(message) {
    const players = JSON.parse(fs.readFileSync('./data/players.json', 'utf8'));

    for (const { id, exp, ranking, flair } of players) {
      playerManager.setPlayer(message, { id: id }, {
        exp: exp,
        ranking: ranking,
        flair: flair,
      });
    }

    return message.channel.send('Player backup loaded.');
  },

  save: async function(message) {
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

    return fs.writeFile('./data/players.json', JSON.stringify(players), e => {
      if (e) console.error(e);
      channel.send('Points backup saved.');
    });
  },

  setPlayer: async function(message, EXP, RANKING, FLAIR) {
    const player = message.mentions.users.first();
    const { points } = message.client;

    playerManager.setPlayer(message, player, {
      exp: EXP,
      ranking: RANKING,
      flair: FLAIR,
    });

    const { exp, level, ranking, flair } = points.get(player.id);

    return message.channel.send(`Set <@${player.id}>'s exp to ${exp}, level ${level}, ${ranking} ER ${flair ? flair : ''}`);
  },

  loadFromMee6: async function(message) {
    function parseArray(msg, num, array) {
      if (num == array.length)
        return message.channel.send(`Done. Array size is ${array.length}`);

      const { user } = array[num];

      /* Does not update jwoelmer or Danny, since they do not want to be tagged */
      if (user.bot || user.id === '274595926314844161' || user.id === '257195016458469376') {
        this.parseArray(message, num + 1, array);
        return;
      }

      message.channel.send(`!rank <@${user.id}>`);

      setTimeout(() => {
        parseArray(message, num + 1, array);
      }, 3500);
    }

    parseArray(message, 0, message.guild.members.array());
  },
};
