const messenger = require('../misc/messenger.js');
const { user } = require('../data/config.js');

module.exports = {
  name: 'jay',
  type: 'misc',
  usage: '<respect | fear | irritate>',
  description: 'Something important for you to know',

  args: 1,

  execute: async function(message, param) {
    const arg = param.args[0];

    switch (arg) {
      case 'respect':
      case 'fear':
        return messenger.sendMessage(message, {
          title: `${arg.charAt(0).toUpperCase()}${arg.slice(1)} Jay`,
          description: arg === 'respect' ? '@everyone respect the dark knight of Go Canada!' : 'You are too weak to take it.',
        });

      case 'irritate':
        return this.irritatePeril(message);

      default:
        return messenger.sendArgumentError(message, this, 'Jay does not approve of this argument.');
    }
  },

  irritatePeril: async function(message, num) {
    if (num == 0) return;
    
    if (message.author.id != user.jay)
      return messenger.sendMessage(message, {
        description: 'You fear him so much... you **[cannot](https://cdn.discordapp.com/attachments/390086345957179393/408337364868530206/trigger.gif)** try it.',
        color: 'black',
      });
    
    
    const peril = message.channel.members.get(user.peril);
    const jay = message.channel.members.get(user.jay);
    
    if (!peril || !jay)
      return message.channel.send('Well isn\'t this something? One of them is not here anymore!');
      
    await message.channel.send('*This command has changed per request, but that doesnt stop the fun!*');
    
    await setTimeout(() => {
      messenger.send(message, {
          title: peril.displayName,
          avatar: peril.user.avatarURL,
          description: '...',
          color: 0x747f8d,
        }).catch(e => console.log(e));
    }, 1000);
    
    await setTimeout(() => {
      messenger.send(message, {
        title: jay.displayName,
        avatar: jay.user.avatarURL,
        description: 'Peril, are you there?',
        color: 0x43b581,
      }).catch(e => console.log(e));
    }, 2000);
    
    await setTimeout(() => {
      messenger.send(message, {
          title: peril.displayName,
          avatar: peril.user.avatarURL,
          description: '...',
          color: 0x747f8d,
        }).catch(e => console.log(e));
    }, 3000);
    
    await setTimeout(() => {
      messenger.send(message, {
        title: jay.displayName,
        avatar: jay.user.avatarURL,
        description: 'Darn. He\'s sleeping. I guess I have to do with at I gotta do!',
        color: 0x43b581,
      }).catch(e => console.log(e));
    }, 4000);
    
    await setTimeout(() => {
      messenger.send(message, {
        title: jay.displayName,
        avatar: jay.user.avatarURL,
        description: `<@${user.peril}>!!!!`,
        color: 0x43b581,
      }).catch(e => console.log(e));
    }, 5000);
    
    await setTimeout(() => {
      messenger.send(message, {
          title: peril.displayName,
          avatar: peril.user.avatarURL,
          description: 'Huh?',
          color: 0x43b581,
        }).catch(e => console.log(e));
    }, 6000);
    
    await setTimeout(() => {
      messenger.send(message, {
        title: jay.displayName,
        avatar: jay.user.avatarURL,
        description: `<@${user.peril}>!!!!`,
        color: 0x43b581,
      }).catch(e => console.log(e));
    }, 7000);
    
    await setTimeout(() => {
      messenger.send(message, {
        title: jay.displayName,
        avatar: jay.user.avatarURL,
        description: `<@${user.peril}>!!!!`,
        color: 0x43b581,
      }).catch(e => console.log(e));
    }, 7500);
    
    await setTimeout(() => {
      messenger.send(message, {
          title: peril.displayName,
          avatar: peril.user.avatarURL,
          description: 'STOP IRRITATING ME',
          color: 0xf04747,
        }).catch(e => console.log(e));
    }, 8000);
  },
};
