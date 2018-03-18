const messenger = require('../misc/messenger.js');
const { user } = require('../data/config.js');

module.exports = {
  name: 'jay',
  type: 'misc',
  usage: '<respect | fear | irritate>',
  description: 'Something important for you to know',

  args: 1,

  execute: async function(message, param) {
    const arg = param.args[0];

    switch (arg) {
      case 'respect':
      case 'fear':
        return messenger.sendMessage(message, {
          title: arg.charAt(0).toUpperCase() + arg.slice(1) + ' Jay',
          description: arg === 'respect' ? '@everyone respect the dark knight of Go Canada!' : 'You are too weak to take it',
        });

      case 'irritate':
        return this.irritatePeril(message, 3);

      default:
        return messenger.sendArgumentError(message, this, 'Jay does not approve of this argument.');
    }
  },

  irritatePeril: async function(message, num) {
    if (num == 0) return;

    if (message.author.id != user.jay)
      return message.channel.send('You fear him so much... you cannot try it.');

    message.channel.send(`<@${user.peril}>`).catch(e => console.log(e));

    setTimeout(() => {
      return this.irritatePeril(message, num - 1);
    }, 1000);
  },
};
