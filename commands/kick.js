const messenger = require('../misc/messenger.js');

module.exports = {
  name: 'kick',
  type: 'leadership',
  description: 'Kicks a user from this server.',
  usage: '<user> [reason]',

  args: 1,
  tag: 1,

  execute: async function(message, param) {
    const member = message.mentions.members.first();
    const reason = param.args.slice(1).join(' ');

    if (member.user.bot) return messenger.sendBotTagError(message, member);

    return member.kick(reason)
      .then(() => messenger.sendKickMessage(message, member, reason).catch(e => console.log(e)))
      .catch(() =>
        messenger.sendError(message, {
          message: `Cannot kick ${member.displayName}`,
          submessage: `${member} has more permissions than me`,
        }).catch(e => console.log(e))
      );
  },
};
