const { prefix } = require('../data/config.js');

const messenger = require('../helper/messenger.js');
const playerManager = require('../helper/playerManager.js');

module.exports = {
  name: 'best',
  type: 'essentials',
  usage: '<exp | ranking> [number]',
  aliases: ['top'],
  description: 'Gets top players by experience or ranking',

  args: 1,
  
  execute: async function(message, param) {
    const { args } = param;
    const type = args[0];
    
    if (type !== 'exp' && type !== 'ranking')
      return messenger.sendArgumentError(message, this, 'This argument does not exist');
    
    let number = !isNaN(args[0]) ? parseInt(args[0]) : !isNaN(args[1]) ? parseInt(args[1]) : 10;

    const scores = playerManager.getRankList(message, type);
    number = number > 30 ? 30 : number < 0 ? 10 : number;

    const expLength    = `${scores[0].exp} exp.`.length;
    const levelLength  = `(${scores[0].level})`.length;
    const numberLength = number.toString().length;

    let description = '';
    for (let i = 1; i <= number; i++) {
      const score = scores[i - 1];

      const n        = `${i}`.padEnd(numberLength);
      const exp      = `${score.exp} exp.`.padStart(expLength);
      const level    = `(${score.level})`.padStart(levelLength);
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
