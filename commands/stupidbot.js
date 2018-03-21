module.exports = {
  name: 'stupidbot',
  type: 'misc',
  description: 'No u',

  execute: async function(message) {
    return message.channel.send('**NO U**');
  },
};
