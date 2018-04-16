const { multiplier } = require('../data/config.js');

const messenger = require('./messenger.js');

module.exports = {
  /**
   * Increments player exp by 1 every message sent.
   * @param {Discord.Message} message The message sent
   */
  updatePoints: function(message) {
    const { client, author } = message;

    let score = message.client.points.get(author.id);
    if (!score || !score.exp) score = { exp: 0, level: 0, ranking: 5000, flair: '' };

    score.exp++;

    const level = this.getLevel(score.exp);
    if (score.level !== level) {
      if (level > score.level)
        messenger.sendMessage(message, {
          title: '🎉 Level Up',
          color: 0x3ea92e,
          description: `${author} has leveled up to level ${level}! Cheers! ${score.flair}`,
        }).catch(console.error);

      score.level = level;
    }

    client.points.set(author.id, score);
  },

  /**
   * Updates players' ER after finishing a game
   * @param {Discord.Message} message The message sent
   * @param {Array<Discord.GuildMember} players Array of players in game
   */
  updateRankings: function(message, players) {
    const scores = [];
    for (const player of players) {
      let score = message.client.points.get(player.id);
      if (!score || !score.exp) score = { exp: 0, level: 0, ranking: 5000, flair: '' };
      scores.push(score);
    }

    for (let i = 0; i < scores.length; i++) {
      const score = scores[i];
      const lostTo = scores.map(info => info.ranking).slice(0, i);
      const wonTo = scores.map(info => info.ranking).slice(i + 1);

      const amount = this.getERAdd(score.ranking, wonTo, lostTo);
      this.updateRanking(message, players[i], score, amount);
    }
  },

  /**
   * Updates a player ER after finishing a game
   * @param {Discord.Message} message The message sent
   * @param {Discord.GuildMember} player
   * @param {Object} score Player score
   * @param {number} amount Amount of ER to add/deduct from player ER
   */
  updateRanking: function(message, player, score, amount) {
    score.ranking += amount;
    score.ranking = score.ranking > 9999 ? 9999 : (score.ranking < 1 ? 1 : score.ranking);

    message.client.points.set(player.id, score);
  },

  /**
   * Updates a player's flair. Flair is represented by an emoji.
   * @param {Discord.Message} message The message sent
   * @param {string} flair New flair
   */
  updateFlair: function(message, flair) {
    const { id, client } = message.author;

    let score = client.points.get(id);
    if (!score || !score.exp) score = { exp: 0, level: 0, ranking: 5000, flair: '' };

    score.flair = flair;

    message.client.points.set(id, score);
  },

  /**
   * Called when player leaves the server.
   * @param {Discord.GuildMember} member The player that left the server
   * @param {Discord.Client} client Discord client
   */
  removePlayer: function(member, client) { client.points.delete(member.user.id); },

  /**
   * Gets player rank from all others. Rank can be sorted by exp or ER.
   * @param {Discord.Message} message The message sent
   * @param {Discord.GuildMember} player
   * @param {string} type Can be exp or ranking, ranking = ER
   */
  getPlayerRank: function(message, player, type) {
    return this.getRankList(message, type).findIndex(score => { return player.id === score.id; }) + 1;
  },

  /**
   * Gets list of player ranks by exp or ranking
   * @param {Discord.Message} message The message sent
   * @param {string} type Can be exp or ranking, ranking = ER
   */
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

  /**
   * Manually update player data. Called from dev command.
   * @param {Discord.Message} message The message sent
   * @param {Discord.GuildMember} player
   * @param {Object} info Data to put to player's score
   */
  setPlayer: function(message, player, info) {
    let score = message.client.points.get(player.id);
    if (!score || !score.exp) score = { exp: 0, level: 0, ranking: 5000, flair: '' };

    if (info.exp) {
      score.exp = info.exp;
      score.level = this.getLevel(info.exp);
    }

    if (info.ranking)
      score.ranking  = info.ranking > 9999 ? 9999 : (info.ranking < 1 ? 1 : info.ranking);

    if (info.flair)
      score.flair = info.flair;

    message.client.points.set(player.id, score);
  },

  /**
   * Gets level based on certain exp.
   * @param {number} level
   * @return {number} exp
   */
  getExp: function(level) { return Math.ceil(Math.pow(1 / multiplier * level, 2)); },

  /**
   * Gets lowest exp needed for a certain level.
   * @param {number} exp
   * @return {number} level
   */
  getLevel: function(exp) { return Math.floor(multiplier * Math.sqrt(exp)); },

  /**
   * Calculate ER to add or remove from player score.
   * @param {number} ranking Player ranking, in ER
   * @param {Array<number>} wonTo Other ranking
   * @param {Array<number>} lostTo Other ranking
   * @return {number}
   */
  getERAdd: function(ranking, wonTo, lostTo) {
    function e(x)    { return Math.pow(10, x); }
    function p(x, y) { return Math.pow(x, y); }
    function f(x)    { return (-1.46113056251454 * e(-15) * p(x, 4)) - (8.71407853133531 * e(-12) * p(x, 3)) + (6.10820287934392 * e(-7) * p(x, 2)) - (0.0051571359 * x) + 13.4515039641; }

    let add = 0;
    for (const otherRanking of wonTo)
      add += f(ranking - otherRanking);

    for (const otherRanking of lostTo)
      add -= f(ranking - otherRanking);

    return Math.floor(add);
  },
};
