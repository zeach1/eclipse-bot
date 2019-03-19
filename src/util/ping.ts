// File to run on Glitch to keep bot running 24/7.

import express from 'express';
import http from 'http';

const app = express();

export default function ping(): void {
  app.get('/', (request, response) => {
    response.sendStatus(200);
  });

  app.listen(process.env.PORT);

  // Ping project domain every few minutes to keep bot alive.
  setInterval(() => {
    http.get(`http://${process.env.PROJECT_DOMAIN}.glitch.me/`);
  }, 280000);
}
