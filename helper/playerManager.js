const { multiplier } = require('../data/config.js');

const messenger = require('./messenger.js');

module.exports = {
  new: { exp: 0, level: 0, ranking: 5000, flair: '⚔️' },
  updatePoints: function(message) {
    const { client, author } = message;

    let score = message.client.points.get(author.id);
    if (!score || !score.exp) score = this.new;

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
    let score = message.client.points.get(player.id);
    if (!score || !score.exp) score = this.new;

    score.ranking += amount;
    score.ranking = score.ranking > 9999 ? 9999 : (score.ranking < 1 ? 1 : score.ranking);

    message.client.points.set(player.id, score);
  },

  updateFlair: function(message, flair) {
    const { id, client } = message.author;

    let score = client.points.get(id);
    if (!score || !score.exp) score = this.new;

    score.flair = flair;

    message.client.points.set(id, score);
  },

  /* Called by index.js when user leaves a server */
  removePlayer: function(member, client) { client.points.delete(member.user.id); },

  /* Manually changing player data */
  setPlayer: function(message, player, info) {
    let score = message.client.points.get(player.id);
    if (!score || !score.exp) score = this.new;

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
    return this.getRankList(message, type).findIndex(score => { return player.id === score.id; }) + 1;
  },

  getRankList: function(message, type) {
    const ids = message.client.points.keyArray();
    const scores = message.client.points.array();

    for (let i = 0; i < scores.length; i++) {
      const member = message.guild.members.get(ids[i]);
      scores[i].name = member.displayName;
      scores[i].id = member.id;
    }

    if (type === 'exp')
      return scores.sort((a, b) => { return a.exp < b.exp ? 1 :
                                            a.exp > b.exp ? -1 :
                                            a.name > b.name ? 1 :
                                            a.name < b.name ? -1 : 0; });
    else if (type === 'ranking')
      return scores.sort((a, b) => { return a.ranking < b.ranking ? 1 :
                                            a.ranking > b.ranking ? -1 :
                                            a.name > b.name ? 1 :
                                            a.name < b.name ? -1 : 0; });
    return -1;
  },
};
