'use strict';

const ClashAPI = require('../helper/ClashAPI.js');
const Emoji = require('../helper/Emoji.js');
const fs = require('fs');
const Messenger = require('../helper/Messenger.js');
const Rank = require('../helper/Rank.js');


const loadPath = './data/players.json';
const savePath = './data/players-backup.json';

function test() {
  ClashAPI.getLineup();
}

function load(message, path) {
  const players = JSON.parse(fs.readFileSync(path, 'utf8'));

  for (const { id, exp, ranking, flair } of players) {
    Rank.setPlayer(message, { id: id }, {
      exp: exp,
      ranking: ranking,
      flair: flair,
    });
  }

  message.channel.send('Player backup loaded.').catch(console.error);
}

function save(message, path) {
  const { client, guild, channel } = message;
  const { points } = client;
  const players = [];

  for (const { user } of guild.members.array()) {
    if (points.get(user.id)) {
      const { exp, ranking, flair } = points.get(user.id);

      players.push({
        id: user.id,
        exp: exp,
        ranking: ranking,
        flair: flair,
      });
    }

    fs.writeFile(path, JSON.stringify(players), () => {
      channel.send('Points backup saved.').catch(console.error);
    });
  }
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
    this.usage = '<load | save | set <user> <exp> [ranking] [flair]>';
  }

  execute(message) {
    switch (message.args[0]) {
      case 'test': test(message); break;
      case 'load': load(message, loadPath); break;
      case 'save': save(message, savePath); break;
      case 'set': set(message, message.args.slice(1)); break;
      default: Messenger.sendArgumentError(message, this); break;
    }
  }
}

module.exports = new Command();
