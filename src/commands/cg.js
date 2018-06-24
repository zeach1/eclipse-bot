const ClashAPI = require('../helper/ClashAPI.js');
const Member = require('../helper/Member.js');
const Messenger = require('../helper/Messenger.js');
const outdent = require('outdent');
const path = require('path');
const { clash, prefix } = require('../config/config.js');
const Util = require('../helper/Util.js');

const elegible = ['Eclipse'];
const FILEPATH = path.join(__dirname, '..', '..', 'data', 'clan-games.json');
const yes = ['y', 'yes', 'sure'];

let working = false;

async function getAccountCGData(message) {
  const accounts = await ClashAPI.getClanMembers(message).catch(console.error);

  // API login issues
  if (!accounts) return null;

  const data = [];
  for (const account of accounts) {
    const achievement = account.achievements.find(a => a.name === clash.achievementName.clanGames);
    data.push({ name: account.name, tag: account.tag, points: achievement.value });
  }

  return data;
}

async function start(message) {
  const accountData = await getAccountCGData(message).catch(console.error);

  // API login issues
  if (!accountData) {
    working = false;
    return;
  }

  const success = Util.saveToJSON(FILEPATH, accountData);

  if (success) {
    Messenger.sendSuccessMessage(message, {
      title: '🚩 Clan Games Stats Saved',
      description: outdent`
        ${outdent}
        Type \`${prefix}cg update\` when a new member joins the clan to update with their information
        Type \`${prefix}cg finish\` when Clan Games end to obtain player contribution
        `,
    });
  } else {
    Messenger.sendError(message, {
      message: 'Clan Games stats failed to save',
      submessage: 'Check console for more details',
    });
  }

  working = false;
}

async function update(message) {
  const fileData = Util.loadFromJSON(FILEPATH);

  if (!fileData) {
    Messenger.sendError(message, {
      message: 'Clan Games stats failed to load',
      submessage: `Type \`${prefix}cg start\` to start current Clan Games stats`,
    });
    working = false;
    return;
  }

  const accountData = await getAccountCGData().catch(console.error);

  // API login issues
  if (!accountData) {
    working = false;
    return;
  }

  // add new players to file
  for (const data of accountData) {
    if (!fileData.some(d => d.id === data.id)) {
      fileData.push(data);
    }
  }

  const success = Util.saveToJSON(FILEPATH, fileData);

  if (success) {
    Messenger.sendSuccessMessage(message, {
      title: '🚩 Clan Games Stats Updated',
      description: `Type \`${prefix}cg finish\` when Clan Games end to obtain player contribution`,
    });
  } else {
    Messenger.sendError(message, {
      message: 'Clan Games stats failed to update',
      submessage: 'Check console for more details',
    });
  }

  working = false;
}

async function finish(message, playerCap) {
  const fileData = Util.loadFromJSON(FILEPATH);

  if (!fileData) {
    Messenger.sendError(message, {
      message: 'Clan Games stats failed to load',
      submessage: `Type \`${prefix}cg start\` to start current Clan Games stats`,
    });
    working = false;
    return;
  }

  // get accountData, but match accounts to members, because we display this in Discord
  const accounts = await ClashAPI.getClanMembers(message);

  // API login issues
  if (!accounts) {
    working = false;
    return;
  }

  let members = Member.getMembersByRole(message, elegible);
  members = Member.matchAccountsToMembers(message, accounts, members);

  let scores = [];
  for (const member of members) {
    let netScore = 0;
    const memberAccounts = member.accounts;
    for (const account of memberAccounts) {
      const fileAccountData = fileData.find(data => data.tag === account.tag);
      if (!fileAccountData) continue;

      const initialScore = fileAccountData.points;
      const finalScore = account.achievements.find(a => a.name === clash.achievementName.clanGames).value;

      netScore += finalScore - initialScore;
    }

    if (netScore > 0) {
      member.cgPoints = { score: netScore, numAccounts: memberAccounts.length };
      scores.push(member);
    }
  }

  // prepare data to be displayed
  scores = scores.sort((a, b) =>
    a.cgPoints.numAccounts > b.cgPoints.numAccounts ? 1 :
      a.cgPoints.numAccounts < b.cgPoints.numAccounts ? -1 :
        a.cgPoints.score < b.cgPoints.score ? 1 :
          a.cgPoints.score > b.cgPoints.score ? -1 :
            a.displayName > b.displayName ? 1 :
              a.displayName < b.displayName ? -1 : 0
  );

  const scoresString = `${scores[0].cgPoints.score} / ${playerCap * scores[0].cgPoints.numAccounts} pts.`.length;
  const numScoresString = scores.length.toString().length;

  let description = '';
  for (let i = 1; i <= scores.length; i++) {
    const { cgPoints, flair, displayName } = scores[i - 1];

    const n = `${i}`.padEnd(numScoresString);
    const score = `${cgPoints.score} / ${playerCap * cgPoints.numAccounts} pts.`.padStart(scoresString);

    description += `\`${n} ${score}\` | ${flair} ${displayName.substring(0, 25)}\n`;
  }

  const output = {
    title: '🚩 Clan Games Result',
    color: 0xdac31d,
    description: description,
  };

  await Messenger.reply(message, {
    content: `⚠️ ${message.author}, are these the final results of these Clan Games? (y/n)`,
    embed: output,
  }).then(async reply => {
    const replyContent = reply.content.trim().toLowerCase();

    if (!yes.includes(replyContent)) {
      message.channel.send('👍 Okay then. Cancelling...').catch(console.error);
      working = false;
      return;
    }

    const logChannel = reply.channel;

    await message.channel.send(`👌 Got it, sending the results to ${logChannel}...`).catch(console.error);
    await Messenger.sendMessage(message, output);
  }).catch(() => {});

  working = false;
}

class Command {
  constructor() {
    this.name = 'cg';

    this.args = 1;
    this.description = 'Keep track of clan games points of all members';
    this.type = 'developer';
    this.usage = '<start | update | finish <player cap>>';
  }

  execute(message) {
    if (working) return;

    switch (message.args[0]) {
      case 'finish': {
        if (isNaN(message.args[1])) {
          Messenger.sendArgumentError(message, this, 'You must specify player cap value');
          return;
        }
      } // eslint-disable-next-line
      case 'start':
      case 'update': break;
      default: Messenger.sendArgumentError(message, this); return;
    }

    working = true;
    Messenger.reply(message, {
      content: `⚠️ ${message.author}, are you sure you want to run \`${prefix}cg ${message.args[0]}\`? (y/n)`,
    }).then(reply => {
      const replyContent = reply.content.trim().toLowerCase();

      if (!yes.includes(replyContent)) {
        message.channel.send('👍 Okay then. Cancelling...').catch(console.error);
        working = false;
        return;
      }

      switch (message.args[0]) {
        case 'start': start(message).catch(console.error); break;
        case 'update': update(message).catch(console.error); break;
        case 'finish': {
          const playerCap = parseInt(message.args[1]);
          finish(message, playerCap).catch(console.error);
          break;
        }
      }
    }).catch(() => {});
  }

  fix() {
    working = false;
  }
}

module.exports = new Command();
