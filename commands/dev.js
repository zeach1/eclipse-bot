const fs = require('fs');

const gameManager = require('../helper/gameManager.js');
const playerManager = require('../helper/playerManager.js');

const emoji = require('../misc/emoji.js');

module.exports = {
  name: 'dev',
  type: 'developer',
  description: 'Developer only',

  execute: async function(message, param) {
    const { args } = param;

    if (!args) return message.channel.send('Needs argument');

    switch (args[0]) {
      case 'game': return gameManager.createNewRoom();
      case 'load': return this.load(message);
      case 'save': return this.save(message);
      case 'set':
        if (args.length < 3 || !message.mentions || isNaN(args[2]) || (args[3] && isNaN(args[3])))
          return message.channel.send('Wrong usage');
        return this.setPlayer(message, parseInt(args[2]), parseInt(args[3]), args[4]);

      case 'countdown': return this.countdown(message, 10, true);
      default: return message.channel.send('Wrong argument');
    }
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

    return fs.writeFile('./data/players-backup.json', JSON.stringify(players), e => {
      if (e) console.error(e);
      channel.send('Points backup saved.');
    });
  },

  setPlayer: async function(message, EXP, RANKING, FLAIR) {
    const player = message.mentions.users.first();
    const { points } = message.client;

    const em = emoji.getEmoji(FLAIR, message.client);

    playerManager.setPlayer(message, player, {
      exp: EXP,
      ranking: RANKING,
      flair: em,
    });

    const { exp, level, ranking, flair } = points.get(player.id);

    return message.channel.send(`Set <@${player.id}>'s exp to ${exp}, level ${level}, ${ranking} ER ${flair ? flair : ''}`);
  },

  countdown: async function(message, num, start) {
    /*
    if (num === start)
      await message.delete().catch(console.error);
    if (num === 0) return;

    await message.channel.send(num).then(msg => msg.delete(1000).catch(console.error))
      .catch(console.error);
    */
    if (num <= 0) {
      await message.delete().catch(() => {});
      return;
    }
    if (start) {
      const msg = await message.channel.send(`Time left: ${num} ${num != 1 ? 'seconds' : 'second'}`);

      setTimeout(() => {
        return this.countdown(msg, num - 1);
      }, 1500);
    }
    else {
      message.edit(`Time left: ${num} ${num != 1 ? 'seconds' : 'second'}`);

      setTimeout(() => {
        return this.countdown(message, num - 1);
      }, 1500);
    }
  },
};
