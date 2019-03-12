const Messenger = require('../helper/Messenger.js');
const outdent = require('outdent');
const Rank = require('../helper/Rank.js');

const DEFAULTLENGTH = 10;

function getScores(message, type) {
  let numScores = parseInt(message.args[1]) || parseInt(message.args[0]) || DEFAULTLENGTH;
  numScores = numScores > 50 ? 50 : numScores <= 0 ? DEFAULTLENGTH : numScores;

  return Rank.getRankList(message, type).slice(0, numScores);
}

function displayScores(message, scores, type) {
  scores = formatScores(message, scores, type);

  Messenger.sendRankings(message, {
    title: `🏅 Top Players by ${type === 'exp' ? 'Experience' : 'Ranking'}`,
    color: 0xf5f513,
    request: true,
    requestTime: true,
  }, scores);
}

function formatScores(message, scores, type) {
  const expStringLength = scores[0] ? `${scores[0].exp} exp.`.length : 0;
  const levelStringLength = scores[0] ? `(${scores[0].level})`.length : 0;
  for (const score of scores) {
    const expString = `${score.exp} exp.`.padStart(expStringLength);
    const levelString = `(${score.level})`.padStart(levelStringLength);
    score.value = type === 'exp' ? `${expString} ${levelString}` : `${score.ranking} ER`.padStart(7);
  }

  return scores;
}

class Command {
  constructor() {
    this.name = 'best';

    this.aliases = ['top'];
    this.description = 'Gets top players by experience or ranking';
    this.type = 'essentials';
    this.usage = '[exp | ranking] [number]';

    this.details = outdent`
      ${outdent}
      \`exp     |\` measured from how much you chat in the server.
      \`ranking |\` measured based on your performance on games *(coming soon)*
    `;
  }

  execute(message) {
    let type = message.args[0];
    if (!type || (type !== 'exp' && type !== 'ranking')) {
      type = 'exp';
    }

    const scores = getScores(message, type);
    displayScores(message, scores, type);
  }
}

module.exports = Command;
