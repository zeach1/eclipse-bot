const messenger = require('../helper/messenger.js');

module.exports = {
  name: 'jay',
  type: 'misc',
  usage: '<respect | fear>',
  description: 'Something important for you to know',

  args: 1,

  execute: async function(message, param) {
    const arg = param.args[0];

    switch (arg) {
      case 'respect': case 'fear':
        return messenger.sendMessage(message, {
          title: `${arg.charAt(0).toUpperCase()}${arg.slice(1)} Jay`,
          description: arg === 'respect' ? '@everyone respect the dark knight of Go Canada!' : 'You are too weak to take it.',
        });

      default: return messenger.sendArgumentError(message, this, 'Jay does not approve of this argument');
    }
  },
};
