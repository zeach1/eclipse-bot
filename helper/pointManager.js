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

  /* Remove player points when he/she leaves server */
  removePlayer: function(member, client) {
    console.log(client.points.array());
    client.points.delete(member.user.id);
    console.log(client.points.array());
    
    console.log(`${member.displayName}'s data is deleted.`);
  },
  
  /* Manual change of points (ex. when loading backup data) */
  setPoints: function(points, id, info) {
    const score = points.get(id) || { exp: 0, level: 0, ranking: 5000 };
    
    if (info.exp) {
      score.exp = info.exp;
      score.level = this.getLevel(info.exp);
    }
    
    if (info.ranking)
      score.ranking > 9999 ? 9999 : (score.ranking < 1 ? 1 : score.ranking);
    
    points.set(id, score);
  },
  
  /* Helper methods to get exp and level */
  getExp: function(level) {
    return 0;
  },
  
  getLevel: function(exp) {
    return Math.floor(0.1 * Math.sqrt(exp));
  },
};
