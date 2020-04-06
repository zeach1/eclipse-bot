import { startClient } from './util/client';
import { setUpEnvironment } from './util/env';
import logger from './util/logger';

setUpEnvironment();
startClient();

process.on('unhandledRejection', (e) => {
  logger.error(`Uncaught Promise Rejection\n ${e}`);
});
