const ClashAPI = require('../helper/ClashAPI.js');
const Emoji = require('../helper/Emoji.js');
const Messenger = require('../helper/Messenger.js');
const path = require('path');
const Rank = require('../helper/Rank.js');
const Util = require('../helper/Util.js');

const DATA_DIRECTORY = path.join(__dirname, '..', '..', 'data');
const LOADPATH = path.join(DATA_DIRECTORY, 'players.json');
const SAVEPATH = path.join(DATA_DIRECTORY, 'players-backup.json');

function donate(message) {

}

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

  require('./cg.js').fix();
  require('./poison.js').fix();
  require('./proto.js').fix();
  require('../helper/Member.js').fix();

  message.channel.send('Player scores fixed. Asyncronous commands reset.').catch(console.error);
}

function load(message, filePath) {
  let players = Util.loadFromJSON(filePath);

  if (!players) {
    Messenger.sendError(message, {
      message: 'Player backup failed to load',
      submessage: 'Check if the backup file path is correct',
    });
    return;
  }

  players = Array.isArray(players) ? players : [players];
  for (const player of players) {
    if (!player.id) continue;

    Rank.setPlayer(message, { id: player.id }, {
      exp: parseInt(player.exp) || 0,
      ranking: parseInt(player.ranking) || 5000,
      flair: player.flair ? player.flair : '',
    });
  }

  Messenger.sendSuccessMessage(message, {
    description: 'Player backup loaded',
  });
}

function save(message, filePath) {
  const { points } = message.client;
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

  const success = Util.saveToJSON(filePath, players);

  if (success) {
    Messenger.sendSuccessMessage(message, {
      description: 'Player backup saved',
    });
  } else {
    Messenger.sendError(message, {
      message: 'Player backup failed to save',
      submessage: 'Check console for more details',
    });
  }
}

function set(message, args) {
  const player = message.mentions.members.first();
  const exp = parseInt(args[1]);
  const ranking = parseInt(args[2]);
  const flair = Emoji.getEmoji(args[3], message.client);

  if (!player || isNaN(exp)) {
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
    this.description = 'Developer commands, used for maintenance and fixing possible errors';
    this.type = 'developer';
    this.usage = '<donate | fix | load | save | set <user> <exp> [ranking] [flair]>';
  }

  execute(message) {
    switch (message.args[0]) {
      case 'donate': donate(message); break;
      case 'fix': fix(message); break;
      case 'load': load(message, LOADPATH); break;
      case 'save': save(message, SAVEPATH); break;
      case 'set': set(message, message.args.slice(1)); break;
      default: Messenger.sendArgumentError(message, this); break;
    }
  }
}

module.exports = new Command();
