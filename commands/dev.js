const fs = require('fs');

const pointManager = require('../helper/pointManager.js');

module.exports = {
  name: 'dev',
  type: 'developer',

  args: 1,

  execute: async function(message, param) {
    const { args } = param;
    
    switch (args[0]) {
      case 'load': return this.load(message);
      case 'save': return this.save(message);
      case 'set':
        if (args.length < 3 || !message.mentions || isNaN(args[2]))
          return message.channel.send('Wrong usage');

        return this.setPoints(message, {
          exp: args[2],
          ranking: args[3] && !isNaN(args[3]) ? args[3] : 5000,
        });
    }
  },

  load: async function(message) {
    const { points } = message.client;
    const players = JSON.parse(fs.readFileSync('./data/points.json', 'utf8'));
    
    for (const { id, exp, ranking } of players) {
      pointManager.setPoints(message, { id: id }, {
        exp: exp,
        ranking: ranking,
      });
    }

    return message.channel.send('Points backup loaded.');
  },

  save: async function(message) {
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

  setPoints: async function(message, param) {
    const player = message.mentions.users.first();
    const { points } = message.client;

    pointManager.setPoints(message, player, {
      exp: param.exp,
      ranking: param.ranking,
    });

    const { exp, level, ranking } = points.get(player.id);

    return message.channel.send(`Set <@${player.id}>'s exp to ${exp}, level ${level}, ${ranking} ER`);
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
