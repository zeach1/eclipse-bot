const { multiplier } = require('../data/config.js');

const messenger = require('./messenger.js');

module.exports = {
  new: { exp: 0, level: 0, ranking: 5000, flair: '' },
  updatePoints: function(message) {
    const { client, author } = message;

    const score = client.points.get(author.id) || this.new;
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

  updateRankings: function(message, results) {
    for (const result of results)
      this.updateRanking(message, { id: result.id }, { amount: result.amount });

    messenger.send({ }).catch(e => console.error(e));
  },

  updateRanking: function(message, player, amount) {
    const score = message.client.points.get(player.id) || this.new;

    score.ranking += amount;
    score.ranking = score.ranking > 9999 ? 9999 : (score.ranking < 1 ? 1 : score.ranking);

    message.client.points.set(player.id, score);
  },

  updateFlair: function(message, flair) {
    const { id, client } = message.author;
    const score = client.points.get(id) || this.new;

    score.flair = flair;

    message.client.points.set(id, score);
  },

  /* Called by index.js when user leaves a server */
  removePlayer: function(member, client) { client.points.delete(member.user.id); },

  /* Manually changing player data */
  setPlayer: function(message, player, info) {
    const score = message.client.points.get(player.id) || this.new;
    
    if (info.exp) {
      score.exp = info.exp;
      score.level = this.getLevel(info.exp);
    }

    if (info.ranking)
      score.ranking > 9999 ? 9999 : (score.ranking < 1 ? 1 : score.ranking);

    if (score.flair)
      score.flair = info.flair;

    message.client.points.set(player.id, score);
  },

  /* Helper methods to interchange exp and level*/
  getExp: function(level) { return Math.ceil(Math.pow(1 / multiplier * level, 2)); },

  getLevel: function(exp) { return Math.floor(multiplier * Math.sqrt(exp)); },

  /* Gets player rank of all players */
  getPlayerRank: function(message, player, type) {
    let scores = message.client.points.array();
    if (type === 'exp')
      scores = scores.sort((a, b) => { return a.exp < b.exp ? 1 : a.exp > b.exp ? -1 : 0; });
    else if (type === 'ranking')
      scores = scores.sort((a, b) => { return a.ranking < b.ranking ? 1 : a.ranking > b.ranking ? -1 : 0; });
    else
      return -1;
    
    const data = message.client.points.get(player.id);
    return scores.findIndex(score => { return data === score }) + 1;
  },
};
