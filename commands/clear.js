const messenger = require('../misc/messenger.js');

module.exports = {
  name: 'clear',
  type: 'developer',
  usage: '<number>',
  description: 'Removes recent messages from the channel (up to 2 weeks old)',

  args: 1,

  execute: async function(message, param) {
    if (isNaN(param.args[0]))
      return messenger.sendArgumentError(message, this, 'You must use a number for the argument.');

    const num = parseInt(param.args[0]);

    if (num <= 0)
      return messenger.sendArgumentError(message, this, 'You must remove at least one message.');

    return this.clear(message, num, 0);
  },

  clear: async function(message, num, numDeleted) {
    if (numDeleted == 0)
      message = await message.delete().catch(e => console.log(e));

    const fetched = await message.channel.fetchMessages({ limit: num > 100 ? 100 : num }).catch(e => console.log(e));
    
    if (fetched && fetched.size > 0) {
      const deleted = await message.channel.bulkDelete(fetched).catch(e => console.log(e));
      
      /* The following condition return false if the user is spamming 'clear' */
      if (deleted && deleted.size > 0) {
        numDeleted += deleted.size;

        if (deleted.size < 100 || numDeleted == num)
          return message.channel.send(`🖍 Deleted ${numDeleted} ${numDeleted != 1 ? 'messages' : 'message'}.`)
            .then(msg => { if (msg) msg.delete(3000).catch(e => {}); })
            .catch(e => console.log(e));

        return this.clear(message, num - 100, numDeleted);
      }
    }
    
    return message.channel.send('😰 There are no messages to delete').then(msg => { if (msg) msg.delete(3000).catch(e => {}); }).catch(e => console.log(e));
    
  },
};
