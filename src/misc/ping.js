'use strict';

const express = require('express');
const http = require('http');
const Util = require('../helper/Util.js');

const app = express();

app.get('/', (request, response) => {
  const { date, time } = Util.getDateTimeLocale(new Date(), 'en-US');

  console.log(`Ping Received: ${date} at ${time}`);
  response.sendStatus(200);
});

app.listen(process.env.PORT);

setInterval(() => {
  http.get(`http://${process.env.PROJECT_DOMAIN}.glitch.me/`);
}, 280000);
