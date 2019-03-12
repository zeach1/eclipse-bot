import * as Discord from 'discord.js';
import * as moment from 'moment-timezone';

import { timeZone } from '@config/index';

console.log(timeZone);

declare const require: any; // eslint-disable-line @typescript-eslint/no-explicit-any
require('dotenv').config();

moment.tz.setDefault('America/New_York');

const client = new Discord.Client();

function ready(): void {
  client.user.setActivity('with TypeScript', { type: 'PLAYING' });
}

client.on('ready', ready);

client.login('NDM5NzExMDUzMzcxMjc3MzEy.DtU1gw.FOflw-703BfL_8TuX0TWhtWr7m4');
