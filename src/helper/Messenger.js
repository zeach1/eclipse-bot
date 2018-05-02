'use strict';

const { categoryChannel, channel, role, rules, password, prefix } = require('../data/config.js');
const Discord = require('discord.js');
const outdent = require('outdent');
const Util = require('./Util.js');

const options = { year: 'numeric', month: 'short', day: 'numeric', hour: 'numeric', minute: 'numeric', timeZoneName: 'short' };

class Messenger {
  static sendCommandHelp(message, command) {
    const type = { essentials: 'Essentials', misc: 'Miscellaneous', leadership: 'Leadership', developer: 'Developer' };
    const { date, time } = Util.getDateTimeLocale(message.createdAt, 'en-US', options);

    const embed = new Discord.RichEmbed()
      .setAuthor(`${command.name} | Eclipse Bot Help`, message.client.user.avatarURL)
      .setColor(0xe7a237)
      .setFooter(`Requested by ${message.member.displayName} on ${date} at ${time}`)
      .setDescription(outdent`
        ${outdent}
        *${command.description}*

        **Type**: ${type[command.type] || 'Default'}
        **Usage**: ${prefix}${command.name} ${command.usage ? command.usage : ''}
        ${command.aliases ? `**Aliases**: ${command.aliases.map(c => `${prefix}${c}`).join(', ')}` : ''}
      `);

    message.channel.send(embed).catch(console.error);
  }

  static sendAllCommandHelp(message, commands) {
    const { date, time } = Util.getDateTimeLocale(message.createdAt, 'en-US', options);

    const embed = new Discord.RichEmbed()
      .setAuthor('Eclipse Bot Help', message.client.user.avatarURL)
      .setDescription(`*${prefix}commandName <mandatory> [optional]*\n\u200b`)
      .setColor(0xe7a237)
      .setFooter(`Requested by ${message.member.displayName} on ${date} at ${time}`);

    for (let i = 0; i < commands.length; i++) {
      const commandCategory = commands[i];
      if (commandCategory.type === 'leadership' && message.channel.parentID !== categoryChannel.leadership) {
        continue;
      }

      let categoryHeader = [];
      switch (commandCategory.type) {
        case 'essentials': categoryHeader = ['⭐ Essentials', '*Important commands*']; break;
        case 'leadership': categoryHeader = ['🛑 Leadership', '*Must have the roles to use*']; break;
        case 'misc': categoryHeader = ['😂 Miscellaneous', '*Random stuff for our members*']; break;
      }

      embed.addField(categoryHeader[0], categoryHeader[1]);
      for (let j = 0; j < commandCategory.commands.length; j++) {
        const command = commandCategory.commands[j];
        const title = `${prefix}${command.name} ${command.usage ? command.usage : ''}`;
        const description = i === commands.length - 1 && j === commandCategory.commands.length - 1 ?
          `${command.description}\n\u200b` : command.description;
        embed.addField(title, description);
      }
    }
    embed.addField('\n\u200bHave a request or found an issue?', '*Create one in our [GitHub issues page](https://github.com/Luis729/reddit-eclipse-bot)*');

    message.channel.send(embed).catch(console.error);
  }

  static sendImage(message, data, delay) {
    const { comment, url } = data;
    if (!parseInt(delay)) delay = 0;

    return new Promise(resolve => {
      setTimeout(() => {
        resolve(message.channel.send(comment ? comment : '', { files: Array.isArray(url) ? url : [url] }).catch(console.error));
      }, delay);
    });
  }

  static sendWelcomeMessage(member) {
    const message = { channel: member.guild.channels.get(channel.welcome) };

    Messenger.sendMessage(message, {
      description: outdent`
        ${outdent}
        Welcome **${member.displayName}** to the ${member.guild.name} Discord server!

        1. If you want to apply, make sure to read the [clan rules](${rules}), and fill out the form in the end. Apply in-game with the [RCS password](${password}).

        2. Tag <@&${role.leadership}> to get your roles.
      `,
      color: 0x43b581,
    });
  }

  static sendLeaveMessage(member) {
    const message = { channel: member.guild.channels.get(channel.welcome) };

    Messenger.sendMessage(message, {
      description: `**${member.displayName}** has left the server`,
      color: 0xf04747,
    });
  }

  static sendKickMessage(message, member, reason) {
    Messenger.sendMessage({ channel: message.guild.channels.get(channel.leader_notes) }, {
      description: outdent`
        ${outdent}
        **${member.displayName}** is kicked by ${message.member.displayName}
        ${reason ? `*${reason}*` : ''}
      `,
      color: 0xf04747,
    });
  }

  static sendCommandDoesNotExistError(message) {
    Messenger.sendError(message, {
      color: 0xf06c00,
      message: 'This command does not exist',
      submessage: `Type \`${prefix}help\` for full list of commands`,
    });
  }

  static sendArgumentError(message, command, warning) {
    Messenger.sendError(message, {
      title: '❌ Argument Error',
      color: 0xf06c00,
      message: warning ? warning : 'This argument does not exist',
      submessage: `Proper usage is ${prefix}${command.name} ${command.usage ? command.usage : ''}`,
    });
  }

  static sendPermissionError(message) {
    Messenger.sendError(message, {
      title: '🚫 Permission Denied',
      message: ' You do not have permissions to use this command',
      submessage: 'Thanks for understanding',
    });
  }

  static sendBotTagError(message, bot) {
    Messenger.sendError(message, {
      title: '🤖 Error',
      color: 0xf06c00,
      message: `${bot.displayName} is a bot`,
      submessage: 'You cannot use this command on a bot',
    });
  }

  static sendDeveloperError(message) {
    Messenger.sendError(message, {
      message: '😅 Oops',
      submessage: 'Something went wrong\nSend an issues through the [GitHub issues page](https://github.com/Luis729/reddit-eclipse-bot)',
    });
  }

  static sendMessage(message, info) {
    Messenger.send(message, {
      title: info.title ? info.title : '',
      avatar: info.avatar ? info.avatar : '',
      color: info.color ? info.color : 0x3498db,
      description: info.description ? info.description : '',
      footer: info.request ? `Requested by ${message.member.displayName}` : '',
    });
  }

  static sendError(message, error) {
    Messenger.send(message, {
      title: error.title ? error.title : '❌ Error',
      color: error.color ? error.color : 0xff0000,
      message: error.message,
      submessage: `${error.submessage}.`,
    });
  }

  static send(message, info) {
    const embed = new Discord.RichEmbed()
      .setAuthor(info.title ? info.title : '', info.avatar ? info.avatar : '')
      .setDescription(info.description ? info.description : '')
      .setColor(info.color ? info.color : 0xcccccc)
      .setFooter(info.footer ? info.footer : '');

    if (info.message && info.submessage) embed.addField(info.message, info.submessage);

    message.channel.send(embed).catch(console.error);
  }
}

module.exports = Messenger;
