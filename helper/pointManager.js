const { multiplier } = require('../data/config.js');

const messenger = require('./messenger.js');

module.exports = {
  updatePoints: function(message) {
    const { client, author } = message;

    const score = client.points.get(author.id) || { exp: 0, level: 0, ranking: 5000 };
    score.exp++;

    if (score.level < this.getLevel(score.exp)) {
      score.level++;
      messenger.sendMessage(message, {
        title: '⬆️ Level Up',
        color: 0x2db634,
        description: `${author} has leveled up to level ${score.level}! Cheers!`,
      }).catch(e => console.error(e));
    }

    client.points.set(author.id, score);
  },

  updateRankings: function(message, info) {
    for (const i of info)
      this.updateRanking(message, i.id, i.amount);

    messenger.send({

    }).catch(e => console.error(e));
  },

  updateRanking: function(message, id, amount) {
    const score = message.client.points.get(id) || { exp: 0, level: 0, ranking: 5000 };

    score.ranking += amount;
    score.ranking = score.ranking > 9999 ? 9999 : (score.ranking < 1 ? 1 : score.ranking);

    message.client.points.set(id, score);
  },

  /* Called by index.js when user leaves a server */
  removePlayer: function(member, client) { client.points.delete(member.user.id); },

  /* Manually changing player data */
  setPoints: function(message, player, info) {
    const score = message.client.points.get(player.id) || { exp: 0, level: 0, ranking: 5000 };

    if (info.exp) {
      score.exp = info.exp;
      score.level = this.getLevel(info.exp);
    }

    if (info.ranking)
      score.ranking > 9999 ? 9999 : (score.ranking < 1 ? 1 : score.ranking);

    message.client.points.set(player.id, score);
  },

  /* Helper methods to get exp and level */
  getExp: function(level) { return Math.ceil(Math.pow(1 / multiplier * level, 2)); },

  getLevel: function(exp) { return Math.floor(multiplier * Math.sqrt(exp)); },
};
