const fs = require('fs');

module.exports = {
  name: 'dev',
  type: 'developer',
  usage: '[load | save]',
  description: 'Save/load points and ranks, other testing stuff',

  execute: async function(message, param) {
    switch (param.args[0]) {
      case 'load':
        return this.loadPointsRanksData(message);

      case 'save':
        return this.savePointsRanksData(message);

      default:
        return this.devFunc(message);
    }
  },

  devFunc: async function(message) {
    return message.channel.send('Paul is the best');
  },

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
  },
};
