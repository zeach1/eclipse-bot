const { user } = require('../data/config.js');

const messenger = require('../helper/messenger.js');

module.exports = {
  name: 'proto',
  type: 'misc',
  usage: '<quote | summon [number] | reference>',
  description: 'Fun commands, Prototype style',

  args: 1,

  /**
   * @param {Discord.Message} message The message sent
   * @param {Object} param Contains arguments and options
   * @return {Promise<Discord.Message>}
   */
  execute: async function(message, param) {
    const { args } = param;

    switch (args[0]) {
      case 'quote':     return message.channel.send('`He can\'t code ****`');
      case 'summon':    return this._summonPeril(message, !isNaN(args[1]) ? parseInt(args[1]) : 1);
      case 'reference': return this._referencePeril(message);
      default:          return messenger.sendArgumentError(message, this);
    }
  },

  /**
   * Recursive command. Prototype command.
   * @param {Discord.Message} message The message sent
   * @param {number} num Number of more message to send
   * @return {Promise<Discord.Message>}
   */
  _summonPeril: async function(message, num) {
    if (num > 10) num = 10;

    if (num <= 0) return;

    if (message.author.id != user.prototype)
      return message.channel.send('Nah you can\'t do this fam.');

    message.channel.send('Can I code `****` bro? <:think:426636057082331136>');

    setTimeout(() => {
      return this._summonPeril(message, num - 1);
    }, 2000);
  },

  /**
   * Prototype command.
   * @param {Discord.Message} message The message sent
   * @return {Promise<Discord.Message>}
   */
  _referencePeril: async function(message) {
    const peril = message.guild.members.get(user.peril);

    if (peril)
      return messenger.send(message, {
        title: peril.displayName,
        avatar: peril.user.avatarURL,
        description: 'Proto can\'t code `****`',
        footer: 'Today at 1:12 PM',
        color: 0xcccccc,
      });

    return message.channel.send('```PERIL - Today at 1:12 PM\nProto can\'t code ****```');
  },
};
