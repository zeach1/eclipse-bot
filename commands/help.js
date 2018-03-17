const outdent = require('outdent');

const messenger = require('../misc/messenger.js');

module.exports = {
  name: 'help',
  type: 'essentials',
  description: 'Gives the list of available commands',

  execute: function(message) {
    const commands = message.client.commands.filterArray(command => command.type !== 'developer');

    const essentials = commands.filter(command => command.type === 'essentials');
    const leadership = commands.filter(command => command.type === 'leadership');
    const misc       = commands.filter(command => command.type === 'misc');
    
    messenger.sendCommandList(message, {
      essentials: essentials,
      leadership: leadership,
      misc: misc,
    });
  },
};
