const messenger = require('../misc/messenger.js');

module.exports = {
  name: 'clear',
  type: 'leadership',
  description: 'Deletes a number of recent messages from the channel.',
  usage: '<number[max=100]>',

  args: 1,

  execute: function(message, args) {
    if (isNaN(args[0]))
      return messenger.sendArgumentError('You must use a number for the argument.', message, this);

    if (args[0] > 100)
      return messenger.sendArgumentError('You cannot clear more than 100 messages.', message, this);

    this.clear(message, args[0]);
  },

  clear: async function(message, num) {
    message.delete();

    const fetched = await message.channel.fetchMessages({ limit: num });
    message.channel.bulkDelete(fetched);

    message.channel.send(`🖍 Deleted ${num} messages.`);
  },
};
