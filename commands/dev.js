const fs = require('fs');

const messenger = require('../helper/messenger.js');
const rankManager = require('../helper/rankManager.js');

const emoji = require('../misc/emoji.js');

module.exports = {
  name: 'dev',
  type: 'developer',
  usage: '<load | save | set <user> <exp> [ranking] [flair]>',
  description: 'Developer commands, used for maintenance and testing',

  args: 1,

  /**
   * @param {Discord.Message} message The message sent
   * @param {Object} param Contains arguments and options
   * @return {Promise<Discord.Message>}
   */
  execute: async function(message, param) {
    const { args } = param;
    switch (args[0]) {
      case 'load': return this._load(message, './data/players.json');
      case 'save': return this._save(message, './data/players-backup.json');
      case 'set': return this._set(message, args.slice(1));
      default: return messenger.sendArgumentError(message, this);
    }
  },

  /**
   * Loads player data from file.
   * @param {Discord.Message} message The message sent
   * @param {string} path Path to load file
   * @return {Promise<Discord.Message>}
   */
  _load: async function(message, path) {
    const players = JSON.parse(fs.readFileSync(path, 'utf8'));

    for (const { id, exp, ranking, flair } of players) {
      rankManager.setPlayer(message, { id: id }, {
        exp: exp,
        ranking: ranking,
        flair: flair,
      });
    }

    return message.channel.send('Player backup loaded.');
  },

  /**
   * Saves player data to file.
   * @param {Discord.Message} message The message sent
   * @param {string} path Path to save file
   * @return {Promise<Discord.Message>}
   */
  _save: async function(message, path) {
    const { client, guild, channel } = message;
    const { points }  = client;
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
    }

    return fs.writeFile(path, JSON.stringify(players), () => channel.send('Points backup saved.'));
  },

  /**
   * Manually sets player data.
   * @param {Discord.Message} message The message sent
   * @param {Array<string>} args Array of arguments
   * @return {Promise<Discord.Message>}
   */
  _set: async function(message, args) {
    // guide: args = [user, exp, ranking, flair]
    if (args.length < 2 || !message.mentions || isNaN(args[1]) || (args[2] && isNaN(args[2])))
      return messenger.sendArgumentError(message, this, 'Wrong argument usage');

    const player = message.mentions.users.first();
    const { points } = message.client;

    rankManager.setPlayer(message, player, {
      exp: args[1],
      ranking: args[2],
      flair: emoji.getEmoji(args[3], message.client),
    });

    const { exp, level, ranking, flair } = points.get(player.id);

    return message.channel.send(`Set <@${player.id}>'s exp to ${exp}, level ${level}, ${ranking} ER ${flair ? flair : ''}`);
  },
};
