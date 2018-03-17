const check = require('../misc/check.js');
const messenger = require('../misc/messenger.js');

module.exports = {
  name: 'invite',
  type: 'essentials',
  description: 'Shows invite link for this server',

  execute: async function(message) {
    const invites = await message.guild.fetchInvites();

    let invite = invites.last();
    if (!invite)
      invite = await message.guild.channels.get('275563358214946816').createInvite({
          temporary: true,
          maxAge: 1200,
          unique: true,
      });

    messenger.sendMessage(message, {
      title: 'Invite Link',
      avatar: message.guild.iconURL,
      description: invite.url,
      color: 0x68b87a,
      request: true,
    });
  },
};