const messenger = require('../misc/messenger.js');

module.exports = {
  name: 'help',
  type: 'essentials',
  description: 'Gives the list of available commands\n\u200b',

  execute: function(message) {
    const commands = message.client.commands.filterArray(command => command.type !== 'developer');
    
    messenger.sendCommandList(message, commands);
  },
};
