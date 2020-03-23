const outdent = require('outdent');
const path = require('path');
const Messenger = require('../helper/Messenger.js');
const Rank = require('../helper/Rank.js');
const Util = require('../helper/Util.js');

const DATAPATH = path.join(__dirname, '..', '..', 'data');
const LOADPATH = path.join(DATAPATH, 'players.json');
const SAVEPATH = path.join(DATAPATH, 'players-backup.json');

// real test function
// go ham and test whatever you like in this function
// call this with +dev test
function test(message) { // eslint-disable-line
}

function fix(message) {
  message.client.points.keyArray().forEach((id) => {
    const player = { id };

    if (!message.guild.members.get(player.id)) {
      Rank.removePlayer(player, message.client);
      return;
    }

    const score = message.client.points.get(player.id);
    Rank.setPlayer(message, player, score);
  });

  message.channel.send('Player scores fixed.').catch((e) => Messenger.sendDeveloperError(message, e));
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

  players.forEach((player) => {
    if (!player || !player.id || !message.guild.members.get(player.id)) {
      return;
    }
    Rank.setPlayer(message, player, player);
  });

  Messenger.sendSuccessMessage(message, {
    description: 'Player backup loaded',
  });
}

function save(message, filePath) {
  const { points } = message.client;
  const players = [];

  points.keyArray().forEach((id) => {
    const score = points.get(id);
    players.push({
      id,
      exp: score.exp,
      ranking: score.ranking,
      flair: score.flair,
    });
  });

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

class Command {
  constructor() {
    this.name = 'dev';

    this.args = 1;
    this.description = 'Developer commands, used for maintenance and fixing possible errors';
    this.type = 'developer';
    this.usage = '<fix | load | save | set <user> <exp> [ranking] [flair]>';

    this.details = outdent`
      ${outdent}
      \`fix  |\` fix all scores and resets all commands
      \`load |\` loads any backup data
      \`save |\` saves all data to backup
      \`set  |\` change member's exp/ranking/flair data
    `;
  }

  execute(message) {
    switch (message.args[0]) {
      case 'fix': fix(message); break;
      case 'load': load(message, LOADPATH); break;
      case 'save': save(message, SAVEPATH); break;
      case 'set': this.set(message, message.args.slice(1)); break;
      case 'test': test(message); break;
      default: Messenger.sendArgumentError(message, this); break;
    }
  }

  set(message, args) {
    const player = message.mentions.members.first();
    const exp = Number.parseInt(args[1], 10);
    const ranking = Number.parseInt(args[2], 10);
    const flair = args[3] || args[2];

    if (!player) {
      Messenger.sendArgumentError(message, new Command(), 'You need to tag a member');
      return;
    }
    if (Number.isNaN(exp)) {
      Messenger.sendArgumentError(message, new Command(), 'Wrong argument usage');
      return;
    }

    Rank.setPlayer(message, player, { exp, ranking, flair });

    const points = message.client.points.get(player.id);

    message.channel.send(`Set **${player.displayName}** to ${points.exp} exp, level ${points.level}, ${points.ranking} ER ${points.flair}`)
      .catch((e) => Messenger.sendDeveloperError(message, e));
  }
}

module.exports = Command;
