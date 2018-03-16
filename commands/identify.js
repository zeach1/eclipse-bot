const outdent = require('outdent');

const messenger = require('../misc/messenger.js');

module.exports = {
  name: 'identify',
  type: 'leadership',
  usage: '<user> [player id] [-d | -delete]',
  description: outdent({ 'trimLeadingNewline': true })`
    Tells a user to identify him/herself on WarMatch
    \`\`
    <user>          user to instruct
    [player id]     user's player ID
    [-d | -delete]  delete command message
    \`\`
    \u200b
  `,

  args: 1,
  tag: 1,

  execute: function(message, args, options) {
    const member = message.mentions.members.first();

    if (member.bot)
      return messenger.sendArgumentError('You cannot ask a bot to do this.', message, this);

    message.channel.send(outdent({ 'trimLeadingNewline': true })`
        ${member}, register your account in WarMatch.
        ⚔️ Go to <#275563260386869248>
        ⚔️ Type \`!wm identify ${args[1] ? args[1] : member.displayName}\``
      );

    if (options.includes('d') || options.includes('delete'))
      message.delete().catch(console.error);
  },
};
