const messenger = require('../misc/messenger.js');

module.exports = {
  name: 'lina',
  type: 'misc',
  description: 'Lina\'s command',
  
  execute: function(message, param) {
    messenger.sendMessage(message, { description: '**#ANGST**' });
    
    if (param.options.includes('d') || param.options.includes('delete'))
      message.delete().catch(console.error);
  },
};