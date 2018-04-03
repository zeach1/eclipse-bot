const { clanName, channel } = require('../data/config.js');

const messenger = require('../helper/messenger.js');

module.exports = {
  name: 'invite',
  type: 'essentials',
  description: 'Shows invite link for this server',

  execute: async function(message) {
    const invites = await message.guild.fetchInvites();

    let invite = invites.last();
    if (!invite)
      invite = await message.guild.channels.get(channel.welcome).createInvite({
        temporary: true,
        maxAge: 1200,
        unique: true,
      }).catch(console.error);

    return messenger.sendMessage(message, {
      title: `Invite to ${clanName}`,
      avatar: message.guild.iconURL,
      description: invite.url,
      color: 0x68b87a,
      request: true,
    });
  },
};
