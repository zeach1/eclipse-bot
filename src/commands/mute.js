'use strict';

const Member = require('../helper/Member.js');
const Messenger = require('../helper/Messenger.js');
const { prefix } = require('../config/config.js');

const muted = 'Muted';
const DURATION = 5;

async function mute(message, member, duration) {
  const added = await Member.addRoleToMembers(message, [member], muted).catch(console.error);

  if (!added[0]) {
    Messenger.sendError(message, {
      message: 'Cannot mute member',
      color: 0xf06c00,
      submessage: `**${member.displayName}** is already muted`,
    });
    return;
  }

  Messenger.sendMessage(message, {
    title: '🔇 Success',
    color: 0x9e3612,
    description: `**${added[0]}** is muted for ${duration} ${duration === 1 ? 'minute' : 'minutes'}`,
  });

  setTimeout(async () => {
    await Member.removeRoleFromMembers(message, [member], muted).catch(console.error);
  }, duration * 60000);
}

async function unmute(message, member) {
  const removed = await Member.removeRoleFromMembers(message, [member], muted).catch(console.error);

  if (!removed[0]) {
    Messenger.sendError(message, {
      message: 'Cannot unmute member',
      color: 0xf06c00,
      submessage: `**${member.displayName}** is not muted`,
    });
    return;
  }

  Messenger.sendMessage(message, {
    title: '🔈 Success',
    color: 0x129e27,
    description: `**${removed[0]}** is unmuted`,
  });
}

class Command {
  constructor() {
    this.name = 'mute';

    this.aliases = ['unmute'];
    this.args = 1;
    this.description = 'Mutes/unmutes a member from speaking in clan channels';
    this.tag = 1;
    this.type = 'leadership';
    this.usage = '<member> [duration in minutes, if muting]';
  }

  execute(message) {
    const commandName = message.content.slice(prefix.length)
      .trim()
      .split(/ +/)
      .shift();

    const member = message.mentions.members.first();

    // duration unit in minutes
    const duration = parseFloat(message.args[1]) || DURATION;

    switch (commandName) {
      case 'mute': mute(message, member, duration); break;
      case 'unmute': unmute(message, member); break;
    }
  }
}

module.exports = new Command();
