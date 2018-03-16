const outdent = require('outdent');

const check = require('../misc/check.js');
const messenger = require('../misc/messenger.js');

module.exports = {
  name: 'invite',
  type: 'essentials',
  usage: '[-n | -new]',
  description: outdent({ 'trimLeadingNewline': true })`
    Shows invite link for this server
    \`\`
    [-n | -new]  create new invite
    \`\`
    \u200b
  `,

  execute: async function(message, args, options) {
    if ((options.includes('n') || options.includes('new')) && !check.verifyLeadership(message))
      messenger.sendPermissionError(message);

    const invites = await message.guild.fetchInvites();

    let invite = invites.first();
    if (!invite || options.includes('n') || options.includes('new'))
      invite = await message.guild.channels.get('275563358214946816').createInvite({
          temporary: true,
          maxAge: 1200,
          unique: true,
      });

    messenger.sendMessage(message, {
      author: '✅ Invite Link',
      description: invite.url,
      color: 0x68b87a,
    });
  },
};
