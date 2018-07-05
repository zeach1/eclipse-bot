const { categoryChannel, channel, clanName, role, rules, password, prefix, reply: replyConfig } = require('../config/config.js');
const Discord = require('discord.js');
const moment = require('moment');
const outdent = require('outdent');

const DATE_FORMAT = 'MMM D, YYYY [at] h:mm A z';
const DELETE_COOLDOWN = 5000;
const DEFAULT_RANKINGEMBED = 25;

let working = false;

function createEmbed(info) {
  const embed = new Discord.RichEmbed()
    .setAuthor(info.title ? info.title : '', info.avatar ? info.avatar : '')
    .setDescription(info.description ? info.description : '')
    .setColor(info.color ? info.color : 0xcccccc)
    .setFooter(info.footer ? info.footer : '');

  if (info.message && info.submessage) embed.addField(info.message, info.submessage);

  return embed;
}

function sendImage(message, data) {
  const { comment, url, delay } = data;

  return new Promise(resolve => {
    setTimeout(() => {
      resolve(message.channel.send(comment ? comment : '', { files: Array.isArray(url) ? url : [url] }).catch(e => Messenger.sendDeveloperError(message, e)));
    }, delay);
  });
}

class Messenger {
  static sendCommandHelp(message, command) {
    const type = { essentials: 'Essentials', misc: 'Miscellaneous', leadership: 'Leadership', developer: 'Developer' };

    const embed = new Discord.RichEmbed()
      .setAuthor(`${command.name} | Eclipse Bot Help`, message.client.user.avatarURL)
      .setColor(0xe7a237)
      .setFooter(`Requested by ${message.member.displayName} on ${moment(message.createdAt).format(DATE_FORMAT)}`)
      .setDescription(outdent`
        ${outdent}
        *${command.description}*

        **Type**: ${type[command.type] || 'Default'}
        **Usage**: ${prefix}${command.name} ${command.usage ? command.usage : ''}
        ${command.aliases ? `**Aliases**: ${command.aliases.map(c => `${prefix}${c}`).join(', ')}` : ''}
      `);

    message.channel.send(embed).catch(e => Messenger.sendDeveloperError(message, e));
  }

  static async sendAllCommandHelp(message, commands) {
    if (working) return;
    working = true;

    const embed = new Discord.RichEmbed()
      .setAuthor('Eclipse Bot Help', message.client.user.avatarURL)
      .setDescription('Have a request or found an issue? Create one in our [GitHub issues page](https://github.com/Luis729/reddit-eclipse-bot)')
      .addField('Command Format', `${prefix}commandName <mandatory> [optional]`)
      .setColor(0xe7a237);

    // commands -> [essentials, misc, leadership]
    if (message.channel.parentID !== categoryChannel.leadership) {
      commands.pop();
    }

    const embeds = [];
    for (let i = 0; i < commands.length; i++) {
      const commandCategory = commands[i];

      let categoryHeader = [];
      switch (commandCategory.type) {
        case 'essentials': categoryHeader = ['⭐ Essentials', '*Important commands*']; break;
        case 'leadership': categoryHeader = ['🛑 Leadership', '*Must have the roles to use*']; break;
        case 'misc': categoryHeader = ['😂 Miscellaneous', '*Random stuff for our members*']; break;
      }

      const commandEmbed = new Discord.RichEmbed()
        .setAuthor(categoryHeader[0])
        .setDescription(categoryHeader[1])
        .setColor(0xe7a237);

      if (i === commands.length - 1) {
        commandEmbed.setFooter(`Requested by ${message.member.displayName} on ${moment(message.createdAt).format(DATE_FORMAT)}`);
      }

      for (let j = 0; j < commandCategory.commands.length; j++) {
        const command = commandCategory.commands[j];
        const title = `${prefix}${command.name} ${command.usage ? command.usage : ''}`;
        const description = i === commands.length - 1 && j === commandCategory.commands.length - 1 ?
          `${command.description}\n\u200b` : command.description;

        commandEmbed.addField(title, description);
      }

      embeds.push(commandEmbed);
    }

    await message.channel.send(embed).catch(e => Messenger.sendDeveloperError(message, e));
    for (const commandEmbed of embeds) {
      await message.channel.send(commandEmbed).catch(e => Messenger.sendDeveloperError(message, e)); // eslint-disable-line
    }
    working = false;
  }

