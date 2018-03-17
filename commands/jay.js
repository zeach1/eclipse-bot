const messenger = require('../misc/messenger.js');

module.exports = {
  name: 'jay',
  type: 'misc',
  usage: '<respect | fear | irritate>',
  description: 'Something important for you to know',
  
  args: 1,
  
  execute: function(message, param) {
    let title = '';
    let description = '';
    
    const arg = param.args[0];
    
    switch (arg) {
      case 'respect':
      case 'fear':
        messenger.sendMessage(message, { 
          title: arg.charAt(0).toUpperCase() + arg.slice(1),
          description: arg === 'respect' ? '@everyone respect the dark knight of Go Canada!' : 'You are too weak to take it',
        });
        break;
        
      case 'irritate':
        this.irritatePeril(message, 3);
        break;
        
      default:
        messenger.sendArgumentError(message, this, 'Jay does not approve of this argument.');
        break;
    }
  },
  
  irritatePeril: function(message, num) {
    if (num == 0) return;

    if (message.author.id != process.env.jayID)
      return message.channel.send('You fear him so much... you cannot try it.');

    message.channel.send(`<@${process.env.perilID}>`);
    setTimeout(() => {
      this.irritatePeril(message, num - 1);
    }, 1000);
  },
};