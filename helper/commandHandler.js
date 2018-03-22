const { prefix, filterWords } = require('../data/config.js');

const check = require('../misc/check.js');

const messenger = require('./messenger.js');
const playerManager = require('./playerManager.js');

module.exports = {
  handleMessage: function(message) {
    const { content, channel, author, guild, client } = message;

    /* Hahaha */
    if (message.content.includes('stupid'))
      return message.client.commands.get('stupidbot').execute(message);

    /* Deletes offensive language */
    if (filterWords.some(word => content.toLowerCase().includes(word))) {
      return message.delete()
        .then(() => {
          channel.send(`💢 Watch your language ${author}`)
            .then((msg) => msg.delete(2000))
            .catch(e => console.error(e));
        })
        .catch(e => console.error(e));
    }

    /* Ignores message from bots and non-members, and direct messages */
    if (author.bot || !check.verifyMember(message) || !guild) return;

    /* Point monitoring for any message sent by user */
    playerManager.updatePoints(message);

    /* Ignores numbers, non-commands, bot messages, and direct messages */
    if (!isNaN(content.replace(/ /g, '')) || !content.startsWith(prefix)) return;

    /* Prepare command, arguments, and options */
    const args = content.toLowerCase().slice(prefix.length).trim().split(/ +/);
    const options = [];

    const commandName = args.shift();
    const command = client.commands.get(commandName) || client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));

    for (let i = 0; i < args.length; i++)
      if (args[i].length > 1 && args[i].startsWith('-') && isNaN(args[i]))
        options.push(args.splice(i--, 1).pop().slice(1));

    /* Verify general command format and permissions */
    if (!command) {
      messenger.sendCommandDoesNotExistError(message).catch(e => console.error(e));
      return;
    }

    if (command.type === 'leadership' && !check.verifyLeadership(message) ||
        command.type === 'developer' && !check.verifyDeveloper(message)) {
      messenger.sendPermissionError(message).catch(e => console.error(e));
      return;
    }

    if (command.args && !check.verifyArgument(args, command)) {
      messenger.sendArgumentError(message, command, `You must provide ${command.args == 1 ? 'an argument' : `${command.args} arguments`}`)
        .catch(e => console.error(e));
      return;
    }

    if (command.tag && !check.verifyTag(message.mentions.users, command)) {
      messenger.sendArgumentError(message, command, `You need to tag ${command.tag > 1 ? `${command.tag}  users` : 'a user'}`)
        .catch(e => console.error(e));
      return;
    }

    /* Execute command */
    command.execute(message, {
      args: args,
      options: options,
    }).catch(e => {
      console.error(e);
      messenger.sendDeveloperError(message).catch(f => console.error(f));
    });
  },

  /* Special command if I need to import data from Mee6 to Eclipse Bot */
  handleMee6: function(message) {
    const m = message.content.split('\n').splice(1, 2);
    m[0] = m[0].slice(4, -4);

    if (m.length != 4) return;

    console.log(m[0]);
    m[0] = message.guild.members.find(member => member.user.username === m[0]);

    if (!m[0]) return console.log('Failed\n');

    m[0] = m[0].id;
    m[1] = parseInt(m[1].slice(m[1].indexOf('('), m[1].indexOf(')')).slice(6));

    playerManager.setPoints(message, { id: m[0] }, { exp: m[1] });

    const { exp, level, ranking } = message.client.points.get(m[0]);
    return message.channel.send(`Set <@${m[0]}>'s exp to ${exp}, level ${level}, ${ranking} ER`);
  },
};
