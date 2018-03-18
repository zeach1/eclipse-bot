const outdent = require('outdent');

const messenger = require('../misc/messenger.js');

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

    if (message.author.id != process.env.prototypeID)
      return message.channel.send('You do not have enough swag to do this.');

    message.channel.send(`<@${process.env.perilID}>`).catch(e => console.log(e));
    
    setTimeout(() => {
      return this.summonPeril(message, num - 1);
    }, 1000);
  },

  referencePeril: async function(message) {
    return message.channel.send('```PERIL - Today at 1:12 PM\nProto can\'t code shit```');
  },
};
