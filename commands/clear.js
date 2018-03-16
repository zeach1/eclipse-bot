const messenger = require('../misc/messenger.js');

module.exports = {
  name: 'clear',
  type: 'leadership',
  description: 'Deletes a number of recent messages from the channel.',
  usage: '<number[max=100]>',

  args: 1,

  execute: function(message, args) {
    /* Validation */
    if (isNaN(args[0]))
      return messenger.sendArgumentError('You must use a number for the argument.', message, this);
    
    const num = parseInt(args[0]);
    
    if (num <= 0)
      return messenger.sendArgumentError('You must delete at least one message.', message, this);
    
    if (num > 100)
      return messenger.sendArgumentError('You cannot clear more than 100 messages.', message, this);
    
    /* Execute clear on num + 1 messages, including command message */
    this.clear(message, num + 1);
    
    message.channel.send(`🖍 Deleted ${num} messages.`)
      .then(msg => msg.delete(2000))
      .catch(console.error);
  },

  clear: async function(message, num) {
    
    if (num > 100) // this will happen only when user puts in 100, so it will really delete 99 messages
      num = 100;   // however the difference is insignificant
    
    const fetched = await message.channel.fetchMessages({ limit: num });
    message.channel.bulkDelete(fetched).catch(console.error);
  },
};
