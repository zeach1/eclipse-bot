const outdent = require('outdent');

const messenger = require('../misc/messenger.js');

module.exports = {
  name: 'identify',
  type: 'leadership',
  usage: '<user> [player id] [-d | -delete]',
  description: 'Tells a user to identify him/herself on WarMatch',

  args: 1,
  tag: 1,

  execute: function(message, param) {
    const member = message.mentions.members.first();

    if (member.user.bot)
      return messenger.sendBotTagError(message, member);

    message.channel.send(outdent({ 'trimLeadingNewline': true })`
        ${member}, register your account in WarMatch.
        ⚔️ Go to <#275563260386869248>
        ⚔️ Type \`!wm identify ${param.args[1] ? param.args[1] : member.displayName}\``
      );

    if (param.options.includes('d') || param.options.includes('delete'))
      message.delete().catch(console.error);
  },
};
