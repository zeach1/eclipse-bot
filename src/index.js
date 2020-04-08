import { startClient } from './util/client';
import { setUpCommands } from './util/command';
import { setUpEnvironment } from './util/env';
import logger from './util/logger';

setUpEnvironment();
setUpCommands();
startClient();

process.on('unhandledRejection', (e) => {
  logger.error(`Uncaught Promise Rejection - ${e}`);
});
