const { clanName, subreddit } = require('../config.js');

const messenger = require('../helper/messenger.js');

module.exports = {
  name: 'sub',
  type: 'essentials',
  description: `Shows ${clanName}'s subreddit link`,

  execute: async function(message) {
    return messenger.sendMessage(message, {
      title: `${clanName} subreddit`,
      avatar: message.guild.iconURL,
      description: subreddit,
      color: 0x68b87a,
      request: true,
    });
  },
};
