const { serverIgnore, prefix, thonkWords, filterWords } = require('../data/config.js');

const check = require('../misc/check.js');

const messenger = require('./messenger.js');
const playerManager = require('./playerManager.js');

module.exports = {
  handleMessage: async function(message) {
    const { content, channel, author, guild, client } = message;

    if (author.id === '159985870458322944') // Mee6
      return this.handleMee6(message);
    
    /* Deletes offensive language */
    if (filterWords.some(word => content.toLowerCase().includes(word)))
      return message.delete()
        .then(() => channel.send(`💢 Watch your language ${author}`)
          .then(msg => msg.delete(3000).catch(() => {})));

    /* Ignores message from bots and non-members */
    if (author.bot || !check.verifyMember(message)) return;

    /* Adds an exp to member */
    playerManager.updatePoints(message);

    /* Hahaha */
    if (thonkWords.find(m => message.content.toLowerCase().includes(m)))
      return message.channel.send('**NO U**');

    /* Ignores numbers and non-commands */
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
    if (!command)
      return messenger.sendCommandDoesNotExistError(message);

    if (command.type === 'leadership' && !check.verifyLeadership(message) ||
        command.type === 'developer' && !check.verifyDeveloper(message))
      return messenger.sendPermissionError(message);

    if (command.args && !check.verifyArgument(args, command))
      return messenger.sendArgumentError(message, command, `You must provide ${command.args == 1 ? 'an argument' : `${command.args} arguments`}`);

    if (command.tag && !check.verifyTag(message.mentions.users, command))
      return messenger.sendArgumentError(message, command, `You need to tag ${command.tag > 1 ? `${command.tag}  users` : 'a user'}`);

    /* Execute command */
    return command.execute(message, {
      args: args,
      options: options,
    });
  },

  /* Special command if I need to import data from Mee6 to Eclipse Bot */
  handleMee6: async function(message) {
    if (!message.embeds) return;
    
    const { author, fields } = message.embeds[0];
    
    const USERNAME = author.name;
    const xp = fields[2].value;
    const EXP = parseInt(xp.slice(xp.indexOf('('), xp.indexOf(')')).slice(6));
    
    const MEMBER = message.guild.members.find(member => member.user.username === USERNAME);

    if (!MEMBER) return console.error(`Failed ${USERNAME}\n`);

    playerManager.setPlayer(message, { id: MEMBER.id }, { exp: EXP, ranking: 5000 });

    const { exp, level, ranking } = message.client.points.get(MEMBER.id);
    return message.channel.send(`Set ${MEMBER.displayName}'s exp to ${exp}, level ${level}, ${ranking} ER`);
  },
};
