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

  /**
   * @param {Discord.Message} message The message sent
   * @param {Object} param Contains arguments and options
   * @return {Promise<Discord.Message>}
   */
  execute: async function(message, param) {
    const { args, options } = param;
    const member = message.mentions.members.first();

    if (member.user.bot) return messenger.sendBotTagError(message, member);

    const name = args[1] ? `#${args[1].replace(/[^a-z0-9]/g, '', '').toUpperCase()}` : member.displayName;
    
    const wardiscussion = message.guild.channels.get(channel.wardiscussion);
    return wardiscussion.send(outdent`
        ${outdent}
        ${member}, register your account in WarMatch.
        ⚔️ Go to <#${channel.wmbot}>
        ⚔️ Type \`!wm identify ${name}\`

        *Ignore when <@185112286308990991> asks to add your war weight*
      `)
      .then(() => {
        if (options.includes('d') || options.includes('delete'))
          message.delete().catch(() => {});
      });
  },
};