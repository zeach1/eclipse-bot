module.exports = {
  name: 'zdev',
  type: 'developer',
  execute: async function(message) {
    return message.channel.send(`${message.member.displayName} is the best`);
  },
};
