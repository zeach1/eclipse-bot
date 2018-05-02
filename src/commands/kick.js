'use strict';

const Messenger = require('../helper/Messenger.js');

class Command {
  constructor() {
    this.name = 'kick';

    this.args = 1;
    this.description = 'Kicks a person from this server';
    this.tag = 1;
    this.type = 'leadership';
    this.usage = '<user> [reason]';
  }

  execute(message) {
    const member = message.mentions.members.first();
    const reason = message.args.slice(1).join(' ');

    if (member.user.bot) {
      Messenger.sendBotTagError(message, member);
      return;
    }

    member.kick(reason)
      .then(() => Messenger.sendKickMessage(message, member, reason))
      .catch(() =>
        Messenger.sendError(message, {
          message: `Cannot kick ${member.displayName}`,
          submessage: `${member} has more permissions than me`,
        })
      );
  }
}

module.exports = new Command();
