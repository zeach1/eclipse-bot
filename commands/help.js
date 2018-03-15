const Discord = require('discord.js');
const { prefix } = require('../.data/config.js');

module.exports = {
  name: 'help',
  type: 'essentials',
  description: 'Gives the list of available commands',

  execute: function(message, args) {
    const commands = message.client.commands.array();
    
    const helpEssentials =  new Discord.RichEmbed()
      .setAuthor('⚠️ Eclipse Bot Help')
      .setTitle('Essentials')
      .setColor(0xdba41a);
    
    const helpLeadership = new Discord.RichEmbed()
      .setTitle('Leadership')
      .setColor(0xdba41a);

    const helpMisc = new Discord.RichEmbed()
      .setFooter(`Requested by ${message.member.displayName} at ${message.createdAt.toUTCString()}`)
      .setTitle('Miscellaneous')
      .setColor(0xdba41a);

    for (const command of commands) {
      switch (command.type) {
        case 'essentials':
          helpEssentials.addField(`${prefix}${command.name} ${command.usage ? command.usage : ''}`, command.description);
          break;
          
        case 'leadership':
          helpLeadership.addField(`${prefix}${command.name} ${command.usage ? command.usage : ''}`, command.description);
          break;
          
        case 'misc':
          helpMisc.addField(`${prefix}${command.name} ${command.usage ? command.usage : ''}`, command.description);
          break;
      }
    }
    
    message.channel.send(helpEssentials);
    message.channel.send(helpLeadership);
    message.channel.send(helpMisc);
  },
};
