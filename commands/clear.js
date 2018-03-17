const messenger = require('../misc/messenger.js');

module.exports = {
  name: 'clear',
  type: 'leadership',
  usage: '<number>',
  description: 'Removes recent messages from the channel (up to 2 weeks old)',

  args: 1,

  execute: function(message, param) {
    if (isNaN(param.args[0]))
      return messenger.sendArgumentError('You must use a number for the argument.', message, this);

    const num = parseInt(param.args[0]);

    if (num <= 0)
      return messenger.sendArgumentError('You must remove at least one message.', message, this);

    this.clear(message, num, 0);
  },

  clear: async function(message, num, numDeleted) {
    if (numDeleted == 0)
      message = await message.delete();

    const fetched = await message.channel.fetchMessages({ limit: num > 100 ? 100 : num });

    const deleted = await message.channel.bulkDelete(fetched);
    const thisDeleted = deleted.array().length;

    numDeleted += thisDeleted;

    if (thisDeleted < 100 || numDeleted == num)
      message.channel.send(`🖍 Deleted ${numDeleted} ${numDeleted != 1 ? 'messages' : 'message'}.`)
        .then(msg => msg.delete(3000))
        .catch(console.error);
    else
      this.clear(message, num - 100, numDeleted);
  },
};
