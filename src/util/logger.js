import moment from 'moment-timezone';
import winston from 'winston';

import { TIMEZONE } from '../config';

const LOG_FILEPATH = 'data/application.log';
const DATE_FORMAT = 'YYYY-MM-DD hh:mm:ss';
const TEMPLATE = winston.format.printf(
  (data) => `[${moment().tz(TIMEZONE).format(DATE_FORMAT)}] [${data.level}] ${data.message}`,
);

const logger = winston.createLogger({
  transports: [
    new winston.transports.Console({
      format: winston.format.combine(winston.format.colorize(), TEMPLATE),
    }),
    new winston.transports.File({
      filename: LOG_FILEPATH,
      format: winston.format.combine(TEMPLATE),
    }),
  ],
});

/**
 * Creates message given message and params, stringifies any objects
 * @param  {any} message Message to send
 * @param {...any} [optionalParams] Extra information to pass to message
 */
function createMessage(message, ...optionalParams) {
  let logMessage = '';
  [message, ...optionalParams].forEach((param) => {
    if (typeof param === 'object') {
      logMessage += JSON.stringify(param);
    } else {
      logMessage += param;
    }
    logMessage += ' ';
  });
  return logMessage;
}

/**
 * @param  {any} message Message to send
 * @param {...any} [optionalParams] Extra information to pass to message
 */
export function info(message, ...optionalParams) {
  logger.info(createMessage(message, ...optionalParams));
}

/**
 * @param  {any} message Message to send
 * @param {...any} [optionalParams] Extra information to pass to message
 */
export function error(message, ...optionalParams) {
  logger.error(createMessage(message, ...optionalParams));
}

/**
 * @param  {any} message Message to send
 * @param {...any} [optionalParams] Extra information to pass to message
 */
export function fatal(message, ...optionalParams) {
  const errorMessage = createMessage(message, ...optionalParams);
  logger.error(errorMessage);
  throw new Error(errorMessage);
}

export default {
  info,
  error,
  fatal,
};
