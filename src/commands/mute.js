const outdent = require('outdent');
const Member = require('../helper/Member.js');
const Messenger = require('../helper/Messenger.js');
const { prefix, role } = require('../config/config.js');

const MUTED = role.muted;
const DURATION = 5;

async function mute(message, member, duration, reason) {
  const added = await Member.addRoleToMembers(message, [member], MUTED)
    .catch((e) => Messenger.sendDeveloperError(message, e));

  if (!added[0]) {
    Messenger.sendError(message, {
      message: 'Cannot mute member',
      color: 0xf06c00,
      submessage: `**${member.displayName}** is already muted`,
    });
    return;
  }

  // max mute is 1 day
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
    description: outdent`
      ${outdent}
      **${added[0]}** is muted for ${time}
      ${reason ? `*${reason}*` : ''}
    `,
  });

  setTimeout(async () => {
    await Member.removeRoleFromMembers(message, [member], MUTED)
      .catch((e) => Messenger.sendDeveloperError(message, e));
  }, duration * 60000);
}

async function unmute(message, member) {
  const removed = await Member.removeRoleFromMembers(message, [member], MUTED)
    .catch((e) => Messenger.sendDeveloperError(message, e));

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
    this.usage = '<member> [duration in minutes] [reason]';
  }

  execute(message) {
    const commandName = message.content.slice(prefix.length).trim().split(/ +/).shift().toLowerCase(); // eslint-disable-line

    const member = message.mentions.members.first();
    let reason;

    // duration unit in minutes
    let duration = parseFloat(message.args[1]);

    if (duration) {
      reason = message.content.trim().split(/ +/).slice(3).join(' '); // eslint-disable-line
    } else {
      duration = DURATION;
      reason = message.content.trim().split(/ +/).slice(2).join(' '); // eslint-disable-line
    }


    // max mute is 1 day = 1440 minutes
    if (duration > 1440) duration = 1440;

    switch (commandName) {
      case 'mute': mute(message, member, duration, reason); break;
      case 'unmute': unmute(message, member); break;
      default: break;
    }
  }
}

module.exports = Command;
