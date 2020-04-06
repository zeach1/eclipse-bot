const Messenger = require('../helper/Messenger.js');

async function clear(message, num, numDeleted) {
  let deletedMessage;
  if (numDeleted === 0) {
    deletedMessage = await message.delete().catch(() => {});
  }

  const fetched = await deletedMessage.channel.fetchMessages({ limit: num > 100 ? 100 : num })
    .catch(() => {});

  let newNumDeleted = numDeleted;
  if (fetched && fetched.size > 0) {
    const deleted = await deletedMessage.channel.bulkDelete(fetched).catch(() => {});

    // the following condition return false if the member is spamming 'clear'
    if (deleted && deleted.size > 0) {
      newNumDeleted += deleted.size;
      if (deleted.size < 100 || numDeleted === num) {
        message.channel.send(`🖍 Deleted ${newNumDeleted} ${newNumDeleted !== 1 ? 'messages' : 'message'}.`)
          .then((msg) => msg.delete(3000).catch(() => {}))
          .catch((e) => Messenger.sendDeveloperError(message, e));
      } else {
        clear(message, num - 100, newNumDeleted);
      }
    }
  } else {
    message.channel.send('😰 There are no messages to delete')
      .then((msg) => msg.delete(3000).catch(() => {}))
      .catch((e) => Messenger.sendDeveloperError(message, e));
  }
}

class Command {
  constructor() {
    this.name = 'clear';

    this.args = 1;
    this.description = 'Removes recent messages from the channel';
    this.type = 'leadership';
    this.usage = '<number>';

    this.details = '`number |` max number to delete is 500 messages';
  }

  execute(message) {
    const num = Number.parseInt(message.args[0], 10);

    if (!num && num !== 0) {
      Messenger.sendArgumentError(message, this, 'You must specify a number of messages to remove');
      return;
    }

    if (num <= 0) {
      Messenger.sendArgumentError(message, this, 'You must remove at least one message');
      return;
    }

    // max number of messages that can be deleted is 500
    clear(message, num > 500 ? 500 : num, 0);
  }
}

module.exports = Command;
