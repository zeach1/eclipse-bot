import moment from 'moment-timezone';

import { isBusy, setBusy } from '../../util/busy';
import { sendEmbed } from '../../util/messenger';

const COOLDOWN_MS = 5000;
const TIME_FORMAT = 'MMMM D, YYYY, h:mm A z';

export const name = 'time';

export const description = 'Displays current time in Eclipse\'s default timezone or location if given';

export const args = 0;

export const mentions = 0;

/**
 * @param {!import('discord.js').Message} message
 */
export function execute(message) {
  if (isBusy(name)) {
    return;
  }

  setBusy(name, COOLDOWN_MS);

  sendEmbed(message, {
    title: '📅 Current Time',
    description: moment().format(TIME_FORMAT),
    color: 0x00666f,
  });
}
