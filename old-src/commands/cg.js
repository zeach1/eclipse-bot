const fs = require('fs');
const outdent = require('outdent');
const Achievement = require('../helper/Achievement.js');
const Check = require('../helper/Check.js');
const Member = require('../helper/Member.js');
const Messenger = require('../helper/Messenger.js');
const { clash, prefix } = require('../config/config.js');

const NO_MSG = '👍 Okay then, cancelled';
const CG_ACHIEVEMENT = clash.achievementName.clanGames;
const CG_FILEPATH = Achievement.getAchievementFilePath(CG_ACHIEVEMENT);
const LOAD_ERRORMSG = {
  message: 'Clan Games stats failed to load',
  submessage: `Type \`${prefix}cg start\` to save current stats`,
};
const SAVE_ERRORMSG = {
  message: 'Clan Games stats failed to save',
  submessage: 'Check console for more details',
};

let ongoing = fs.existsSync(CG_FILEPATH);
let working = false;

async function start(message, playerCap) {
  const apiData = await Achievement.loadAPIData(message, CG_ACHIEVEMENT);
  if (!apiData) {
    working = false;
    return;
  }

  const data = { playerCap, data: apiData };

  const success = Achievement.saveData(message, CG_ACHIEVEMENT, data, {
    success: {
      title: '🚩 Clan Games Stats Saved',
      description: outdent`
        ${outdent}
        Type \`${prefix}cg update\` when a new member joins the clan to update with their information
        Type \`${prefix}cg finish\` when Clan Games end to obtain player contribution
        `,
    },
    error: SAVE_ERRORMSG,
  });

  if (success) ongoing = true;
  working = false;
}

async function update(message) {
  const fileData = Achievement.loadFileData(message, CG_ACHIEVEMENT, { error: LOAD_ERRORMSG });
  const accountData = await Achievement.loadAPIData(message, CG_ACHIEVEMENT);

  if (!fileData.data || !accountData) {
    working = false;
    return;
  }

  // add new players to fileData.data
  accountData.forEach((data) => {
    if (!fileData.data.some((d) => d.tag === data.tag)) {
      fileData.data.push(data);
    }
  });

  Achievement.saveData(message, CG_ACHIEVEMENT, fileData, {
    success: {
      title: '🚩 Clan Games Stats Updated',
      description: `Type \`${prefix}cg finish\` when Clan Games end to obtain player contribution`,
    },
    error: SAVE_ERRORMSG,
  });

  working = false;
}


async function getScores(message) {
  const fileData = Achievement.loadFileData(message, CG_ACHIEVEMENT, { error: LOAD_ERRORMSG });
  const members = await Member.matchAllClanAccountsToAllMembers(message);

  let scores = [];
  members.forEach((member) => {
    let netScore = 0;
    const memberAccounts = member.accounts.forEach((account) => {
      const fileAccountData = fileData.data.find((d) => d.tag === account.tag);
      if (!fileAccountData) {
        return;
      }

      const initialScore = fileAccountData.value;
      const finalScore = account.achievements.find((a) => a.name === CG_ACHIEVEMENT).value;

      netScore += finalScore - initialScore;
    });

    scores.push({
      ...member,
      cgPoints: { score: netScore, numAccounts: memberAccounts.length },
    });
  });

  scores = scores.sort((a, b) => {
    if (a.cgPoints.numAccounts !== b.cgPoints.numAccounts) {
      return a.cgPoints.numAccounts - b.cgPoints.numAccounts;
    }
    if (a.cgPoints.score !== b.cgPoints.score) {
      return a.cgPoints.score - b.cgPoints.score;
    }
    if (a.displayName > b.displayName) {
      return 1;
    }
    if (a.displayName < b.displayName) {
      return -1;
    }
    return 0;
  });

  return { scores, playerCap: fileData.playerCap };
}

function formatScores(scores, playerCap) {
  const scoreStringLength = scores[0] ? `${scores.reduce((largest, current) => (current.cgPoints.score > largest.cgPoints.score ? current : largest)).cgPoints.score}`.length : 0;
  const playerCapStringLength = scores[0] ? `${scores[0].cgPoints.numAccounts * playerCap}`.length : 0;

  const newScores = [];
  scores.forEach((score) => {
    const scoreString = `${score.cgPoints.score}`.padStart(scoreStringLength);
    const playerCapString = `${score.cgPoints.numAccounts * playerCap}`.padEnd(playerCapStringLength);
    newScores.push({
      ...score,
      value: `${scoreString} / ${playerCapString} pts.`,
    });
  });

  return scores;
}

