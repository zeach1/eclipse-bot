const outdent = require('outdent');

const messenger = require('../misc/messenger.js');

module.exports = {
  name: 'help',
  type: 'essentials',
  description: 'Gives the list of available commands',

  execute: async function(message) {
    const commands = message.client.commands.filterArray(command => command.type !== 'developer');

    const essentials = {
      type: 'essentials',
      commandList: commands.filter(command => command.type === 'essentials'),
    };
    const leadership = {
      type: 'leadership',
      commandList: commands.filter(command => command.type === 'leadership'),
    };
    const misc = {
      type: 'misc',
      commandList: commands.filter(command => command.type === 'misc'),
    };
    
    return messenger.sendCommandList(message, [essentials, leadership, misc]);
  },
};
