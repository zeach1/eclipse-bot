import winston from 'winston';

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
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.simple(),
      ),
    }),

    new winston.transports.File({
      filename: 'output/client.log',
      format: winston.format.json(),
    }),
  ],
});
