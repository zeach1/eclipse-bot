const { channel } = require('../config/config.js');
const outdent = require('outdent');

class Command {
  constructor() {
    this.name = 'identify';

    this.args = 1;
    this.description = 'Tells a member to identify him/herself on WarMatch';
    this.tag = 1;
    this.type = 'leadership';
    this.usage = '<member> [player id] [-d | -delete]';
  }

  execute(message) {
    const member = message.mentions.members.first();

    let clashTag = member.displayName;
    if (message.args[1]) {
      clashTag = `#${message.args[1].replace(/[^a-z0-9]/g, '').toUpperCase()}`;
    }

    const wardiscussion = message.guild.channels.get(channel.war_discussion);
    wardiscussion.send(outdent`
      ${outdent}
      ${member}, register your account in WarMatch.
      ⚔️ Go to <#${channel.wmbot}>
      ⚔️ Type \`!wm identify ${clashTag}\`
      *Ignore when <@185112286308990991> asks for your war weight*
    `)
      .then(() => {
        if (message.options.includes('d') || message.options.includes('delete')) {
          message.delete().catch(() => {});
        }
      })
      .catch(console.error);
  }
}

module.exports = new Command();
