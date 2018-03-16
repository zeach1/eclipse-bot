const outdent = require('outdent');

const messenger = require('../misc/messenger.js');

module.exports = {
  name: 'proto',
  type: 'misc',
  usage: '<quote | summon | reference>',
  description: outdent({ 'trimLeadingNewline': true })`
    Various quotes and commands, Prototype style
    \`\`
    <quote | summon | reference>  type of command
    \`\`
    \u200b
  `,

  args: 1,

  execute: function(message, args) {
    switch (args[0]) {
      case 'quote':
        message.channel.send('`He can\'t code shit`');
        break;

      case 'summon':
        this.summonPeril(message, 15);
        break;

      case 'reference':
        this.referencePeril(message);
        break;

      default:
        messenger.sendArgumentError('This argument does not exist.', message, this);
        break;
    }
  },

  summonPeril: function(message, num) {
    if (num == 0) return;

    if (message.author.id != 262864849300619264)
      return message.channel.send('You do not have enough swag to do this.');

    message.channel.send('<@166611344995385344> `He can\'t code shit`');
    setTimeout(() => {
      this.summonPeril(message, num - 1);
    }, 1000);
  },

  referencePeril: function(message) {
    message.channel.send('```PERIL - Today at 1:12 PM\nProto can\'t code shit```');
  },
};
