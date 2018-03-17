module.exports = {
  name: 'zdev',
  type: 'developer',
  execute: function(message) {
    message.channel.send(`${message.member.displayName} is the best`);
  },
};
