const Discord = require('discord.js');
const { multiplier } = require('../config/config.js');
const Messenger = require('./Messenger.js');

const COOLDOWN = 60000;
const rankQueue = new Discord.Collection();

function updateRanking(message, player, score, amount) {
  amount = parseInt(amount);

  score.ranking += amount;
  score.ranking = score.ranking > 9999 ? 9999 : score.ranking < 1 ? 1 : score.ranking;

  message.client.points.set(player.id, score);
}

function getERAdd(ranking, wonTo, lostTo) {
  function e(x) { return Math.pow(10, x); }
  function p(x, y) { return Math.pow(x, y); }
  function f(x) { return (-1.46113056251454 * e(-15) * p(x, 4)) - (8.71407853133531 * e(-12) * p(x, 3)) + (6.10820287934392 * e(-7) * p(x, 2)) - (0.0051571359 * x) + 13.4515039641; }

  let add = 0;
  for (const otherRanking of wonTo) {
    add += f(ranking - otherRanking);
  }

  for (const otherRanking of lostTo) {
    add -= f(ranking - otherRanking);
  }

  return Math.floor(add);
}

class Rank {
  static updatePoints(message) {
    const { client, author } = message;

    if (rankQueue.has(author.id)) return;

    rankQueue.set(author.id, author);
    setTimeout(() => rankQueue.delete(author.id), COOLDOWN);

    let score = message.client.points.get(author.id);
    if (!score || !score.exp) score = { exp: 0, level: 0, ranking: 5000, flair: '' };

    score.exp = parseInt(score.exp);

    const random = Math.floor(Math.random() * 6) + 10;
    score.exp += random;

    const level = this.getLevel(score.exp);
    if (score.level !== level) {
      if (level > score.level) {
        Messenger.sendMessage(message, {
          title: '🎉 Level Up',
          color: 0x3ea92e,
          description: `${author} has leveled up to level ${level}! Cheers! ${score.flair}`,
        });
      }
      score.level = level;
    }

    client.points.set(author.id, score);
  }

  static updateRankings(message, players) {
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

      const amount = getERAdd(score.ranking, wonTo, lostTo);
      updateRanking(message, players[i], score, amount);
    }
  }

  static updateFlair(message, flair) {
    const { id, client } = message.author;

    let score = client.points.get(id);
    if (!score || !score.exp) score = { exp: 0, level: 0, ranking: 5000, flair: '' };

    score.flair = flair;

    message.client.points.set(id, score);
  }

  static removePlayer(member, client) {
    client.points.delete(member.user.id);
  }

  static getRankList(message, type) {
    const scores = [];

    for (const id of message.client.points.keyArray()) {
      const member = message.guild.members.get(id);
      const score = message.client.points.get(id);

      scores.push({
        exp: score.exp,
        level: score.level,
        ranking: score.ranking,
        flair: score.flair,
        name: member.displayName,
        id: member.id,
      });
    }

    return scores.sort((a, b) =>
      a[type] < b[type] ? 1 :
        a[type] > b[type] ? -1 :
          a.name > b.name ? 1 :
            a.name < b.name ? -1 : 0
    );
  }

  static setPlayer(message, player, data) {
    let score = message.client.points.get(player.id);
    if (!score || !score.exp) score = { exp: 0, level: 0, ranking: 5000, flair: '' };

    if (data.exp) {
      score.exp = parseInt(data.exp) || 0;
      score.level = this.getLevel(data.exp);
    }

    if (data.ranking) {
      score.ranking = data.ranking > 9999 ? 9999 : data.ranking < 1 ? 1 : parseInt(data.ranking) || 5000;
    }

    if (data.flair) {
      score.flair = data.flair;
    }

    message.client.points.set(player.id, score);
  }

  static getExp(level) {
    return Math.ceil(Math.pow(1 / multiplier * level, 2));
  }

  static getLevel(exp) {
    return Math.floor(multiplier * Math.sqrt(exp));
  }
}

module.exports = Rank;
