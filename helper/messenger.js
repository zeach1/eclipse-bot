const outdent = require('outdent');
const Discord = require('discord.js');

const { rules, password, channelCategory, channel, group, prefix } = require('../data/config.js');

module.exports = {
  /**
   * Called from help command.
   * @param {Discord.Message} message The message sent
   * @param {string} commandName The name of the command, that the user sent, can be an alias name
   * @param {Object} command The command
   * @return {Promise<Discord.Message>}
   */
  sendCommandHelp: async function(message, commandName, command) {
    const options = { year: 'numeric', month: 'short', day: 'numeric', hour: 'numeric', minute: 'numeric', timeZone: 'UTC', timeZoneName: 'short' };

    const embed =  new Discord.RichEmbed()
      .setAuthor(`${prefix}${commandName} | Eclipse Bot Help`)
      .setColor(0xe7a237)
      .setFooter(`Requested by ${message.member.displayName} on ${message.createdAt.toLocaleString('en-US', options)}`, message.author.avatarURL)
      .setDescription(outdent`
        ${outdent}
        *${command.description}*

        **Type**: ${command.type === 'essentials' ? 'Essentials' : command.type === 'misc' ? 'Miscellaneous' : command.type === 'leadership' ? 'Leadership' : command.type === 'developer' ? 'Developer' : 'Default'}
        **Usage**: ${prefix}${command.name} ${command.usage ? command.usage : ''}
        ${command.aliases ? `**Aliases**: ${command.aliases.map(c => c = `${prefix}${c}`).join(', ')}` : ''}
      `);

    return message.channel.send(embed);
  },

  /**
   * Called from help command.
   * @param {Discord.Message} message The message sent
   * @param {Array<Object>} commands All commands (that are not in development)
   * @return {Promise<Discord.Message>}
   */
  sendAllCommandHelp: async function(message, commands) {
    const options = { year: 'numeric', month: 'short', day: 'numeric', hour: 'numeric', minute: 'numeric', timeZone: 'UTC', timeZoneName: 'short' };

    const embed =  new Discord.RichEmbed()
      .setAuthor('Eclipse Bot Help')
      .setDescription('**<mandatory argument> [optional argument]**\n\u200b')
      .setColor(0xe7a237)
      .setFooter(`Requested by ${message.member.displayName} on ${message.createdAt.toLocaleString('en-US', options)}`, message.author.avatarURL);

    for (const commandCategory of commands) {
      if (commandCategory.type === 'leadership' && message.channel.parentID !== channelCategory.leadership)
        continue;

      let header = [];
      switch (commandCategory.type) {
        case 'essentials': header = ['⭐ Essentials', '*Important commands*']; break;
        case 'leadership': header = ['🛑 Leadership', '*Must have the roles to use*']; break;
        case 'misc'      : header = ['😂 Miscellaneous', '*Random stuff for our members*']; break;
      }

      embed.addField(header[0], header[1]);
      for (const command of commandCategory.commandList)
        embed.addField(`${prefix}${command.name} ${command.usage ? command.usage : ''}`, command == commandCategory.commandList[commandCategory.commandList.length - 1] && commandCategory !== commands[commands.length - 1] ? `${command.description} \n\u200b` : command.description);
    }

    return message.channel.send(embed);
  },

  /**
   * Sends an image to the channel.
   * @param {Discord.Message} message The message sent
   * @param {Array<string> | string} info The image(s) link(s)
   * @param {number} delay The delay of this message to send
   * @return {Promise<Discord.Message>}
   */
  sendImage: async function(message, info, delay) {
    const { description, url } = info;
    
    if (!delay || isNaN(delay)) delay = 0;
        
    return new Promise(resolve => {
      setTimeout(() => {
        resolve(message.channel.send(description ? description : '', { files: Array.isArray(url) ? url : [ url ] }));
      }, delay)
    });
  },

  /**
   * Called when a new member joins the server.
   * @param {Discord.GuildMember} member The member that joined
   * @return {Promise<Discord.Message>}
   */
  sendWelcomeMessage: async function(member) {
    const message = { channel: member.guild.channels.get(channel.welcome) };

    return this.sendMessage(message, {
      description: outdent`
        ${outdent}
        Welcome **${member.displayName}** to the ${member.guild.name} Discord server!

        1. If you want to apply, make sure to read the [clan rules](${rules}), and fill out the form in the end. Apply in-game with the [RCS password](${password}).

        2. Tag <@&${group.leadership}> to get your roles.
      `,
      color: 0x43b581,
    });
  },

  /**
   * Called when a new member leaves the server.
   * @param {Discord.GuildMember} member The member that left
   * @return {Promise<Discord.Message>}
   */
  sendLeaveMessage: async function(member) {
    const message = { channel: member.guild.channels.get(channel.welcome) };

    return this.sendMessage(message, {
      description: `**${member.displayName}** has left the server`,
      color: 0xf04747,
    });
  },

  /**
   * Called when a member is kicked from the server.
   * @param {Discord.Message} message The message used to kick the member
   * @param {Discord.GuildMember} member The member that is kicked
   * @param {string} reason Reason for kicking
   * @return {Promise<Discord.Message>}
   */
  sendKickMessage: async function(message, member, reason) {
    return this.sendMessage({ channel: message.guild.channels.get(channel.leadernotes) }, {
      description: outdent`
        ${outdent}
        **${member.displayName}** is kicked by ${message.member.displayName}
        ${reason ? `*${reason}*` : ''}
      `,
      color: 0xf04747,
    });
  },

  /**
   * Sends a message to the channel.
   * @param {Discord.Message} message The message sent
   * @param {Object} info Data to put in rich embed
   * @return {Promise<Discord.Message>}
   */
  sendMessage: async function(message, info) {
    return this.send(message, {
      title: info.title ? info.title : '',
      avatar: info.avatar ? info.avatar : '',
      color: info.color ? info.color : 0x3498db,
      description: info.description ? info.description : '',
      footer: info.request ? `Requested by ${message.member.displayName}` : '',
    });
  },

  /**
   * Sent when member types inexistent command.
   * @param {Discord.Message} message The message sent
   * @return {Promise<Discord.Message>}
   */
  sendCommandDoesNotExistError: async function(message) {
    return this.sendError(message, {
      color: 0xf06c00,
      message: 'This command does not exist',
      submessage: 'Type `+help` for full list of commands',
    });
  },

  /**
   * Sent when member types wrgong argument for command.
   * @param {Discord.Message} message The message sent
   * @param {Object} command The command itself
   * @param {string} [warning] The warning for member
   * @return {Promise<Discord.Message>}
   */
  sendArgumentError: async function(message, command, warning) {
    return this.sendError(message, {
      title: '❌ Argument Error',
      color: 0xf06c00,
      message: warning ? warning : 'This argument does not exist',
      submessage: `Proper usage is ${prefix}${command.name} ${command.usage ? command.usage : ''}`,
    });
  },

  /**
   * Sent when member does not enough permissions to execute command.
   * @param {Discord.Message} message The message sent
   * @return {Promise<Discord.Message>}
   */
  sendPermissionError: async function(message) {
    return this.sendError(message, {
      title: '🚫 Permission Denied',
      message: ' You do not have permissions to use this command',
      submessage: 'Thanks for understanding',
    });
  },

  /**
   * Sent when member tries to use a command on a bot.
   * @param {Discord.Message} message The message sent
   * @param {Discord.GuildMember} bot The bot details
   * @return {Promise<Discord.Message>}
   */
  sendBotTagError: async function(message, bot) {
    return this.sendError(message, {
      title: '🤖 Error',
      color: 0xf06c00,
      message: `${bot.displayName} is a bot`,
      submessage: 'You cannot use this command on a bot',
    });
  },

  /**
   * Sent when an error arises in this code.
   * @param {Discord.Message} message The message sent
   * @return {Promise<Discord.Message>}
   */
  sendDeveloperError: async function(message) {
    return this.sendError(message, {
      message: 'Oops',
      submessage: 'Something went wrong. Please let dev team know',
    });
  },

  /**
   * Sent when an error happens, any type of error.
   * @param {Discord.Message} message The message sent
   * @param {Object} error Data to put into rich embed
   * @return {Promise<Discord.Message>}
   */
  sendError: async function(message, error) {
    return this.send(message, {
      title: error.title ? error.title : '❌ Error',
      color: error.color ? error.color : 0xff0000,
      message: error.message,
      submessage: `${error.submessage}.`,
    });
  },

  /**
   * Sends a rich embed text.
   * @param {Discord.Message} message The message sent
   * @param {Object} info Data to put into rich embed
   * @return {Promise<Discord.Message>}
   */
  send: async function(message, info) {
    const embed = new Discord.RichEmbed()
      .setAuthor(info.title ? info.title : '', info.avatar ? info.avatar : '')
      .setDescription(info.description ? info.description : '')
      .setColor(info.color ? info.color : 0xcccccc)
      .setFooter(info.footer ? info.footer : '');

    if (info.message && info.submessage)
      embed.addField(info.message ? info.message : '', info.submessage ? info.submessage : '');

    return message.channel.send(embed);
  },
};
