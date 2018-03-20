const fs = require('fs');

<<<<<<< HEAD
module.exports = {
  name: 'dev',
  type: 'developer',
  usage: '[load | save]',
=======
const messenger = require('../helper/messenger.js');

module.exports = {
  name: 'dev',
  type: 'developer',
  usage: '[load | save | set <person> <num>] ',
>>>>>>> glitch
  description: 'Save/load points and ranks, other testing stuff',

  execute: async function(message, param) {
    switch (param.args[0]) {
      case 'load':
<<<<<<< HEAD
        return this.loadPointsRanksData(message);

      case 'save':
        return this.savePointsRanksData(message);
=======
        return this.loadPoints(message);

      case 'save':
        return this.savePoints(message);

      case 'set':
        if (param.args.length != 3 || isNaN(param.args[2]) || !message.mentions)
          return messenger.sendArgumentError(message, this, 'Wrong usage');
        return this.setPoints(message, param.args[2]);
>>>>>>> glitch

      default:
        return this.devFunc(message);
    }
  },

  devFunc: async function(message) {
    return message.channel.send('Paul is the best');
  },

<<<<<<< HEAD
  loadPointsRanksData: async function(message) {
    const { points, ranks } = message.client;
    const players = JSON.parse(fs.readFileSync('../data/.pointsRanksBackup.json', 'utf8'));

    for (const player of players) {
      const { id, points: pt, rank } = player;

      points.set(id, {
        points: pt ? pt : 0,
        level: Math.sqrt(pt),
      });

      ranks.set(id, {
        rank: rank ? rank : 5000,
      });
    }

    return message.channel.send('Load success.');
  },

  savePointsRanksData: async function(message) {
    const { points, ranks, users } = message.client;
    const players = [];

    for (const player of users)
      if (points.get(player.id) || ranks.get(player.id))
        players.push({
          id: player.id,
          points: points.get(player.id) ? points.get(player.id) : 0,
          rank: ranks.get(player.id) ? ranks.get(player.id) : 0,
        });

    fs.writeFileSync('../data/.pointsRanksBackup.json', JSON.stringify(players), e => {
      console.error(e);
    });

    return message.channel.send('Save success.');
=======
  loadPoints: async function(message) {
    const { points } = message.client;
    const players = JSON.parse(fs.readFileSync('./data/.points.json', 'utf8'));

    for (const player of players) {
      const { id, exp, ranking } = player;
      points.set(id, {
        exp: exp,
        level: Math.floor(0.1 * Math.sqrt(exp)),
        ranking: ranking,
      });
    }

    return message.channel.send('Points backup loaded.');
  },

  savePoints: async function(message) {
    const { client, guild, channel } = message;
    const { points }  = client;
    const players = [];

    for (const player of guild.members.array()) {
      if (points.get(player.user.id)) {
        const { exp, ranking } = points.get(player.user.id);

        players.push({
          id: player.user.id,
          exp: exp ? exp : 0,
          ranking: ranking ? ranking : 0,
        });
      }
    }

    return fs.writeFile('./data/.points.json', JSON.stringify(players), e => {
      if (e) console.error(e);
      channel.send('Points backup saved.');
    });
  },

  setPoints(message, num) {
    const id = message.mentions.users.first().id;
    const { points } = message.client;

    const score = points.get(id) || { exp: 0, level: 0, ranking: 5000 };
    score.exp = parseInt(num);
    score.level = Math.floor(0.1 * Math.sqrt(score.exp));

    points.set(id, score);

    return message.channel.send(`Set <@${id}>'s exp to ${num}, level ${score.level}`);
>>>>>>> glitch
  },
};
