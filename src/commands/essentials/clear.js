import { setBusy, setAvailable, isBusy } from '../../util/busy';
import * as logger from '../../util/logger';
import { sendArgumentError, sendAndDeleteRaw } from '../../util/messenger';

const DELETION_TIMEOUT_MS = 3000;

export const name = 'clear';

export const description = 'Removes recent messages from the channel';

export const args = 1;

export const mentions = 0;

export const usage = '<number of messages>';

export const details = `\
Arguments:
  <number of messages>    Maximum is 500
`;

/**
 * Deletes recent messages from channel.
 * @param {!import('discord.js').Message} message Message context
 * @param {!number} numberOfRemainingMessages Number of messages to delete
 * @param {!number} numberOfDeletedMessages Number of messages deleted
 */
async function clear(message, numberOfRemainingMessages, numberOfDeletedMessages) {
  const limit = numberOfRemainingMessages > 100 ? 100 : numberOfRemainingMessages;
  const fetched = await message.channel.messages.fetch({ limit }).catch((e) => logger.error(e));
  if (fetched.size() === 0 && numberOfDeletedMessages === 0) {
    await sendAndDeleteRaw(message, 'No messages to delete', DELETION_TIMEOUT_MS);
    return;
  }

  const deleted = await message.channel.bulkDelete(fetched).catch((e) => logger.error(e));

  if (limit < numberOfRemainingMessages) {
    clear(message, numberOfRemainingMessages - limit, numberOfRemainingMessages + deleted.size());
    return;
  }

  await sendAndDeleteRaw(
    message,
    `✏️ Successfully deleted ${numberOfDeletedMessages + limit} messages`,
    DELETION_TIMEOUT_MS,
  );

  setAvailable(this);
}

/**
 * @param {!import('discord.js').Message} message Message context
 * @param {!import('minimist').ParsedArgs} args Parsed arguments
 */
export async function execute(message, args) {
  if (isBusy(this)) {
    return;
  }

  const numberOfMessages = Number.parseInt(args._[0], 10);
  if (!Number.isInteger(numberOfMessages)) {
    sendArgumentError(message, this, 'You must specify a number');
    return;
  }
  if (numberOfMessages <= 0 || numberOfMessages > 500) {
    sendArgumentError(message, this, 'You can remove between 1-500 messages');
    return;
  }

  setBusy(this);

  await message.delete((e, promise) => logger.error('Failed to delete user message', e, promise));
  clear(message, numberOfMessages, 0);
}
