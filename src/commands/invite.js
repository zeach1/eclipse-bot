const { channel, clanName } = require('../config/config.js');
const Messenger = require('../helper/Messenger.js');

class Command {
  constructor() {
    this.name = 'invite';

    this.description = 'Shows invite link for this server';
    this.type = 'essentials';
  }

  async execute(message) {
    const invites = await message.guild.fetchInvites().catch(() => {});

    let invite = invites.last();
    if (!invite) {
      invite = await message.guild.channels.get(channel.welcome).createInvite({
        temporary: true,
        maxAge: 1200,
        unique: true,
      }).catch(console.error);
    }

    Messenger.sendMessage(message, {
      title: `Invite to ${clanName}`,
      avatar: message.guild.iconURL,
      description: invite.url,
      color: 0x68b87a,
      request: true,
    });
  }
}

module.exports = new Command();
