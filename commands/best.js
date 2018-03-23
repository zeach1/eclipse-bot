const playerManager = require('../helper/playerManager.js');

module.exports = {
  name: 'best',
  type: 'developer',
  usage: '[exp | ranking] [number]',
  aliases: ['top'],
  description: 'Gets top players by experience or ranking',

  execute: async function(message, param) {
    const { args } = param;

    switch (args) {
      case 'ranking': return this.getTopPlayers(message, args);
      default:        return this.getTopPlayers(message, ['exp']);
    }
  },

  getTopPlayers: async function(message, args) {
    let type = args[0];
    if (type !== 'ranking' && type !== 'exp') type = 'exp';

    const scores = playerManager.getRankList(message, type);

    let number = !isNaN(args[2]) ? parseInt(args[2]) : 10;
    number = number > 30 ? 30 : number < 0 ? 10 : number;

    const longestExpLength = `${scores[0].exp} (${scores[0].level})`.length;
    const numberLength = number.toString().length;

    let description = `🏅 Top Players by ${type === 'exp' ? 'Level' : 'Eclipse Ranking'}\n\n`;
    for (let i = 1; i <= number; i++) {
      const score = scores[i - 1];

      const n       = `${i}`.padEnd(numberLength);
      const exp     = `${score.exp} (${score.level})`.padStart(longestExpLength);
      const ranking = `${score.ranking}`.padStart(4);
      const name    = score.name.substring(0, 25);

      description += `\`${n} ${type === 'exp' ? exp : ranking} |\` ${score.flair} ${name}\n`;
    }

    return message.channel.send(description);
  },
};