  static async sendScoutMessage(message, guidelines, compositions) {
    const introEmbed = createEmbed({
      title: '🛡️ Scout Guidelines',
      description: 'Use these tips to guide you in scouting a base',
      color: 0x84d6e7,
    });

    const guidelineEmbed = createEmbed({
      title: 'Important Parts to Scout',
      color: 0x84d6e7,
    });

    const armyEmbed = createEmbed({
      title: 'Recommended Army Compositions',
      color: 0x84d6e7,
      footer: `Requested by ${message.member.displayName}`,
    });

    const embeds = [introEmbed, guidelineEmbed, armyEmbed];

    if (!guidelines || guidelines.length === 0) guidelineEmbed.addField('Notice', 'No guidelines has been made yet');
    if (!compositions || compositions.length === 0) armyEmbed.addField('Notice', 'No recommended army composition has been made yet');

    for (const guideline of guidelines) {
      if (guideline.topic && guideline.tips && guideline.tips.length > 0) {
        guidelineEmbed.addField(guideline.topic, guideline.tips.map(tip => `- ${tip}`));
      } else {
        guidelineEmbed.addField(guideline.topic, 'No tips written for this yet');
      }
    }

    for (const comp of compositions) {
      console.log(comp);
      if (comp.name && comp.armies && comp.armies.length > 0) {
        armyEmbed.addField(comp.name, comp.armies.map(c => `- ${c}`));
      } else {
        armyEmbed.addField(comp.name, 'No armies written for this yet');
      }
    }

    for (const embed of embeds) {
      await message.channel.send(embed).catch(e => Messenger.sendDeveloperError(message, e)); // eslint-disable-line
    }
  }

  static async sendImages(message, info) {
    if (working) return;
    working = true;

    info = Array.isArray(info) ? info : [info];
    for (const data of info) {
      // eslint-disable-next-line
      await sendImage(message, data).catch(e => Messenger.sendDeveloperError(message, e));
    }

    working = false;
  }

  static sendWelcomeMessage(member) {
    const message = { channel: member.guild.channels.get(channel.welcome) };

    Messenger.sendMessage(message, {
      description: outdent`
        ${outdent}
        Welcome **${member.displayName}** to the ${clanName} Discord server!

        Change your Discord nickname to your Clash of Clans IGN.

        Tag <@&${role.leadership}> to get your roles.

        If you are applying:
          1. Apply in-game with the [RCS password](${password}).
          2. Read the [clan rules](${rules}) and fill out the form in the end.
      `,
      color: 0x43b581,
    });

    // ping the member
    message.channel.send(`${member}`)
      .then(msg => msg.delete(2000).catch(() => {}))
      .catch(e => Messenger.sendDeveloperError(message, e));
  }

  static sendSuccessMessage(message, info) {
    info.color = 0x3ea92e;
    info.title = info.title ? info.title : '✅ Success';
    Messenger.sendMessage(message, info);
  }

  static sendLeaveMessage(member) {
    const message = { channel: member.guild.channels.get(channel.welcome) };

    Messenger.sendMessage(message, {
      description: `**${member.displayName}** has left the server`,
      color: 0xf04747,
    });
  }

  static sendKickMessage(message, member, reason) {
    const logMessage = { channel: message.guild.channels.get(channel.leader_notes) };
    Messenger.sendMessage(logMessage, {
      description: outdent`
        ${outdent}
        **${member.displayName}** is kicked by ${message.member.displayName}
        ${reason ? `*${reason}*` : ''}
      `,
      color: 0xf04747,
    });
  }

  static sendRankings(message, info, data, limit) {
    limit = limit ? limit : DEFAULT_RANKINGEMBED;

    // data contains name, value, and flair
    if (data.length === 0) {
      Messenger.sendMessage(message, {
        title: info.title,
        description: 'None',
        color: info.color,
        footer: info.footer,
        request: info.request,
        requestTime: info.requestTime,
      });
      return;
    }

    const indexStringLength = `${data.length}`.length;
    const valueStringLength = `${data[0].value}`.length;

    const rankingDescription = [];
    let tempRankingDescription = '';
    for (let i = 1; i <= data.length; i++) {
      const { value, name, flair } = data[i - 1];

      const indexString = `${i}`.padEnd(indexStringLength);
      const valueString = `${value}`.padStart(valueStringLength);

      tempRankingDescription += `\`${indexString} ${valueString}\` | ${flair ? flair : ''} ${name.substring(0, 25)}\n`;
      if (i % limit === 0 && i !== data.length) {
        rankingDescription.push(tempRankingDescription);
        tempRankingDescription = '';
      }
    }
    rankingDescription.push(tempRankingDescription);

    Messenger.sendMessages(message, {
      title: info.title,
      description: rankingDescription,
      color: info.color,
      footer: info.footer,
      request: info.request,
      requestTime: info.requestTime,
    });
  }

