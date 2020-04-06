import winston from 'winston';

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
