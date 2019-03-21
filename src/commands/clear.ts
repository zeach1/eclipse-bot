import { Message } from 'discord.js';

import { Command, DummyCommand } from '../struct/command';
import { sendArgumentError } from '../util/sendMessage';

const name = 'clear';
const description = 'Removes messages from the channel. Removes 500 at the most.';
const type = 'mod';
const usage = '<number of messages to remove>';

const ClearDummy = new DummyCommand({
  name, description, type, usage,
});

async function fetchAndDelete(
  message: Message, numToDelete: number, numDeleted: number,
): Promise<void> {
  // Fetches messages from server to clear. Can only fetch 100 messages at a time.
  const fetched = await message.channel.fetchMessages({
    limit: numToDelete > 100 ? 100 : numToDelete,
  }).catch(() => {});

  if (fetched && fetched.size > 0) {
    const deleted = await message.channel.bulkDelete(fetched).catch(() => {});

    /*
     * Following if statement prevents program from crashing if the user is spamming clear command.
     * What can happen is that messages are deleted and fetched after, so this if statement
     * cancels that.
     */
    if (deleted && deleted.size > 0) {
      const newNumDeleted = numDeleted + deleted.size;

      /*
       * Base case: no more messages to delete afterwards.
       * Either there were less than 100 messages fetched/deleted or there
       * are exactly 100 messages to delete (which are now deleted).
       */
      if (deleted.size < 100 || numToDelete === 100) {
        await message.channel.send(`🖍 Deleted ${newNumDeleted} ${newNumDeleted === 1 ? 'message' : 'messages'}.`)
          .then((msg: Message) => msg.delete(3000).catch(() => {}))
          .catch(() => {});
      } else {
        await fetchAndDelete(message, numToDelete - 100, newNumDeleted);
      }
    }
  } else {
    await message.channel.send('😰 There are no messages to delete')
      .then((msg: Message) => msg.delete(3000).catch(() => {}))
      .catch(() => {});
  }
}


async function clear(message: Message, fargs: string[]): Promise<Message> {
  // Number of messages to clear.
  const numToDelete = parseInt(fargs[0], 10);
  if (numToDelete <= 0) {
    await sendArgumentError(message, ClearDummy, {
      name: 'You must remove at least one message.',
    });
    return message;
  }

  await message.delete().catch(() => {});
  await fetchAndDelete(message, numToDelete > 500 ? 500 : numToDelete, 0);

  return message;
}

const Clear = new Command({
  name,
  description,
  type,
  usage,
  args: ['number'],
  run: clear,
});

export default Clear;
