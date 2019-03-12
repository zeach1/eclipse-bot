const Discord = require('discord.js');
const Emoji = require('./Emoji.js');
const { multiplier } = require('../config/config.js');
const Messenger = require('./Messenger.js');

const COOLDOWN = 60000;
const QUEUE_COOLDOWN = new Discord.Collection();

function getScore(score) {
  const defaultScore = { exp: 0, level: 0, ranking: 5000, flair: '' };
  return Object.assign(defaultScore, score);
}

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

    if (QUEUE_COOLDOWN.has(author.id)) return;

    QUEUE_COOLDOWN.set(author.id, author);
    setTimeout(() => QUEUE_COOLDOWN.delete(author.id), COOLDOWN);

    let score = message.client.points.get(author.id);
    score = getScore(score);

    const random = Math.floor(Math.random() * 6) + 10;
    score.exp += random;

    const level = Rank.getLevel(score.exp);
    if (score.level !== level) {
      if (level > score.level) {
        // the true in the end means that the message will get deleted in 5 seconds
        Messenger.sendMessage(message, {
          title: '🎉 Level Up',
          color: 0x3ea92e,
          description: `${author} has leveled up to level ${level}! Cheers! ${score.flair}`,
        }, true);
      }
      score.level = level;
    }

    client.points.set(author.id, score);
  }

  static updateRankings(message, players) {
    const scores = [];
    for (const player of players) {
      let score = message.client.points.get(player.id);
      score = getScore(score);
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
    score = getScore(score);

    score.flair = Emoji.getEmoji(flair, message.client) || '';

    message.client.points.set(id, score);
  }

  static removePlayer(member, client) {
    client.points.delete(member.id);
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

    return scores.sort((a, b) => {
      const aName = a.name.toLowerCase();
      const bName = b.name.toLowerCase();
      return a[type] < b[type] ? 1 :
        a[type] > b[type] ? -1 :
          aName > bName ? 1 :
            aName < bName ? -1 : 0;
    });
  }

  static setPlayer(message, player, data) {
    if (!player.id) return;

    let score = message.client.points.get(player.id);
    score = getScore(score);

    if (!isNaN(data.exp)) {
      const exp = parseInt(data.exp);
      score.exp = parseInt(exp < 0 ? 0 : exp);
      score.level = Rank.getLevel(data.exp);
    }

    if (!isNaN(data.ranking)) {
      score.ranking = data.ranking > 9999 ? 9999 : data.ranking < 1 ? 1 : parseInt(data.ranking);
    }

    if (data.flair) {
      score.flair = Emoji.getEmoji(data.flair, message.client) || '';
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
