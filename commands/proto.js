const messenger = require('../misc/messenger.js');
const { user } = require('../data/config.js');

module.exports = {
  name: 'proto',
  type: 'misc',
  usage: '<quote | summon | reference>',
  description: 'Fun commands, Prototype style',

  args: 1,

  execute: async function(message, param) {
    switch (param.args[0]) {
      case 'quote':
        return message.channel.send('`He can\'t code shit`');

      case 'summon':
        return this.summonPeril(message, 5);

      case 'reference':
        return this.referencePeril(message);

      default:
        return messenger.sendArgumentError(message, this, 'This argument does not exist');
    }
  },

  summonPeril: async function(message, num) {
    if (num == 0) return;

    if (message.author.id != user.prototype)
      return message.channel.send('Nah you can\'t do this fam, leave it for the big boy Prototype.');

    message.channel.send(`<@${user.peril}>`).catch(e => console.log(e));

    setTimeout(() => {
      return this.summonPeril(message, num - 1);
    }, 1000);
  },

  referencePeril: async function(message) {
    const peril = message.channel.members.get(user.peril);
    if (peril)
      return messenger.sendMessage(message, {
        title: peril.displayName,
        avatar: peril.user.avatarURL,
        message: 'Proto can\'t code shit',
        submessage: 'Today at 1:12 PM',
        color: 0xcccccc,
      });

    return message.channel.send('```PERIL - Today at 1:12 PM\nProto can\'t code shit```');
  },
};
