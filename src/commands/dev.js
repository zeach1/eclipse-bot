const Emoji = require('../helper/Emoji.js');
const fs = require('fs');
const Messenger = require('../helper/Messenger.js');
const Rank = require('../helper/Rank.js');

const loadPath = './data/players.json';
const savePath = './data/players-backup.json';

function fix(message) {
  for (const id of message.client.points.keyArray()) {
    let score = message.client.points.get(id);
    if (!score || !score.exp) score = { exp: 0, level: 0, ranking: 5000, flair: '' };

    message.client.points.set(id, {
      exp: parseInt(score.exp) || 0,
      level: Rank.getLevel(score.exp),
      ranking: parseInt(score.ranking) || 5000,
      flair: score.flair || '',
    });
  }

  require('./poison.js').fix();
  require('./proto.js').fix();
  require('../helper/Member.js').fix();

  message.channel.send('Player scores fixed. Asyncronous commands reset.').catch(console.error);
}

function load(message, path) {
  let players;
  try {
    const file = fs.readFileSync(path, 'utf8');
    players = JSON.parse(file);
    players = Array.isArray(players) ? players : [players];
  } catch (e) {
    message.channel.send('Player backup failed!').catch(console.error);
    console.error(e);
    return;
  }

  for (const { id, exp, ranking, flair } of players) {
    Rank.setPlayer(message, { id: id }, {
      exp: parseInt(exp) || 0,
      ranking: parseInt(ranking) || 5000,
      flair: flair || '',
    });
  }

  message.channel.send('Player backup loaded.').catch(console.error);
}

function save(message, path) {
  const { client, channel } = message;
  const { points } = client;
  const players = [];

  for (const id of points.keyArray()) {
    const score = points.get(id);
    players.push({
      id: id,
      exp: parseInt(score.exp) || 0,
      ranking: parseInt(score.ranking) || 5000,
      flair: score.flair || '',
    });
  }

  fs.writeFile(path, JSON.stringify(players), () => {
    channel.send('Points backup saved.').catch(console.error);
  });
}

function set(message, args) {
  const player = message.mentions.members.first();
  const exp = parseInt(args[1]);
  const ranking = parseInt(args[2]);
  const flair = Emoji.getEmoji(args[3], message.client);

  if (!player || !exp) {
    Messenger.sendArgumentError(message, new Command(), 'Wrong argument usage');
    return;
  }

  Rank.setPlayer(message, player, {
    exp: exp,
    ranking: ranking,
    flair: flair,
  });

  const points = message.client.points.get(player.id);

  message.channel.send(`Set **${player.displayName}** to ${points.exp} exp, level ${points.level}, ${points.ranking} ER ${points.flair}`)
    .catch(console.error);
}

class Command {
  constructor() {
    this.name = 'dev';

    this.args = 1;
    this.description = 'Developer commands, used for maintenance and testing';
    this.type = 'developer';
    this.usage = '<fix | load | save | set <user> <exp> [ranking] [flair]>';
  }

  execute(message) {
    switch (message.args[0]) {
      case 'fix': fix(message); break;
      case 'load': load(message, loadPath); break;
      case 'save': save(message, savePath); break;
      case 'set': set(message, message.args.slice(1)); break;
      default: Messenger.sendArgumentError(message, this); break;
    }
  }
}

module.exports = new Command();
