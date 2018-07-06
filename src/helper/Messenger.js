const { categoryChannel, channel, clanName, role, rules, password, prefix, reply: replyConfig } = require('../config/config.js');
const Discord = require('discord.js');
const moment = require('moment');
const outdent = require('outdent');

const COLOR_HELP = 0xe7a237;
const DATE_FORMAT = 'MMM D, YYYY [at] h:mm A z';
const DELETE_COOLDOWN = 5000;
const DEFAULT_RANKINGEMBED = 25;

const FOOTER_REQUEST = (message, timeRequest) => `Requested by ${message.member.displayName} ${timeRequest ? `on ${moment(message.createdAt).format(DATE_FORMAT)}` : ''}`;

let working = false;

function createEmbed(info) {
  const embed = new Discord.RichEmbed()
    .setAuthor(info.title ? info.title : '', info.avatar ? info.avatar : '')
    .setDescription(info.description ? info.description : '')
    .setColor(info.color ? info.color : 0xcccccc)
    .setFooter(info.footer ? info.footer : '');

  // generally for errors
  if (info.message && info.submessage) embed.addField(info.message, info.submessage);

  // other uses, currently sendAllCommandHelp and scout
  if (info.fields && info.fields.length > 0) {
    for (const field of info.fields) {
      embed.addField(field.title, field.description);
    }
  }

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
    const type = {
      essentials: 'Essentials',
      misc: 'Miscellaneous',
      eclipse: 'Eclipse',
      leadership: 'Leadership',
      developer: 'Developer',
    };

    const description = outdent`
      ${outdent}
      ${command.description}${command.details ? `\n\n${command.details}` : ''}

      **Type**: ${type[command.type] || 'Default'}
      **Usage**: ${prefix}${command.name} ${command.usage ? command.usage : ''}
      ${command.aliases ? `**Aliases**: ${command.aliases.map(c => `${prefix}${c}`).join(', ')}` : ''}
    `;

    Messenger.sendMessage(message, {
      title: `${command.name} | Eclipse Bot Help`,
      avatar: message.client.user.avatarURL,
      description: description,
      color: COLOR_HELP,
      request: true,
      requestTime: true,
    });
  }

  static sendAllCommandHelp(message, commandCategories) {
    const description = [
      [
        {
          title: 'Reddit Eclipse\'s custom Discord bot',
          description: 'Have a request or found an issue? Create one in our [GitHub issues page](https://github.com/Luis729/reddit-eclipse-bot)',
        },
        {
          title: 'Command Format',
          description: `${prefix}commandName <mandatory> [optional]`,
        },
      ],
    ];

    let tempDescription = [];
    for (const commandCategory of commandCategories) {
      if (commandCategory.type === 'leadership' && message.channel.parentID !== categoryChannel.leadership) {
        continue;
      }

      tempDescription.push({ title: commandCategory.categoryHeader[0], description: commandCategory.categoryHeader[1] });
      for (const command of commandCategory.commands) {
        tempDescription.push({
          title: `${prefix}${command.name} ${command.usage ? command.usage : ''}`,
          description: command.description,
        });
      }
      description.push(tempDescription);
      tempDescription = [];
    }

    Messenger.sendMessages(message, {
      title: 'Eclipse Bot Help',
      avatar: message.client.user.avatarURL,
      description: description,
      color: COLOR_HELP,
      request: true,
      requestTime: true,
    });
  }

  static sendScoutTips(message, details) {
    const description = ['Use these tips to guide you in scouting a base'];

    if (details.length === 0 || details.some(d => !d.fields)) {
      description[0] = 'No tips have been made yet';
    }

    let tempDescription = [];
    for (const detail of details) {
      tempDescription.push({ title: detail.title, description: detail.description });
      for (const field of detail.fields) {
        tempDescription.push({ title: field.title, description: field.description && field.description.length > 0 ? field.description.map(desc => `- ${desc}`) : 'No tips have been made for this yet' });
      }
      description.push(tempDescription);
      tempDescription = [];
    }

    Messenger.sendMessages(message, {
      title: '🛡️ Scout Guidelines',
      description: description,
      color: 0x84d6e7,
      request: true,
    });
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
      submessage: message.args[0] === 'help' ? `Did you mean \`${prefix}help ${commandName || command.name}\`` : `Proper usage is ${prefix}${commandName || command.name} ${command.usage ? command.usage : ''}`,
      submessageEnding: '?',
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

  // this supports fields or normal descriptions
  static async sendMessages(message, info, remove, removeDelay) {
    for (let i = 0; i < info.description.length; i++) {
      const embedInfo = {
        title: i === 0 ? info.title : null,
        avatar: i === 0 ? info.avatar : null,
        color: info.color,
        footer: i === info.description.length - 1 ? info.footer : null,
        request: i === info.description.length - 1 ? info.request : null,
        requestTime: info.requestTime,
      };

      // this means that the description is an array of fields, so
      // we will convert it from description to fields
      if (Array.isArray(info.description[i])) {
        embedInfo.fields = info.description[i];
      } else {
        embedInfo.description = info.description[i];
      }

      await Messenger.sendMessage(message, embedInfo, remove, removeDelay); // eslint-disable-line
    }
  }

  // this only supports normal descriptions
  // fields are excluded for errors
  static sendMessage(message, info, remove, removeDelay) {
    Messenger.send(message, {
      title: info.title ? info.title : '',
      avatar: info.avatar ? info.avatar : '',
      color: info.color ? info.color : 0x3498db,
      fields: info.fields ? info.fields : '',
      description: info.description ? info.description : '',
      footer: info.footer ? info.footer : info.request ? FOOTER_REQUEST(message, info.requestTime) : '',
    }, remove, removeDelay);
  }

  static sendError(message, error) {
    Messenger.send(message, {
      title: error.title ? error.title : '❌ Error',
      color: error.color ? error.color : 0xff0000,
      message: error.message,
      submessage: `${error.submessage}${error.submessageEnding || '.'}`,
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
