module.exports = {
  name: 'lina',
  type: 'misc',
  description: 'Feeling angsty?',

  /**
   * @param {Discord.Message} message The message sent
   * @return {Promise<Discord.Message>}
   */
  execute: async function(message) {
    return message.channel.send('**#ANGST**');
  },
};
