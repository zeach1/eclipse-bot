const { prefix } = require('../.data/config.js');
const Discord = require('discord.js');

module.exports = {
  sendArgumentError: function(warning, message, command) {
    const embed = new Discord.RichEmbed()
      .setAuthor('❌ Error Message')
      .setColor(0xf06c00)
      .addField(warning, `Proper usage is ${prefix}${command.name}${command.usage ? ` ${command.usage}` : ' '}`);

    message.channel.send(embed);
  },

  sendPermissionError: function(message) {
    const embed = new Discord.RichEmbed()
      .setAuthor('🚫 Permissions Denied')
      .setColor(0xf00000)
      .addField('You do not have permissions to use this command.', 'Talk to @Leadership if you think this is a mistake.');

    message.channel.send(embed);
  },
  
  sendCommandList: function(message, commands) {
    const embed =  new Discord.RichEmbed()
      .setAuthor('⚠️ Eclipse Bot Help')
      .setDescription('*<mandatory argument> [optional argument]*')
      .setColor(0xe7a237)
      .setFooter(`Requested by ${message.member.displayName} at ${message.createdAt.toUTCString()}`);
                                     
    for (const command of commands)
      embed.addField(`${prefix}${command.name}${command.usage ? ` ${command.usage}` : ' '}`, command.description);
    
    message.channel.send(embed);
  },
  
  sendMessage: function(message, info) {
    const embed = new Discord.RichEmbed()
      .setAuthor(info.author ? info.author : '💯 Message')
      .setColor(info.color ? info.color : 0x3498db)
      .setFooter(`Requested by ${message.member.displayName}`);
    
    if (info.description)
      embed.setDescription(info.description);
    
    message.channel.send(embed);
  },
};