function displayScores(message, scores, playerCap, finalResults) {
  const formattedScores = [];

  formatScores(scores, playerCap).forEach((score) => {
    formattedScores.push({
      ...score,
      name: score.displayName,
    });
  });

  Messenger.sendRankings(message, {
    title: `🚩 Clan Games ${finalResults ? 'Result' : 'Standings'}`,
    color: 0xdac31d,
    request: !finalResults,
    requestTime: !finalResults,
  }, scores);
}

async function view(message) {
  const { scores, playerCap } = await getScores(message);
  displayScores(message, scores, playerCap, false);
  working = false;
}

async function finish(message) {
  const { scores, playerCap } = await getScores(message);
  await displayScores(message, scores, playerCap, true);

  // should change this to the channel it should go to
  const logMessage = message;

  const success = await Messenger.confirm(message, {
    content: 'are these the final results of these Clan Games?',
    yes: `👌 Got it, sending the results to ${logMessage.channel}...`,
    no: NO_MSG,
  });

  if (!success) {
    working = false;
    return;
  }

  displayScores(logMessage, scores, playerCap, true);
  fs.unlinkSync(CG_FILEPATH);
  ongoing = false;
  working = false;
}

class Command {
  constructor() {
    this.name = 'cg';

    this.args = 1;
    this.description = 'Keep track of Clan Games points of all players';
    this.type = 'eclipse';
    this.usage = '<start <player cap> | update | view | finish>';

    this.details = outdent`
      ${outdent}
      \`start  |\` starts tracking a new Clan Games *(Leadership)*
      \`update |\` type this command whenever a new member joins the clan
      \`view   |\` see the current Clan Games stats
      \`finish |\` stops tracking a new Clan Games, and logs it *(Leadership)*
    `;
  }

  async execute(message) {
    if (!await this.handle(message)) {
      return;
    }

    switch (message.args[0]) {
      case 'start': {
        const playerCap = Number.parseInt(message.args[1], 10);
        start(message, playerCap).catch((e) => Messenger.sendDeveloperError(message, e));
        break;
      }
      case 'update': update(message).catch((e) => Messenger.sendDeveloperError(message, e)); break;
      case 'view': view(message).catch((e) => Messenger.sendDeveloperError(message, e)); break;
      case 'finish': finish(message).catch((e) => Messenger.sendDeveloperError(message, e)); break;
      default: break;
    }
  }

  async handle(message) {
    // handle permissions ~ anyone: view and update, leadership: start and finish
    switch (message.args[0]) {
      case 'start':
      case 'finish':
        if (!Check.isLeadership(message.member)) {
          Messenger.sendPermissionError(message);
          return false;
        }
        break;
      default: break;
    }

    if (working) return false;

    // make sure correct arguments are used
    switch (message.args[0]) {
      case 'start': {
        if (Number.isNaN(message.args[1])) {
          Messenger.sendArgumentError(message, new Command(), 'You must specify player cap value');
          return false;
        }
        break;
      }
      case 'finish': case 'update': case 'view': break;
      default: Messenger.sendArgumentError(message, new Command()); return false;
    }

    // prevents people from starting clan games if one is already started
    // prevents people from finishing clan games if none is started
    switch (message.args[0]) {
      case 'start': {
        if (ongoing) {
          Messenger.sendError(message, {
            title: '🚩 Cannot Start Clan Games',
            color: 0xf06c00,
            message: 'There is already an ongoing Clan Games',
            submessage: `Type \`${prefix}cg finish\` to finish the current Clan Games`,
          });
          return false;
        }
        break;
      }
      case 'update': case 'view': case 'finish': {
        if (!ongoing) {
          Messenger.sendError(message, {
            title: '🚩 Cannot Finish Clan Games',
            color: 0xf06c00,
            message: 'There is no ongoing Clan Games',
            submessage: `Type \`${prefix}cg start\` to start a new Clan Games`,
          });
          return false;
        }
        break;
      }
      default: break;
    }

    working = true;

    // makes user confirm, only if argument is not "view"
    if (message.args[0] !== 'view') {
      const confirm = await Messenger.confirm(message, {
        content: `are you sure you want to run \`${prefix}${new Command().name} ${message.args[0]}\`?`,
        no: NO_MSG,
      });

      if (!confirm) {
        working = false;
        return false;
      }
    }
    return true;
  }

  static fix() { working = false; }
}

module.exports = Command;
