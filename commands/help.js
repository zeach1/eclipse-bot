const Discord = require('discord.js');
const { prefix } = require('../.data/config.js');

module.exports = {
  name: 'help',
  description: 'Gives a user the list of commands he/she can use',

  execute(message) {
    const { commands } = message.client;

    const embed = new Discord.RichEmbed()
      .setTitle('Eclipse Bot Commands')
      .setColor(0xdba41a);

    const embedLeadership = new Discord.RichEmbed()
      .setTitle('Leadership Commands')
      .setColor(0xdba41a);

    for (const command of commands.array())
      if (!command.leadership)
        embed.addField(`${prefix}${command.name} ${command.usage ? command.usage : ''}`, command.description);
      else
        embedLeadership.addField(`${prefix}${command.name} ${command.usage ? command.usage : ''}`, command.description);

    message.channel.send(embed);
    message.channel.send(embedLeadership);
  },
};
