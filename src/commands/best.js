const Messenger = require('../helper/Messenger.js');
const Rank = require('../helper/Rank.js');

class Command {
  constructor() {
    this.name = 'best';

    this.aliases = ['top'];
    this.description = 'Gets top players by experience or ranking';
    this.type = 'essentials';
    this.usage = '<exp | ranking> [number]';
  }

  execute(message) {
    let type = message.args[0];
    if (!type || (type !== 'exp' && type !== 'ranking')) {
      type = 'exp';
    }

    let numScores = parseInt(message.args[1]) || 10;
    const scores = Rank.getRankList(message, type);

    numScores = numScores > 50 ? 50 :
      numScores < 0 ? 10 :
        numScores > scores.length ? scores.length : numScores;

    const expString = `${scores[0].exp} exp.`.length;
    const levelString = `(${scores[0].level})`.length;
    const numScoresString = numScores.toString().length;

    let description = '';
    for (let i = 1; i <= numScores; i++) {
      const score = scores[i - 1];

      const n = `${i}`.padEnd(numScoresString);
      const exp = `${score.exp} exp.`.padStart(expString);
      const level = `(${score.level})`.padStart(levelString);
      const expLevel = `${exp} ${level}`;
      const ranking = `${score.ranking} ER`.padStart(7);
      const name = score.name.substring(0, 25);

      description += `\`${n} ${type === 'exp' ? expLevel : ranking} |\` ${score.flair} ${name}\n`;
    }

    Messenger.send(message, {
      title: `🏅 Top Players by ${type === 'exp' ? 'Level' : 'Ranking'}`,
      color: 0xf5f513,
      description: description,
    });
  }
}

module.exports = new Command();
