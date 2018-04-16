const messenger = require('../helper/messenger.js');
const playerManager = require('../helper/playerManager.js');

module.exports = {
  name: 'best',
  type: 'essentials',
  usage: '<exp | ranking> [number]',
  aliases: ['top'],
  description: 'Gets top players by experience or ranking',

  args: 1,

  /**
   * @param {Discord.Message} message The message sent
   * @param {Object} param Contains arguments and options
   * @return {Promise<Discord.Message>}
   */
  execute: async function(message, param) {
    const { args } = param;
    const type = args[0];

    if (type !== 'exp' && type !== 'ranking')
      return messenger.sendArgumentError(message, this);

    let numScores = !isNaN(args[0]) ? parseInt(args[0]) : !isNaN(args[1]) ? parseInt(args[1]) : 10;

    const scores = playerManager.getRankList(message, type);
    numScores = numScores > 30 ? 30 :
                numScores < 0 ? 10 :
                numScores > scores.length ? scores.length : numScores;

    const expString   = `${scores[0].exp} exp.`.length;
    const levelString  = `(${scores[0].level})`.length;
    const numScoresString = numScores.toString().length;

    let description = '';
    for (let i = 1; i <= numScores; i++) {
      const score = scores[i - 1];

      const n        = `${i}`.padEnd(numScoresString);
      const exp      = `${score.exp} exp.`.padStart(expString);
      const level    = `(${score.level})`.padStart(levelString);
      const expLevel = `${exp} ${level}`;
      const ranking  = `${score.ranking} ER`.padStart(7);
      const name     = score.name.substring(0, 25);

      description += `\`${n} ${type === 'exp' ? expLevel : ranking} |\` ${score.flair} ${name}\n`;
    }

    return messenger.send(message, {
      title: `🏅 Top Players by ${type === 'exp' ? 'Level' : 'Ranking'}`,
      color: 0xf5f513,
      description: description,
    });
  },
};
