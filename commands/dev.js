const fs = require('fs');

const pointManager = require('../helper/pointManager.js');

module.exports = {
  name: 'dev',
  type: 'developer',

  args: 1,

  execute: async function(message, param) {
    switch (param.args[0]) {
      case 'load': return this.loadPoints(message);
      case 'save': return this.savePoints(message);
      case 'get':  return this.getPoints(message);
      case 'set':
        if (param.args.length < 3 || !message.mentions || isNaN(param.args[2]))
          return message.channel.send('wrong usage');

        return this.setPoints(message, {
          exp: param.args[2],
          ranking: param.args[3] && !isNaN(param.args[3]) ? param.args[3] : 5000,
        });
    }
  },

  loadPoints: async function(message) {
    const { points } = message.client;
    const players = JSON.parse(fs.readFileSync('./data/points.json', 'utf8'));

    for (const { id, exp, ranking } of players) {
      pointManager.setPoints(points, id, {
        exp: exp,
        ranking: ranking,
      });
    }

    return message.channel.send('Points backup loaded.');
  },

  savePoints: async function(message) {
    const { client, guild, channel } = message;
    const { points }  = client;
    const players = [];

    for (const { user } of guild.members.array()) {
      if (points.get(user.id)) {
        const { exp, ranking } = points.get(user.id);
        players.push({
          id: user.id,
          exp: exp ? exp : 0,
          ranking: ranking ? ranking : 0,
        });
      }
    }

    return fs.writeFile('./data/points.json', JSON.stringify(players), e => {
      if (e) console.error(e);
      channel.send('Points backup saved.');
    });
  },

  getPoints: async function(message) {
    const { points } = message.client;

    console.log(`Number of players: ${points.size}`);
    for (const key of points.keyArray()) {
      const { displayName } = message.guild.members.get(key);
      const { exp, level, ranking } = points.get(key);
      console.log({ name: displayName, exp: exp, level: level, ranking: ranking });
    }

    return message.channel.send('Done. List sent to command log.');
  },

  setPoints: async function(message, param) {
    const id = message.mentions.users.first().id;
    const { points } = message.client;

    pointManager.setPoints(points, id, {
      exp: param.exp,
      ranking: param.ranking,
    });

    const { exp, level, ranking } = points.get(id);

    return message.channel.send(`Set <@${id}>'s exp to ${exp}, level ${level}, ${ranking} ER`);
  },
};
