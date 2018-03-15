const outdent = require('outdent');

const check = require('../misc/check.js');
const messenger = require('../misc/messenger.js');

module.exports = {
  name: 'identify',
  type: 'leadership',
  description: 'Tells a user to identify him/herself on WarMatch',
  usage: '<@player> [player name/id] [-d]',

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
    
    if (options.includes('d'))
      message.delete().catch(console.error);
  },
};
