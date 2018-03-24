const { multiplier } = require('../data/config.js');

const messenger = require('./messenger.js');

module.exports = {

  updatePoints: function(message) {
    const { client, author } = message;

    let score = message.client.points.get(author.id);
    if (!score || !score.exp) score = { exp: 0, level: 0, ranking: 5000, flair: '' };

    score.exp++;

    if (score.level < this.getLevel(score.exp)) {
      score.level++;
      messenger.sendMessage(message, {
        title: '🎉 Level Up',
        color: 0x2db634,
        description: `${author} has leveled up to level ${score.level}! Cheers!`,
      }).catch(e => console.error(e));
    }

    client.points.set(author.id, score);
  },

  /* Players will be an array of GuildMembers, first index will be first place, and so on */
  updateRankings: function(message, players) {
    /* Get array of points, using players as the key array */
    const scores = [];
    for (const player of players) {
      let score = message.client.points.get(player.id);
      if (!score || !score.exp) score = { exp: 0, level: 0, ranking: 5000, flair: '' };
      scores.push(score);
    }

    console.log(scores.map(m => m.ranking));

    /* Get ER to add/remove for each player, then send it to updateRanking to update player ranking */
    for (let i = 0; i < scores.length; i++) {
      const score = scores[i];
      const lostTo = scores.map(res => res.ranking).slice(0, i);
      const wonTo = scores.map(res => res.ranking).slice(i);

      console.log(`\n\nscore: ${score}\nlostTo: ${lostTo}]\nwonTo: ${wonTo}`);

      const amount = this.getERAdd(score.ranking, wonTo, lostTo);

      console.log('amount: ' + amount);
      this.updateRanking(message, players[i], score, amount);

      const ranking = message.client.points.get(players[i].id).ranking;
      message.channel.send(`Updated ${players[i].displayName}'s ranking to ${ranking}`);
    }


  },

  updateRanking: function(message, player, score, amount) {
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

  /* Called by ../index.js when user leaves the server */
  removePlayer: function(member, client) { client.points.delete(member.user.id); },

  /* Gets current rank of a player based on exp/ranking */
  getPlayerRank: function(message, player, type) {
    return this.getRankList(message, type).findIndex(score => { return player.id === score.id; }) + 1;
  },

  /* Gets list of player ranks by exp or ranking */
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

  /* Function to manually change player data */
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

  /* Helper functions to interchange exp and level*/
  getExp: function(level) { return Math.ceil(Math.pow(1 / multiplier * level, 2)); },

  getLevel: function(exp) { return Math.floor(multiplier * Math.sqrt(exp)); },

  /* Helper functions to get ER to add/deduct for a player */
  getERAdd: function(ranking, wonTo, lostTo) {
    function e(x)    { return Math.pow(10, x); }
    function p(x, y) { return Math.pow(x, y); }
    function f(x)    { return (-1.46113056251454 * e(-15) * p(x, 4)) - (8.71407853133531 * e(-12) * p(x, 3)) + (6.10820287934392 * e(-7) * p(x, 2)) - (0.0051571359 * x) + 13.4515039641; }

    let add = 0;
    for (const otherRanking of wonTo)
      add += f(ranking - otherRanking);

    for (const otherRanking of lostTo)
      add -= f(ranking - otherRanking);

    return add;
  },
};
