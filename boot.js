const http = require('http');
const express = require('express');
const app = express();

app.get("/", (request, response) => {
  const date = new Date();
  console.log(`Ping Received: ${date.toLocaleString()}`);
  response.sendStatus(200);
});

app.listen(process.env.PORT);

setInterval(() => {
  http.get(`http://${process.env.PROJECT_DOMAIN}.glitch.me/`);
}, 280000);