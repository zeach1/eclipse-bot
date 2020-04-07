import moment from 'moment-timezone';
import winston from 'winston';

import { TIMEZONE } from '../config';

const DATE_FORMAT = 'YYYY-MM-DD hh:mm:ss';
const TEMPLATE = winston.format.printf(
  (info) => `[${moment().tz(TIMEZONE).format(DATE_FORMAT)}] [${info.level}] ${info.message}`,
);

/**
 * Gets string of an object.
 * @param {object} object
 */
export function toString(object) {
  return JSON.stringify(object);
}

export default winston.createLogger({
  transports: [
    new winston.transports.Console({
      format: winston.format.combine(winston.format.colorize(), TEMPLATE),
    }),
    new winston.transports.File({
      filename: 'output/client.log',
      format: winston.format.combine(TEMPLATE),
    }),
  ],
});
