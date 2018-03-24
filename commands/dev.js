const fs = require('fs');

const { user: u } = require('../data/config.js');

const playerManager = require('../helper/playerManager.js');

module.exports = {
  name: 'dev',
  type: 'developer',

  args: 1,

  execute: async function(message, param) {
    const { args } = param;

    switch (args[0]) {
      case 'testRanking': return this.testRanking(message);
      case 'load': return this.load(message);
      case 'save': return this.save(message);
      case 'set':
        if (args.length < 3 || !message.mentions || isNaN(args[2]))
          return message.channel.send('Wrong usage');

        return this.setPlayer(message,
          parseInt(args[2]),
          args[3] && !isNaN(args[3]) ? parseInt(args[3]) : 5000,
          args[4]);
    }
  },

  testRanking: async function(message) {
    message.channel.send('Testing ranking...');

    const peril = message.guild.members.get(u.peril);
    const luigi = message.guild.members.get(u.luigi);
    const paul  = message.guild.members.get(u.paul);
    const prototype = message.guild.members.get(u.prototype);

    const players = [paul, peril, luigi, prototype];

    for (let i = 0; i < players.length; i++) {
      let msg = '';
      switch (i + 1) {
        case 1: msg = 'First Place: '; break;
        case 2: msg = 'Second Place: '; break;
        case 3: msg = 'Third Place: '; break;
        case 4: msg = 'Fourth Place: '; break;
        default: msg = 'lol'; break;
      }

      message.channel.send(`${msg}${players[i].displayName}`);
    }

    playerManager.updateRankings(players);
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