  static sendCommandDoesNotExistError(message) {
    Messenger.sendError(message, {
      color: 0xf06c00,
      message: 'This command does not exist',
      submessage: `Type \`${prefix}help\` for full list of commands`,
    });
  }

  static sendArgumentError(message, command, warning, commandName) {
    Messenger.sendError(message, {
      title: '❌ Argument Error',
      color: 0xf06c00,
      message: warning ? warning : 'This argument does not exist',
      submessage: `Proper usage is ${prefix}${commandName || command.name} ${command.usage ? command.usage : ''}`,
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

  static sendMaintenanceError(message, error) {
    Messenger.sendError(message, {
      title: '⚠️ Maintenance Needed',
      color: 0xecd94a,
      message: 'I need some small tweaks',
      submessage: 'I sent a request to my developers. I will be back up soon - I promise',
    });

    const logMessage = { channel: message.guild.channels.get(channel.development) };
    const eMsg = error.message;
    Messenger.sendError(logMessage, {
      title: '⚠️ Maintenance Needed',
      color: 0xEc7e4a,
      message: 'Time to fix me up!',
      // following checks if the error is a IP error or an API key error
      submessage: `${error.reason.includes('invalidIp') ? `I need a new token for IP **${eMsg.slice(eMsg.indexOf('IP') + 3)}**` : 'The token we are using is invalid'}`,
    });
  }

  static sendDeveloperError(message, error) {
    if (error) console.error(error);
    Messenger.sendError(message, {
      title: '😅 Oops',
      message: 'Something went wrong',
      submessage: 'Send an issue through the our [issues page](https://github.com/Luis729/reddit-eclipse-bot)',
    });
  }

  static sendMessages(message, info, remove) {
    for (let i = 0; i < info.description.length; i++) {
      const embedInfo = {
        title: i === 0 ? info.title : null,
        avatar: i === 0 ? info.avatar : null,
        color: 0xdac31d,
        description: info.description[i],
        footer: i === info.description.length - 1 ? info.footer : null,
        request: i === info.description.length - 1 ? info.request : null,
        requestTime: info.requestTime,
      };
      Messenger.sendMessage(message, embedInfo, remove);
    }
  }

  static sendMessage(message, info, remove) {
    Messenger.send(message, {
      title: info.title ? info.title : '',
      avatar: info.avatar ? info.avatar : '',
      color: info.color ? info.color : 0x3498db,
      description: info.description ? info.description : '',
      footer: info.footer ? info.footer : info.request ? `Requested by ${message.member.displayName} ${info.requestTime ? `on ${moment(message.createdAt).format(DATE_FORMAT)}` : ''}` : '',
    }, remove);
  }

  static sendError(message, error) {
    Messenger.send(message, {
      title: error.title ? error.title : '❌ Error',
      color: error.color ? error.color : 0xff0000,
      message: error.message,
      submessage: `${error.submessage}.`,
    });
  }

  static send(message, info, remove, removeDelay) {
    const embed = createEmbed(info);
    message.channel.send(embed)
      .then(msg => {
        if (remove) msg.delete(removeDelay || DELETE_COOLDOWN).catch(() => {});
      })
      .catch(e => Messenger.sendDeveloperError(message, e));
  }

  static async confirm(message, info) {
    let success = false;
    let replied = false;
    await Messenger.reply(message, {
      content: `⚠️ ${message.author}, ${info.content} (y/n)`,
      embed: info.embed,
    }).then(reply => {
      const replyContent = reply.content.trim().toLowerCase().split(' ')[0];
      replied = true;
      success = replyConfig.yes.includes(replyContent);
    }).catch(() => {});

    if (success && info.yes) {
      await message.channel.send(info.yes).catch(e => Messenger.sendDeveloperError(message, e));
    } else if (!success && replied && info.no) {
      await message.channel.send(info.no).catch(e => Messenger.sendDeveloperError(message, e));
    }

    return success;
  }

  static reply(message, info) {
    if (!info.embed && !info.content) return Promise.reject(new Error('no message content'));

    const { author } = message;

    return new Promise((resolve, reject) => {
      message.channel.send(info.content, {
        embed: info.embed ? createEmbed(info.embed) : null,
      }).then(() => {
        message.channel.awaitMessages(msg => msg.author === author, {
          max: 1,
          time: info.time || 10000,
          errors: ['time'],
        }).then(collected => resolve(collected.first()))
          .catch(reject);
      }).catch(e => Messenger.sendDeveloperError(message, e));
    });
  }
}

module.exports = Messenger;
