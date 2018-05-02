'use strict';

const Messenger = require('../helper/Messenger.js');

async function clear(message, num, numDeleted) {
  if (numDeleted === 0) {
    message = await message.delete().catch(() => {});
  }

  const fetched = await message.channel.fetchMessages({ limit: num > 100 ? 100 : num }).catch(() => {});

  if (fetched && fetched.size > 0) {
    const deleted = await message.channel.bulkDelete(fetched).catch(() => {});

    /* The following condition return false if the member is spamming 'clear' */
    if (deleted && deleted.size > 0) {
      numDeleted += deleted.size;
      if (deleted.size < 100 || numDeleted === num) {
        message.channel.send(`🖍 Deleted ${numDeleted} ${numDeleted !== 1 ? 'messages' : 'message'}.`)
          .then(msg => msg.delete(3000).catch(() => {}))
          .catch(console.error);
      } else {
        clear(message, num - 100, numDeleted);
      }
    }
  } else {
    message.channel.send('😰 There are no messages to delete')
      .then(msg => msg.delete(3000).catch(() => {}))
      .catch(console.error);
  }
}

class Command {
  constructor() {
    this.name = 'clear';

    this.args = 1;
    this.description = 'Removes recent messages from the channel (500 max)';
    this.type = 'leadership';
    this.usage = '<number>';
  }

  execute(message) {
    const num = parseInt(message.args[0]);

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

module.exports = new Command();
