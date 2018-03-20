const messenger = require('./messenger.js');

module.exports = {
  updatePoints: function(message) {
    const { client, author } = message;
    const score = client.points.get(author.id) || { exp: 0, level: 0, ranking: 5000 };
    score.exp++;

    if (score.level < Math.floor(0.1 * Math.sqrt(score.exp))) {
      score.level++;
<<<<<<< HEAD
      messenger.sendMessage({
=======
      messenger.sendMessage(message, {
>>>>>>> glitch
        title: '⬆️ Level Up',
        color: 0x2db634,
        description: `${author} has leveled up to level ${score.level}! Cheers!`,
      }).catch(e => console.error(e));
    }

    client.points.set(author.id, score);
  },

  updateRankings: function(message, info) {
    for (const i of info)
      this.updateRanking(message, i.player, i.amount);

    messenger.send({

    }).catch(e => console.error(e));
  },

  updateRanking: function(message, player, amount) {
    const score = message.client.points.get(player.id) || { exp: 0, level: 0, ranking: 5000 };

    score.ranking += amount;
    score.ranking = score.ranking > 9999 ? 9999 : (score.ranking < 1 ? 1 : score.ranking);

    message.client.points.set(player.id, score);
  },
<<<<<<< HEAD
=======

  removePlayer: function(member, client) {
    client.points.delete(member.user.id);
    console.log(`${member.displayName}'s data is deleted.`);
  },
>>>>>>> glitch
};
