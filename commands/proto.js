const outdent = require('outdent');

const messenger = require('../misc/messenger.js');

module.exports = {
  name: 'proto',
  type: 'misc',
  usage: '<quote | summon | reference>',
  description: 'Fun commands, Prototype style',

  args: 1,

  execute: function(message, param) {
    switch (param.args[0]) {
      case 'quote':
        message.channel.send('`He can\'t code shit`');
        break;

      case 'summon':
        this.summonPeril(message, 5);
        break;

      case 'reference':
        this.referencePeril(message);
        break;

      default:
        messenger.sendArgumentError(message, this, 'This argument does not exist.');
        break;
    }
  },

  summonPeril: function(message, num) {
    if (num == 0) return;

    if (message.author.id != process.env.prototypeID)
      return message.channel.send('You do not have enough swag to do this.');

    message.channel.send(`<@${process.env.perilID}>`);
    setTimeout(() => {
      this.summonPeril(message, num - 1);
    }, 1000);
  },

  referencePeril: function(message) {
    message.channel.send('```PERIL - Today at 1:12 PM\nProto can\'t code shit```');
  },
};
