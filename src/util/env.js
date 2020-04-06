import express from 'express';
import http from 'http';
import moment from 'moment-timezone';

import { TIMEZONE } from '../config/config';

const OK_STATUS = 200;
const PING_INTERVAL_MS = 280000;
const ECLIPSE_BOT_URL = `http://${process.env.PROJECT_DOMAIN}.glitch.me/`;
const ECLIPSE_BOT_PORT = process.env.PORT;

/**
 * Sets up environment for when the project is running in Glitch, which includes setting up
 * pinging the project URL and returning ok to it every so often.
 *
 * Glitch sets up environment variables automatically from .env.
 */
function setUpGlitchEnvironment() {
  const app = express();

  app.get('/', (_request, response) => {
    response.sendStatus(OK_STATUS);
  });

  app.listen(ECLIPSE_BOT_PORT);

  setInterval(() => {
    http.get(ECLIPSE_BOT_URL);
  }, PING_INTERVAL_MS);
}

/**
 * Sets up environment variables in .env file when running it locally in own computer.
 */
function setUpLocalEnvironment() {
  // eslint-disable-next-line global-require
  require('dotenv').config();
}

/**
 * Checks if environment is in Glitch or not.
 */
function inGlitchEnvironment() {
  return process.env.PROJECT_DOMAIN !== undefined;
}

/**
 * Sets up environment variables and timezone.
 */
export function setUpEnvironment() {
  if (inGlitchEnvironment()) {
    setUpGlitchEnvironment();
  } else {
    setUpLocalEnvironment();
  }

  moment.tz.setDefault(TIMEZONE);
}

export default {
  setUpEnvironment,
};
