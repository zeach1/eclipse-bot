module.exports = {
  name: 'temp',
  type: 'developer',
  execute: function(message) {
    for (let i = 1; i <= 200; i++)
      message.channel.send(i);
  },
};