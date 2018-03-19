const { clanName, subreddit } = require('../data/config.js');

const messenger = require('../misc/messenger.js');

module.exports = {
  name: 'sub',
  type: 'essentials',
  description: `Shows ${clanName}'s subreddit link`,

  execute: async function(message) {
    return messenger.sendMessage(message, {
      title: `${clanName} subreddit`,
      avatar: message.guild.iconURL,
      description: 'https://www.reddit.com/r/RedditEclipse/',
      color: 0x68b87a,
      request: true,
    });
  },
};
