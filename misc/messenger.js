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
      .setAuthor('⛔️ Permissions Denied')
      .setColor(0xf00000)
      .addField('You do not have permissions to use this command.', 'Talk to @Leadership if you think this is a mistake.');

    message.channel.send(embed);
  },
};
