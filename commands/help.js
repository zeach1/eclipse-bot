const messenger = require('../helper/messenger.js');

module.exports = {
  name: 'help',
  type: 'essentials',
  description: 'Gives the list of available commands',

  execute: async function(message) {
    const commands = message.client.commands;

    const essentials = { type: 'essentials', commandList: commands.filter(command => command.type === 'essentials') };
    const leadership = { type: 'leadership', commandList: commands.filter(command => command.type === 'leadership') };
    const developer =  { type: 'developer', commandList: commands.filter(command => command.type === 'developer') };
    const misc = { type: 'misc', commandList: commands.filter(command => command.type === 'misc') };

    return messenger.sendCommandList(message, [essentials, misc, leadership, developer]);
  },
};
