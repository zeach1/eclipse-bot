const outdent = require('outdent');

const { channel } = require('../data/config.js');

const messenger = require('../helper/messenger.js');

module.exports = {
  name: 'identify',
  type: 'leadership',
  usage: '<user> [player id] [-d | -delete]',
  description: 'Tells a user to identify him/herself on WarMatch',

  args: 1,
  tag: 1,

  execute: async function(message, param) {
    const member = message.mentions.members.first();

    if (member.user.bot) return messenger.sendBotTagError(message, member);

    return message.channel.send(outdent({ 'trimLeadingNewline': true })`
        ${member}, register your account in WarMatch.
        ⚔️ Go to <#${channel.wmbot}>
        ⚔️ Type \`!wm identify ${param.args[1] ? param.args[1] : member.displayName}\`
      `)
      .then(() => {
        if (param.options.includes('d') || param.options.includes('delete'))
          message.delete().catch(e => console.log(e));
      });
  },
};
