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

  // max time is 1 day
  let time = '';
  if (duration === 1440) {
    time += '1 day';
  } else {
    if (duration > 60) {
      const hours = Math.floor(duration / 60);
      time += `${hours} ${duration === 1 ? 'hour' : 'hours'}`;
    }

    const minutes = Math.floor(duration % 60);
    if (minutes !== 0) {
      time += `${duration > 60 ? ' ' : ''}${minutes} ${minutes === 1 ? 'minute' : 'minutes'}`;
    }

    const seconds = Math.floor((duration % 1) * 60);
    if (seconds !== 0) {
      time += `${duration > 60 || minutes !== 0 ? ' ' : ''}${seconds} ${seconds === 1 ? 'second' : 'seconds'}`;
    }
  }

  Messenger.sendMessage(message, {
    title: '🔇 Success',
    color: 0x9e3612,
    description: `**${added[0]}** is muted for ${time}`,
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
    this.usage = '<member> [duration in minutes]';
  }

  execute(message) {
    const commandName = message.content.slice(prefix.length)
      .trim()
      .split(/ +/)
      .shift();

    const member = message.mentions.members.first();

    // duration unit in minutes
    let duration = parseFloat(message.args[1]) || DURATION;

    // max mute is 1 day = 1440 minutes
    if (duration > 1440) duration = 1440;

    switch (commandName) {
      case 'mute': mute(message, member, duration); break;
      case 'unmute': unmute(message, member); break;
    }
  }
}

module.exports = new Command();
