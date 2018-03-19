module.exports = {
  name: 'lina',
  type: 'misc',
  description: 'Feeling angsty?',

  execute: async function(message) {
    return message.channel.send('**#ANGST**');
  },
};
